import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Import Link
import apiClient from "../api/apiClient";
import {
  ShoppingCartIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  MinusIcon,
  PlusIcon,
  ClockIcon,
  InformationCircleIcon,
  TagIcon, // Digunakan di PupukCard
} from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";
import { cn } from "../lib/utils";

// --- Helper Function: Format Rupiah ---
const formatRupiah = (angka) => {
  if (angka === null || angka === undefined) return "Rp -";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
};

// --- Komponen: Pupuk Card (Untuk Produk Terkait) --- (Diubah dari Ikan Card)
function PupukCard({ pupuk }) {
  const navigate = useNavigate();
  const viewDetail = (slug) => navigate(`/pupuk/${slug}`); // <--- Diubah: /ikan -> /pupuk
  const statusBadgeColor =
    pupuk.status_ketersediaan?.toLowerCase() === "tersedia"
      ? "bg-emerald-100 text-emerald-800" // <--- Warna diubah
      : "bg-rose-100 text-rose-800"; // <--- Warna diubah

  const handleSimpleAddToCart = (e) => {
    e.stopPropagation();
    alert(`Tambah ${pupuk.nama_pupuk} (dari related) (belum implementasi)`); // <--- Diubah: ikan.nama -> pupuk.nama_pupuk
  };

  return (
    <div className="pupuk-card group bg-white rounded-lg border border-slate-200/80 overflow-hidden transition-shadow duration-300 hover:shadow-md flex flex-col h-full">
      {" "}
      {/* <--- Border disesuaikan */}
      <div
        className="relative overflow-hidden aspect-[4/3] cursor-pointer"
        onClick={() => viewDetail(pupuk.slug)}
      >
        <img
          src={
            pupuk.gambar_utama // <--- Menggunakan gambar_utama langsung (asumsi sudah URL lengkap)
          }
          alt={pupuk.nama_pupuk} // <--- Diubah: ikan.nama -> pupuk.nama_pupuk
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
          {pupuk.kategori && (
            <span className="bg-emerald-600/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded">
              {" "}
              {/* <--- Warna diubah */}
              <TagIcon className="w-3 h-3 mr-1 opacity-80" />{" "}
              {pupuk.kategori.nama_kategori}{" "}
              {/* <--- Diubah: ikan.kategori.nama -> pupuk.kategori.nama_kategori */}
            </span>
          )}
          {pupuk.status_ketersediaan && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${statusBadgeColor}`}
            >
              {pupuk.status_ketersediaan}
            </span>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-row justify-between items-end flex-grow">
        <div
          className="flex-grow mr-2 cursor-pointer"
          onClick={() => viewDetail(pupuk.slug)}
        >
          <h3 className="text-base font-semibold text-slate-800 mb-1 line-clamp-2">
            {" "}
            {/* <--- Warna teks disesuaikan */}
            {pupuk.nama_pupuk}{" "}
            {/* <--- Diubah: ikan.nama -> pupuk.nama_pupuk */}
          </h3>
          <p className="text-lg font-bold text-emerald-700">
            {" "}
            {/* <--- Warna diubah */}
            {formatRupiah(pupuk.harga)}
          </p>
        </div>
        <button
          onClick={handleSimpleAddToCart}
          disabled={pupuk.status_ketersediaan?.toLowerCase() !== "tersedia"}
          className="flex-shrink-0 p-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400" // <--- Warna diubah
          title="Tambah ke Keranjang"
        >
          <ShoppingCartIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// --- Komponen Loading Detail (Skeleton) ---
const DetailLoadingSkeleton = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-pulse">
    <div className="mb-6 h-5 w-1/4 bg-slate-300 rounded"></div>{" "}
    {/* <--- Warna skeleton disesuaikan */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 lg:gap-16">
      <div className="md:col-span-2 w-full aspect-w-1 aspect-h-1 bg-slate-300 rounded-lg"></div>{" "}
      {/* <--- Warna skeleton disesuaikan */}
      <div className="md:col-span-3">
        <div className="h-4 w-1/3 bg-slate-300 rounded mb-3"></div>
        <div className="h-8 w-3/4 bg-slate-300 rounded mb-4"></div>
        <div className="h-10 w-1/2 bg-slate-300 rounded mb-6"></div>
        <div className="h-5 w-1/4 bg-slate-300 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-300 rounded"></div>
          <div className="h-4 w-full bg-slate-300 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-300 rounded"></div>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <div className="h-10 w-24 bg-slate-300 rounded"></div>
          <div className="h-12 w-48 bg-slate-400 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Komponen Loading Card (Skeleton) untuk related items ---
const SkeletonCard = () => (
  <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden animate-pulse shadow-md">
    {" "}
    {/* <--- Warna border disesuaikan */}
    <div className="w-full h-48 bg-slate-200/80"></div>{" "}
    {/* <--- Warna skeleton disesuaikan */}
    <div className="p-4">
      <div className="h-5 w-3/4 bg-slate-200/80 rounded mb-2"></div>
      <div className="h-6 w-1/3 bg-slate-200/80 rounded"></div>
    </div>
  </div>
);

// --- Komponen Utama Halaman Detail Pupuk --- (Diubah dari Detail Ikan)
function DetailPupukPage() {
  const [pupukDetail, setPupukDetail] = useState(null); // <--- Diubah: ikanDetail -> pupukDetail
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedPupukList, setRelatedPupukList] = useState([]); // <--- Diubah: relatedIkanList -> relatedPupukList
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState(null);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartStatus, setAddToCartStatus] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info",
  });

  const { slug } = useParams();
  const navigate = useNavigate();

  function closeModal() {
    setIsModalOpen(false);
  }

  function openModal(type, title, message) {
    setModalContent({ type, title, message });
    setIsModalOpen(true);
  }

  // --- Fetch Data Detail Pupuk --- (Diubah dari Ikan)
  useEffect(() => {
    const fetchDetailPupuk = async () => {
      setLoading(true);
      setError(null);
      setPupukDetail(null); // <--- Diubah: ikanDetail -> pupukDetail
      setRelatedPupukList([]); // <--- Diubah: setRelatedIkanList -> setRelatedPupukList
      try {
        const response = await apiClient.get(`/pupuk/${slug}`); // <--- Diubah: /ikan -> /pupuk
        if (response.data && response.data.data) {
          setPupukDetail(response.data.data); // <--- Diubah: setIkanDetail -> setPupukDetail
          setQuantity(1);
        } else {
          setError("Data pupuk tidak ditemukan atau format tidak sesuai."); // <--- Teks diubah
        }
      } catch (err) {
        console.error(`Gagal memuat detail pupuk (slug: ${slug}):`, err); // <--- Teks diubah
        if (err.response && err.response.status === 404) {
          setError("Pupuk yang Anda cari tidak ditemukan."); // <--- Teks diubah
        } else {
          setError("Gagal memuat data pupuk. Silakan coba lagi nanti."); // <--- Teks diubah
        }
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchDetailPupuk();
    } else {
      setError("Slug pupuk tidak ditemukan di URL."); // <--- Teks diubah
      setLoading(false);
    }
  }, [slug]);

  // --- Fetch Data Pupuk Terkait --- (Diubah dari Ikan)
  useEffect(() => {
    const fetchRelatedPupuk = async (categorySlug, currentPupukId) => {
      // <--- Diubah: fetchRelatedIkan -> fetchRelatedPupuk
      if (!categorySlug) return;
      setRelatedLoading(true);
      setRelatedError(null);
      try {
        const response = await apiClient.get(
          `/pupuk?kategori_slug=${categorySlug}&limit=5`
        ); // <--- Diubah: /ikan -> /pupuk
        if (response.data && Array.isArray(response.data.data)) {
          const relatedItems = response.data.data
            .filter((pupuk) => pupuk.id !== currentPupukId) // <--- Diubah: ikan -> pupuk
            .slice(0, 4);
          setRelatedPupukList(relatedItems); // <--- Diubah: setRelatedIkanList -> setRelatedPupukList
        } else {
          setRelatedPupukList([]); // <--- Diubah: setRelatedIkanList -> setRelatedPupukList
        }
      } catch (err) {
        console.error("Gagal memuat pupuk terkait:", err); // <--- Teks diubah
        setRelatedError("Gagal memuat produk serupa.");
        setRelatedPupukList([]); // <--- Diubah: setRelatedIkanList -> setRelatedPupukList
      } finally {
        setRelatedLoading(false);
      }
    };

    // <--- Diubah: ikanDetail -> pupukDetail dan ikanDetail.kategori.slug -> pupukDetail.kategori.nama_kategori
    if (pupukDetail && pupukDetail.kategori?.slug && pupukDetail.id) {
      fetchRelatedPupuk(pupukDetail.kategori.slug, pupukDetail.id);
    }
  }, [pupukDetail]);

  // --- Handler Ubah Kuantitas ---
  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  // --- Handler Tambah ke Keranjang (Menggunakan Modal) ---
  const handleAddToCart = async () => {
    // Cek ketersediaan dan status pupukDetail
    const isCurrentlyAvailable =
      pupukDetail?.status_ketersediaan?.toLowerCase() === "tersedia";
    if (!pupukDetail || !isCurrentlyAvailable || isAddingToCart) return; // <--- Diubah: ikanDetail -> pupukDetail

    setIsAddingToCart(true);
    setAddToCartStatus(null);

    try {
      await apiClient.post("/keranjang", {
        pupuk_id: pupukDetail.id, // <--- Diubah: ikan_id -> pupuk_id
        quantity: quantity,
      });

      setAddToCartStatus("success");
      openModal(
        "success",
        "Berhasil!",
        `${quantity} ${pupukDetail.nama_pupuk} berhasil ditambahkan ke keranjang!` // <--- Diubah: ikanDetail.nama -> pupukDetail.nama_pupuk
      );
      setTimeout(() => setAddToCartStatus(null), 2500);
    } catch (err) {
      setAddToCartStatus("error");
      const backendErrorMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;
      let displayMessage = "Gagal menambahkan item ke keranjang.";

      if (backendErrorMessage) {
        displayMessage = backendErrorMessage;
      } else if (validationErrors) {
        const firstErrorKey = Object.keys(validationErrors)[0];
        if (firstErrorKey && Array.isArray(validationErrors[firstErrorKey])) {
          displayMessage = validationErrors[firstErrorKey][0];
        }
      } else if (err.message) {
        displayMessage = err.message;
      }

      openModal("error", "Gagal", displayMessage);
      setTimeout(() => setAddToCartStatus(null), 3000);
      console.error("Gagal menambahkan ke keranjang:", err.response || err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // --- Render Kondisional (Loading, Error, Fallback) ---
  if (loading) {
    return <DetailLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col items-center justify-center text-center">
          <XCircleIcon className="w-16 h-16 text-rose-400 mb-4" />{" "}
          {/* <--- Warna diubah */}
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            Oops! Terjadi Kesalahan
          </h2>
          <p className="text-rose-600 mb-6">{error}</p>{" "}
          {/* <--- Warna diubah */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500" // <--- Warna diubah
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Kembali
          </button>
        </main>
      </div>
    );
  }

  // <--- Diubah: ikanDetail -> pupukDetail
  if (!pupukDetail) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-center">
          <p className="text-slate-500">Detail pupuk tidak dapat dimuat.</p>{" "}
          {/* <--- Teks diubah */}
        </main>
      </div>
    );
  }

  // Hitung status ketersediaan di sini setelah memastikan pupukDetail ada
  const isAvailable =
    pupukDetail.status_ketersediaan?.toLowerCase() === "tersedia"; // <--- Diubah: ikanDetail -> pupukDetail

  // --- Fungsi Konten Tombol Dinamis ---
  const getButtonContent = () => {
    if (isAddingToCart)
      return (
        <>
          <ClockIcon className="h-5 w-5 mr-2 animate-spin" /> Memproses...
        </>
      );
    if (addToCartStatus === "success")
      return (
        <>
          <CheckCircleIcon className="h-5 w-5 mr-2" /> Berhasil!
        </>
      );
    if (addToCartStatus === "error")
      return (
        <>
          <XCircleIcon className="h-5 w-5 mr-2" /> Gagal, coba lagi
        </>
      );
    return (
      <>
        <ShoppingCartIcon className="h-5 w-5 mr-2" /> Tambah ke Keranjang
      </>
    );
  };

  // --- Render JSX Utama Halaman Detail ---
  return (
    <>
      <div className="bg-white min-h-screen flex flex-col text-slate-800">
        {" "}
        {/* <--- Warna teks default */}
        <main className="flex-grow">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Tombol Kembali */}
            <button
              onClick={() => navigate(-1)}
              className="mb-6 inline-flex items-center text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors" // <--- Warna diubah
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" /> Kembali
            </button>

            {/* Grid Konten Detail */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 lg:gap-16">
              {/* Kolom Gambar */}
              <div className="md:col-span-2 w-full aspect-w-1 aspect-h-1 bg-slate-100 rounded-lg overflow-hidden shadow-lg">
                {" "}
                {/* <--- Background dan shadow diubah */}
                <img
                  src={
                    pupukDetail.gambar_utama // <--- Menggunakan gambar_utama langsung
                  }
                  alt={pupukDetail.nama_pupuk} // <--- Diubah: ikanDetail.nama -> pupukDetail.nama_pupuk
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Kolom Informasi & Aksi */}
              <div className="md:col-span-3 flex flex-col">
                {pupukDetail.kategori && (
                  <span className="text-sm font-medium text-emerald-600 mb-2 inline-block">
                    {" "}
                    {/* <--- Warna diubah */}
                    {pupukDetail.kategori.nama_kategori}{" "}
                    {/* <--- Diubah: ikanDetail.kategori.nama -> pupukDetail.kategori.nama_kategori */}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  {pupukDetail.nama_pupuk}{" "}
                  {/* <--- Diubah: ikanDetail.nama -> pupukDetail.nama_pupuk */}
                </h1>
                <p className="text-3xl font-bold text-emerald-700 mb-5">
                  {" "}
                  {/* <--- Warna diubah */}
                  {formatRupiah(pupukDetail.harga)}
                </p>
                <div className="flex items-center space-x-4 mb-5">
                  {isAvailable ? (
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                      {" "}
                      {/* <--- Warna diubah */}
                      <CheckCircleIcon className="h-4 w-4 mr-1.5" /> Tersedia
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-rose-100 text-rose-800">
                      {" "}
                      {/* <--- Warna diubah */}
                      <XCircleIcon className="h-4 w-4 mr-1.5" /> Habis
                    </span>
                  )}
                  <span className="text-sm text-slate-500">
                    Stok: {pupukDetail.stok ?? "-"}{" "}
                    {/* <--- Diubah: ikanDetail.stok -> pupukDetail.stok */}
                  </span>
                </div>
                <div className="text-slate-700 leading-relaxed mb-8 prose prose-sm sm:prose-base max-w-none">
                  {" "}
                  {/* <--- Warna teks disesuaikan */}
                  <p>
                    {pupukDetail.deskripsi || "Deskripsi pupuk tidak tersedia."}
                  </p>{" "}
                  {/* <--- Teks diubah */}
                </div>

                {/* Aksi (Kuantitas & Tambah Keranjang) */}
                <div className="mt-auto pt-6 border-t border-slate-200">
                  {" "}
                  {/* <--- Warna border disesuaikan */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Kontrol Kuantitas */}
                    <div className="flex items-center border border-slate-300 rounded-lg w-full sm:w-auto">
                      {" "}
                      {/* <--- Warna border disesuaikan */}
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1 || isAddingToCart}
                        className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed" // <--- Warna diubah
                        aria-label="Kurangi Kuantitas"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        disabled={isAddingToCart || !isAvailable}
                        className="w-16 text-center border-l border-r border-slate-300 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed" // <--- Warna fokus diubah
                        aria-label="Kuantitas"
                      />
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={isAddingToCart || !isAvailable}
                        className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed" // <--- Warna diubah
                        aria-label="Tambah Kuantitas"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                    {/* Tombol Tambah ke Keranjang */}
                    <button
                      onClick={handleAddToCart}
                      disabled={!isAvailable || isAddingToCart}
                      className={cn(
                        "flex-grow inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-150", // <--- Warna fokus diubah
                        isAddingToCart
                          ? "bg-amber-500 cursor-wait" // <--- Warna diubah
                          : addToCartStatus === "success"
                          ? "bg-emerald-600" // <--- Warna diubah
                          : addToCartStatus === "error"
                          ? "bg-rose-600" // <--- Warna diubah
                          : !isAvailable
                          ? "bg-slate-400 opacity-60 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700" // <--- Warna diubah
                      )}
                    >
                      {getButtonContent()}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Produk Terkait */}
            {(relatedPupukList.length > 0 || relatedLoading) && (
              <section className="mt-16 pt-8 border-t border-slate-200">
                {" "}
                {/* <--- Warna border disesuaikan */}
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  {" "}
                  {/* <--- Warna teks disesuaikan */}
                  Produk Serupa{" "}
                  {pupukDetail.kategori
                    ? `di ${pupukDetail.kategori.nama_kategori}`
                    : ""}{" "}
                  {/* <--- Diubah: ikanDetail.kategori.nama -> pupukDetail.kategori.nama_kategori */}
                </h2>
                {relatedError && (
                  <p className="text-rose-600 mb-4">{relatedError}</p>
                )}{" "}
                {/* <--- Warna diubah */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                  {relatedLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <SkeletonCard key={`related-skeleton-${index}`} />
                      ))
                    : relatedPupukList.map((pupuk) => (
                        <PupukCard key={`related-${pupuk.id}`} pupuk={pupuk} />
                      ))}{" "}
                  {/* <--- Diubah: relatedIkanList -> relatedPupukList, ikan -> pupuk, IkanCard -> PupukCard */}
                </div>
              </section>
            )}
          </div>
        </main>
        {/* --- Render Modal Notifikasi --- */}
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeModal}>
            <Transition.Child // Backdrop
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child // Panel Konten Modal
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className={`text-lg font-semibold leading-6 flex items-center ${
                        modalContent.type === "success"
                          ? "text-emerald-700" // <--- Warna diubah
                          : modalContent.type === "error"
                          ? "text-rose-700" // <--- Warna diubah
                          : "text-slate-900" // <--- Warna diubah
                      }`}
                    >
                      {modalContent.type === "success" && (
                        <CheckCircleIcon className="h-6 w-6 mr-2 flex-shrink-0" />
                      )}
                      {modalContent.type === "error" && (
                        <XCircleIcon className="h-6 w-6 mr-2 flex-shrink-0" />
                      )}
                      {modalContent.title}
                    </Dialog.Title>
                    <div className="mt-3">
                      <p className="text-sm text-slate-600">
                        {" "}
                        {/* <--- Warna teks disesuaikan */}
                        {modalContent.message}
                      </p>
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="button"
                        className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                          modalContent.type === "success"
                            ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500" // <--- Warna diubah
                            : modalContent.type === "error"
                            ? "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500" // <--- Warna diubah
                            : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500" // <--- Warna diubah
                        }`}
                        onClick={closeModal}
                      >
                        Oke
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
}

export default DetailPupukPage;
