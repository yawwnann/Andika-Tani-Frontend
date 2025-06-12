// File: src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import {
  ShoppingCartIcon,
  UserCircleIcon,
  MapPinIcon,
  PhoneIcon,
  PencilIcon,
  CreditCardIcon,
  ArrowPathIcon,
  XCircleIcon,
  InformationCircleIcon, // Pastikan ini diimpor
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as SolidCheckCircle,
  XCircleIcon as SolidXCircle,
} from "@heroicons/react/24/solid";
import { CheckoutPageSkeleton } from "../components/CheckoutSkeletons"; // Contoh jika helper & skeleton di file terpisah
import { formatRupiah } from "../components/formatRupiah"; // Pastikan path ini benar

function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [checkoutError, setCheckoutError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    namaPemesan: "",
    nomorHp: "",
    alamatPengiriman: "",
    catatan: "",
  });
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCartAndUser = async () => {
      setLoadingCart(true);
      setCheckoutError(null);
      setCurrentUser(null);
      setCartItems([]);
      try {
        let userData = null;
        try {
          const userResponse = await apiClient.get("/user");
          if (isMounted && userResponse.data) {
            userData = userResponse.data.user;
            setCurrentUser(userData);
            setFormData((prev) => ({
              ...prev,
              namaPemesan: userData.name || "",
              nomorHp: userData.phone || userData.nomor_whatsapp || "",
            }));
          }
        } catch (userErr) {
          if (isMounted)
            console.warn("Gagal memuat data user:", userErr.message);
          if (userErr.response && userErr.response.status === 401) {
            navigate("/login");
            return;
          }
        }
        const cartResponse = await apiClient.get("/keranjang");
        if (isMounted) {
          if (cartResponse.data && Array.isArray(cartResponse.data.data)) {
            setCartItems(cartResponse.data.data);
          } else {
            setCartItems([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Gagal memuat data checkout:", err);
          if (err.response && err.response.status === 401) {
            setCheckoutError("Sesi Anda berakhir. Silakan login kembali.");
          } else {
            setCheckoutError(
              "Gagal memuat data keranjang. Muat ulang halaman."
            );
          }
          setCartItems([]);
        }
      } finally {
        if (isMounted) setLoadingCart(false);
      }
    };
    fetchCartAndUser();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateItemSubtotal = (item) =>
    (item.pupuk?.harga || 0) * (item.quantity || 0);
  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + calculateItemSubtotal(item), 0);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Keranjang Anda kosong.");
      return;
    }
    if (
      !formData.namaPemesan.trim() ||
      !formData.nomorHp.trim() ||
      !formData.alamatPengiriman.trim()
    ) {
      alert("Harap lengkapi Nama Penerima, Nomor HP, dan Alamat Pengiriman.");
      return;
    }
    setIsProcessingOrder(true);
    setCheckoutError(null);

    // Dapatkan tanggal saat ini dalam format YYYY-MM-DD
    const today = new Date();
    const tanggalPesananFormatted = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

    const orderPayload = {
      user_id: currentUser?.id || null,
      nama_pelanggan: formData.namaPemesan,
      nomor_whatsapp: formData.nomorHp,
      alamat_pengiriman: formData.alamatPengiriman,
      catatan: formData.catatan,
      tanggal_pesanan: tanggalPesananFormatted, // <--- PERBAIKAN: Tambahkan tanggal_pesanan
      items: cartItems.map((item) => ({
        pupuk_id: item.pupuk.id,
        jumlah: item.quantity,
        harga_saat_pesanan: item.pupuk.harga,
      })),
      total_harga: calculateTotal(),
    };
    try {
      const response = await apiClient.post("/pesanan", orderPayload);
      if (response.data && response.data.data && response.data.data.id) {
        const createdOrderData = response.data.data;
        setCartItems([]); // Kosongkan keranjang setelah order dibuat
        navigate(`/payment/${createdOrderData.id}`, {
          state: { order: createdOrderData },
        });
      } else {
        throw new Error("Respons pembuatan pesanan tidak valid.");
      }
    } catch (error) {
      console.error(
        "Gagal membuat pesanan:",
        error.response?.data || error.message
      );
      const serverErrorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat membuat pesanan.";
      const validationErrors = error.response?.data?.errors;
      let displayError = serverErrorMessage;
      if (validationErrors) {
        displayError +=
          "\n\nDetail:\n" + Object.values(validationErrors).flat().join("\n");
      }
      setCheckoutError(displayError);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-white">
      {/* Header Checkout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
          Checkout
        </h1>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {loadingCart ? (
          <CheckoutPageSkeleton />
        ) : checkoutError ? (
          <div className="text-center py-10 bg-rose-50 border border-rose-200 rounded-lg shadow">
            <XCircleIcon className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <p className="text-lg text-rose-600 mb-4 whitespace-pre-line">
              {checkoutError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Coba Lagi
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <ShoppingCartIcon className="h-16 w-16 text-slate-400 mx-auto mb-5" />
            <p className="text-xl font-semibold text-slate-700 mb-2">
              Keranjang Anda kosong.
            </p>
            <p className="text-slate-500 mb-6">
              Tambahkan pupuk ke keranjang untuk melanjutkan.
            </p>
            <button
              onClick={() => navigate("/katalog")}
              className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700"
            >
              Lihat Katalog
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleCreateOrder}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12"
          >
            {/* SHIPPING SECTION */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="bg-slate-50 rounded-t-xl px-6 py-4 border-b border-slate-200 mb-6">
                <h2 className="text-base font-bold text-slate-700 tracking-widest uppercase mb-0">
                  Shipping
                </h2>
              </div>
              <div className="space-y-6 px-0 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="namaPemesan"
                      className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wide"
                    >
                      Nama Penerima <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaPemesan"
                      id="namaPemesan"
                      value={formData.namaPemesan}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="nomorHp"
                      className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wide"
                    >
                      Nomor HP (WhatsApp){" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="nomorHp"
                      id="nomorHp"
                      value={formData.nomorHp}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="alamatPengiriman"
                    className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wide"
                  >
                    Alamat Pengiriman Lengkap{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="alamatPengiriman"
                    id="alamatPengiriman"
                    rows="3"
                    value={formData.alamatPengiriman}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    required
                  ></textarea>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Detail: Jalan, No Rumah, RT/RW, Kel/Desa, Kec, Kab/Kota
                    (contoh: Sleman, Yogyakarta), Prov, Kode Pos.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="catatan"
                    className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wide"
                  >
                    Catatan (Opsional)
                  </label>
                  <textarea
                    name="catatan"
                    id="catatan"
                    rows="2"
                    value={formData.catatan}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  ></textarea>
                </div>
              </div>
            </div>
            {/* ORDER SUMMARY SECTION */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
                <h2 className="text-lg font-bold text-slate-900 mb-2 tracking-tight uppercase">
                  Ringkasan Pesanan
                </h2>
                {/* Subtotal, Pajak, Pengiriman, Total */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex justify-between text-sm text-slate-700">
                    <span>Subtotal</span>
                    <span>{formatRupiah(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-700">
                    <span>Pajak</span>
                    <span>-</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-700">
                    <span>Pengiriman</span>
                    <span>-</span>
                  </div>
                  <div className="border-t border-slate-200 my-2"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-base font-bold text-slate-900">
                      Total
                    </span>
                    <span className="text-2xl font-extrabold text-emerald-700 tracking-tight">
                      {formatRupiah(calculateTotal())}
                    </span>
                  </div>
                </div>
                {/* Daftar Belanja */}
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">
                    Daftar Belanja
                  </h3>
                  <div className="flex flex-col gap-3 max-h-40 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.pupuk?.gambar_utama}
                          alt={item.pupuk?.nama_pupuk}
                          className="w-10 h-10 object-cover rounded bg-slate-100 border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-slate-800 truncate">
                            {item.pupuk?.nama_pupuk || "Item"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.quantity} x{" "}
                            {formatRupiah(item.pupuk?.harga || 0)}
                          </div>
                        </div>
                        <div className="text-xs font-bold text-slate-700 whitespace-nowrap">
                          {formatRupiah(
                            (item.pupuk?.harga || 0) * (item.quantity || 0)
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isProcessingOrder || cartItems.length === 0}
                  className="w-full mt-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow transition-all text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  {isProcessingOrder ? (
                    <>
                      <ArrowPathIcon className="animate-spin h-5 w-5" />{" "}
                      Memproses Pesanan...
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="h-5 w-5" /> Buat Pesanan &
                      Pilih Metode Bayar
                    </>
                  )}
                </button>
                <div className="text-xs text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                  <InformationCircleIcon className="h-4 w-4 inline align-text-bottom" />
                  Biaya pengiriman akan dihitung pada langkah berikutnya.
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
export default CheckoutPage;
