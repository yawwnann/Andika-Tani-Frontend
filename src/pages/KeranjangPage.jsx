import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../api/apiClient";
import { useNavigate, Link } from "react-router-dom";
import {
  ShoppingCartIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
  InformationCircleIcon,
  CreditCardIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import {
  CheckCircleIcon as SolidCheckCircle,
  XCircleIcon as SolidXCircle,
} from "@heroicons/react/24/solid";
import { cn } from "../lib/utils";

const formatRupiah = (angka) => {
  const number = typeof angka === "string" ? parseInt(angka, 10) : angka;
  if (isNaN(number) || number === null || number === undefined) return "Rp -";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// --- Komponen PupukCard --- (Diubah dari IkanCard, untuk produk terkait jika digunakan)
function PupukCard({ pupuk }) {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const viewDetail = (slug) => navigate(`/pupuk/${slug}`); // <--- Diubah: /ikan -> /pupuk
  const statusBadgeColor =
    pupuk.status_ketersediaan?.toLowerCase() === "tersedia"
      ? "bg-emerald-100 text-emerald-800" // <--- Warna diubah
      : "bg-rose-100 text-rose-800"; // <--- Warna diubah
  const namaPupukDisplay = pupuk?.nama_pupuk || pupuk?.nama || "Pupuk"; // <--- Diubah: NamaIkanDisplay
  const statusKetersediaan = pupuk?.status_ketersediaan;
  const gambarUtama = pupuk?.gambar_utama;
  const hargaPupuk = pupuk?.harga; // <--- Diubah: hargaIkan
  const kategoriNama = pupuk?.kategori?.nama_kategori || pupuk?.kategori?.nama; // <--- Diubah: kategoriNama

  const handleAddToCartRelated = async (e) => {
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    setFeedback({ type: "", message: "" });
    try {
      await apiClient.post("/keranjang", { pupuk_id: pupuk.id, quantity: 1 }); // <--- Diubah: ikan_id -> pupuk_id
      setFeedback({ type: "success", message: `Ditambahkan!` });
      setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
    } catch (err) {
      console.error("Gagal menambah ke keranjang:", err);
      let errorMessage = "Gagal";
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        errorMessage = "Login dulu";
      } else if (err.response && err.response.data?.message) {
        errorMessage = err.response.data.message;
      }
      setFeedback({ type: "error", message: errorMessage });
      setTimeout(() => setFeedback({ type: "", message: "" }), 2500);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="pupuk-card group bg-white rounded-lg border border-slate-200/80 overflow-hidden transition-shadow duration-300 hover:shadow-md flex flex-col h-full relative">
      {" "}
      {/* <--- Diubah: ikan-card -> pupuk-card */}
      {feedback.message && (
        <div
          className={`absolute inset-x-0 top-0 z-20 p-1 text-center text-xs font-medium transition-all duration-300 ${
            feedback.type === "success"
              ? "bg-emerald-500 text-white" // <--- Warna diubah
              : "bg-rose-500 text-white" // <--- Warna diubah
          }`}
        >
          {feedback.message}
        </div>
      )}
      <div
        className="relative overflow-hidden cursor-pointer"
        onClick={viewDetail}
      >
        <img
          src={
            gambarUtama
              ? gambarUtama // Asumsi gambar_utama dari API sudah berupa URL lengkap
              : "https://placehold.co/400x300/e2e8f0/94a3b8?text=Gambar+Pupuk" // <--- Teks placeholder diubah
          }
          alt={namaPupukDisplay}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=Error";
          }}
        />
        <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
          {kategoriNama && (
            <span className="bg-emerald-600/80 text-white text-xs font-medium px-2 py-0.5 rounded">
              {" "}
              {/* <--- Warna diubah */}
              {kategoriNama}
            </span>
          )}
          {statusKetersediaan && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${statusBadgeColor}`}
            >
              {statusKetersediaan}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCartRelated}
          disabled={
            statusKetersediaan?.toLowerCase() !== "tersedia" || isAdding
          }
          className="absolute bottom-2 right-2 z-10 p-2 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-700 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400" // <--- Warna diubah
          title="Tambah ke Keranjang"
        >
          {isAdding ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : (
            <ShoppingCartIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      <div
        className="p-4 flex flex-col flex-grow cursor-pointer"
        onClick={viewDetail}
      >
        <h3 className="text-base font-semibold text-slate-800 mb-1 line-clamp-2">
          {" "}
          {/* <--- Warna teks disesuaikan */}
          {namaPupukDisplay}
        </h3>
        <p className="text-lg font-bold text-emerald-700 mt-auto pt-2">
          {" "}
          {/* <--- Warna diubah */}
          {formatRupiah(hargaPupuk)}
        </p>
      </div>
    </div>
  );
}

// --- Komponen Pagination --- (Tidak ada perubahan signifikan terkait Pupuk/Ikan)
function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;
  const getPageNumber = (url) => {
    if (!url) return null;
    try {
      const p = new URL(url);
      return p.searchParams.get("page");
    } catch (_e) {
      console.error("Invalid URL for pagination:", url, _e);
      return null;
    }
  };
  return (
    <nav className="flex items-center justify-between border-t border-slate-200 px-4 sm:px-0 mt-10 py-5">
      <div className="hidden sm:block">
        <p className="text-sm text-slate-700">
          {" "}
          {/* <--- Warna teks disesuaikan */}
          Menampilkan <span className="font-medium">
            {meta.from || 0}
          </span> - <span className="font-medium">{meta.to || 0}</span> dari{" "}
          <span className="font-medium">{meta.total || 0}</span> hasil
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end space-x-1">
        {meta.links?.map((link, index) => {
          const pageNumber = getPageNumber(link.url);
          const isDisabled = !link.url;
          const isCurrent = link.active;
          if (link.label.includes("Previous")) {
            return (
              <button
                key={`prev-${index}`}
                onClick={() =>
                  !isDisabled && pageNumber && onPageChange(pageNumber)
                }
                disabled={isDisabled}
                className={cn(
                  "relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-slate-300 focus:z-20 focus:outline-offset-0", // <--- Warna ring disesuaikan
                  isDisabled
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-900 hover:bg-slate-50 focus:bg-slate-100" // <--- Warna teks dan hover disesuaikan
                )}
              >
                Sebelumnya
              </button>
            );
          } else if (link.label.includes("Next")) {
            return (
              <button
                key={`next-${index}`}
                onClick={() =>
                  !isDisabled && pageNumber && onPageChange(pageNumber)
                }
                disabled={isDisabled}
                className={cn(
                  "relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-slate-300 focus:z-20 focus:outline-offset-0", // <--- Warna ring disesuaikan
                  isDisabled
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-900 hover:bg-slate-50 focus:bg-slate-100" // <--- Warna teks dan hover disesuaikan
                )}
              >
                Berikutnya
              </button>
            );
          } else if (pageNumber) {
            const currentPage = meta.current_page;
            const lastPage = meta.last_page;
            const pageNum = parseInt(pageNumber, 10);
            if (
              pageNum === 1 ||
              pageNum === lastPage ||
              Math.abs(pageNum - currentPage) <= 1
            ) {
              return (
                <button
                  key={`page-${link.label}-${index}`}
                  onClick={() => !isCurrent && onPageChange(pageNumber)}
                  disabled={isCurrent}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "relative hidden items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-slate-300 focus:z-20 focus:outline-offset-0 md:inline-flex", // <--- Warna ring disesuaikan
                    isCurrent
                      ? "z-10 bg-emerald-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 cursor-default" // <--- Warna diubah
                      : "text-slate-900 hover:bg-slate-50 focus:bg-slate-100" // <--- Warna teks dan hover disesuaikan
                  )}
                >
                  {link.label.replace(/&laquo;|&raquo;/g, "").trim()}
                </button>
              );
            } else if (Math.abs(pageNum - currentPage) === 2) {
              return (
                <span
                  key={`ellipsis-${pageNum}-${index}`}
                  className="relative hidden items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 focus:outline-offset-0 md:inline-flex" // <--- Warna teks dan ring disesuaikan
                >
                  ...
                </span>
              );
            }
            return null;
          }
          return null;
        })}
      </div>
    </nav>
  );
}

const CartItemSkeleton = () => (
  <div className="flex items-center justify-between py-4 border-b border-slate-200 animate-pulse">
    {" "}
    {/* <--- Warna border disesuaikan */}
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-slate-300 rounded"></div>{" "}
      {/* <--- Warna skeleton disesuaikan */}
      <div>
        <div className="h-5 w-32 bg-slate-300 rounded mb-1"></div>
        <div className="h-4 w-20 bg-slate-300 rounded"></div>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="h-8 w-20 bg-slate-300 rounded"></div>
      <div className="h-5 w-24 bg-slate-300 rounded hidden sm:block"></div>
      <div className="h-8 w-8 bg-slate-300 rounded-full"></div>
    </div>
  </div>
);

function KeranjangPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const navigate = useNavigate();

  const fetchCartItems = async (showMainLoading = true) => {
    if (showMainLoading) {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await apiClient.get("/keranjang");
      if (response.data && Array.isArray(response.data)) {
        setCartItems(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setCartItems(response.data.data);
      } else {
        setCartItems([]);
        if (response.data) {
          console.error("Format data keranjang tidak sesuai:", response.data);
        }
      }
    } catch (err) {
      console.error("Gagal memuat keranjang:", err);
      let errorMessage = "Gagal memuat data keranjang.";
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        errorMessage = "Silakan login untuk melihat keranjang Anda."; // <--- Teks diubah
      }
      setError(errorMessage);
      setCartItems([]);
    } finally {
      if (showMainLoading) {
        setLoading(false);
      }
      setUpdatingItemId(null);
      setRemovingItemId(null);
    }
  };
  useEffect(() => {
    fetchCartItems(true);
  }, []);
  const totalHarga = useMemo(() => {
    return cartItems.reduce((total, item) => {
      // <--- Diubah: item?.ikan?.harga -> item?.pupuk?.harga
      const harga = parseInt(item?.pupuk?.harga, 10) || 0;
      const quantity = item?.quantity ?? 0;
      return total + harga * quantity;
    }, 0);
  }, [cartItems]);
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    const quantityNum = Math.max(1, parseInt(newQuantity, 10));
    const currentItem = cartItems.find((item) => item.id === cartItemId);
    if (currentItem && currentItem.quantity === quantityNum) return;
    setUpdatingItemId(cartItemId);
    try {
      await apiClient.put(`/keranjang/${cartItemId}`, {
        quantity: quantityNum,
      });
      await fetchCartItems(false);
    } catch (err) {
      console.error(`Gagal update kuantitas item ${cartItemId}:`, err);
      setError(err.response?.data?.message || "Gagal update kuantitas item.");
      setUpdatingItemId(null);
    }
  };
  const handleRemoveItem = async (cartItemId, itemName) => {
    const displayNama = itemName || "item ini";
    if (
      window.confirm(`Yakin ingin menghapus ${displayNama} dari keranjang?`)
    ) {
      setRemovingItemId(cartItemId);
      try {
        await apiClient.delete(`/keranjang/${cartItemId}`);
        await fetchCartItems(false);
      } catch (err) {
        console.error(`Gagal hapus item ${cartItemId}:`, err);
        setError(err.response?.data?.message || "Gagal menghapus item.");
        setRemovingItemId(null);
      }
    }
  };
  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-green-50">
      {" "}
      {/* <--- Background diubah */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-8">
          {" "}
          {/* <--- Warna teks disesuaikan */}
          Keranjang Belanja Anda
        </h1>
        {error && (
          <div className="mb-6 p-4 bg-rose-100 border border-rose-400 text-rose-700 rounded-lg shadow">
            {" "}
            {/* <--- Warna diubah */}
            <p>{error}</p>
            {(error.includes("login") || error.includes("Sesi")) && (
              <button
                onClick={() => navigate("/login")}
                className="mt-3 px-4 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm font-medium" // <--- Warna diubah
              >
                Login
              </button>
            )}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {" "}
          {/* <--- Shadow lebih kuat */}
          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <CartItemSkeleton key={i} />
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center p-10 py-16">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-slate-400" />{" "}
              {/* <--- Warna ikon disesuaikan */}
              <h3 className="mt-2 text-lg font-medium text-slate-900">
                {" "}
                {/* <--- Warna teks disesuaikan */}
                Keranjang Anda Kosong
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {" "}
                {/* <--- Warna teks disesuaikan */}
                Tambahkan beberapa pupuk berkualitas untuk memulai.{" "}
                {/* <--- Teks diubah */}
              </p>
              <div className="mt-6">
                <Link
                  to="/katalog"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500" // <--- Warna diubah
                >
                  Mulai Belanja
                </Link>
              </div>
            </div>
          ) : (
            <ul role="list" className="divide-y divide-slate-200">
              {" "}
              {/* <--- Warna divider disesuaikan */}
              {cartItems.map((item) => {
                const isUpdating = updatingItemId === item.id;
                const isRemoving = removingItemId === item.id;
                const currentItemLoading = isUpdating || isRemoving;
                const isAvailable =
                  item.pupuk?.status_ketersediaan?.toLowerCase() === "tersedia"; // <--- Diubah: item.ikan -> item.pupuk
                const namaPupuk =
                  item.pupuk?.nama_pupuk || // <--- Diubah: item.ikan?.nama_ikan -> item.pupuk?.nama_pupuk
                  item.pupuk?.nama ||
                  "Nama Pupuk Tidak Tersedia"; // <--- Teks diubah
                const hargaPupuk = parseInt(item.pupuk?.harga, 10) || 0; // <--- Diubah: item.ikan?.harga -> item.pupuk?.harga
                return (
                  <li
                    key={item.id}
                    className={`px-5 py-4 sm:px-6 flex items-center justify-between space-x-4 transition-opacity duration-300 ${
                      // <--- Padding disesuaikan
                      currentItemLoading ? "opacity-50 bg-slate-50" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-4 flex-grow min-w-0">
                      <img
                        src={
                          item.pupuk?.gambar_utama // <--- Diubah: item.ikan -> item.pupuk
                        }
                        alt={namaPupuk}
                        className="w-16 h-16 rounded-md object-cover flex-shrink-0 bg-slate-200" // <--- Radius lebih kecil, warna background disesuaikan
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/100?text=Err";
                        }}
                      />
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-slate-900 hover:text-emerald-600 truncate">
                          {" "}
                          {/* <--- Warna teks dan hover disesuaikan */}
                          <Link to={`/pupuk/${item.pupuk?.slug || "#"}`}>
                            {" "}
                            {/* <--- Diubah: /ikan -> /pupuk */}
                            {namaPupuk}
                          </Link>
                        </p>
                        <p className="text-sm text-slate-600">
                          {" "}
                          {/* <--- Warna teks disesuaikan */}
                          {formatRupiah(item.pupuk?.harga || 0)}{" "}
                          {/* <--- Diubah: item.ikan -> item.pupuk */}
                        </p>
                        <p className="text-sm font-medium text-slate-800 mt-1 sm:hidden">
                          {" "}
                          {/* <--- Warna teks disesuaikan */}
                          Subtotal: {formatRupiah(hargaPupuk * item.quantity)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
                      <div className="flex items-center border border-slate-300 rounded-md">
                        {" "}
                        {/* <--- Radius lebih kecil */}
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || currentItemLoading}
                          className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed" // <--- Padding disesuaikan, radius, warna
                          aria-label="Kurangi"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span
                          className={`px-3 text-sm font-medium border-l border-r border-slate-300 w-12 text-center ${
                            // <--- Warna border disesuaikan
                            isUpdating ? "animate-pulse text-transparent" : ""
                          }`}
                        >
                          {isUpdating ? "..." : item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={currentItemLoading || !isAvailable}
                          className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed" // <--- Padding disesuaikan, radius, warna
                          aria-label="Tambah"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 w-28 text-right hidden sm:block">
                        {" "}
                        {/* <--- Warna teks disesuaikan */}
                        {formatRupiah(hargaPupuk * item.quantity)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id, namaPupuk)}
                        disabled={currentItemLoading}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed" // <--- Warna diubah
                        title="Hapus Item"
                      >
                        {isRemoving ? (
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {!loading && cartItems.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
            {" "}
            {/* <--- Shadow lebih kuat */}
            <h2 className="text-lg font-medium text-slate-900 mb-4">
              {" "}
              {/* <--- Warna teks disesuaikan */}
              Ringkasan Belanja
            </h2>
            <div className="space-y-2 border-b border-slate-200 pb-4 mb-4">
              {" "}
              {/* <--- Warna border disesuaikan */}
              <div className="flex justify-between text-base text-slate-700">
                <p>Subtotal</p>
                <p className="font-medium">{formatRupiah(totalHarga)}</p>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 mb-6">
              {" "}
              {/* <--- Warna teks disesuaikan */}
              <p>Total</p>
              <p>{formatRupiah(totalHarga)}</p>
            </div>
            <div className="flex justify-end items-center mt-4">
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-white",
                  cartItems.length === 0
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                <CreditCardIcon className="h-5 w-5" />
                <span>Checkout</span>
              </button>
            </div>
            <p className="mt-4 text-xs text-center text-slate-500">
              {" "}
              {/* <--- Warna teks disesuaikan */}
              <InformationCircleIcon className="h-4 w-4 inline mr-1 align-text-bottom" />{" "}
              Biaya pengiriman akan dihitung pada langkah berikutnya.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default KeranjangPage;
