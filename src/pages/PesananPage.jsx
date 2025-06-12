import React, { useState, useEffect, useCallback } from "react"; // Tambahkan useCallback
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient"; // Sesuaikan path
import {
  EyeIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Helper Function: Format Rupiah (Sudah Baik)
const formatRupiah = (angka) => {
  if (angka === null || angka === undefined) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
};

// Helper Function: Warna Badge Status Pesanan (Sudah Baik)
const getStatusPesananColor = (status) => {
  switch (status?.toLowerCase()) {
    case "baru":
    case "pending": // Menambahkan alias umum
      return "bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200";
    case "menunggu_konfirmasi_pembayaran":
      return "bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-300"; // Sedikit beda warna
    case "lunas": // Menambahkan status lunas jika ada sebelum diproses
      return "bg-green-100 text-green-700 ring-1 ring-inset ring-green-200";
    case "diproses":
      return "bg-yellow-100 text-yellow-700 ring-1 ring-inset ring-yellow-200";
    case "dikirim":
      return "bg-cyan-100 text-cyan-700 ring-1 ring-inset ring-cyan-200";
    case "selesai":
      return "bg-green-100 text-green-700 ring-1 ring-inset ring-green-200";
    case "dibatalkan": // Mengganti "batal" menjadi "dibatalkan" agar konsisten
    case "batal":
      return "bg-red-100 text-red-700 ring-1 ring-inset ring-red-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200";
  }
};

// Helper Function: Warna Badge Status Pembayaran (Sudah Baik)

// Komponen Skeleton (Sudah Baik)
const OrderRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-5 whitespace-nowrap text-sm">
      <div className="h-4 bg-slate-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-5 whitespace-nowrap text-sm">
      <div className="h-4 bg-slate-200 rounded w-36"></div>
    </td>
    <td className="px-6 py-5 whitespace-nowrap text-sm">
      <div className="h-6 bg-slate-200 rounded-full w-20"></div>
    </td>
    <td className="px-6 py-5 whitespace-nowrap text-sm">
      <div className="h-6 bg-slate-200 rounded-full w-20"></div>
    </td>
    <td className="px-6 py-5 whitespace-nowrap text-sm">
      <div className="h-4 bg-slate-200 rounded w-28"></div>
    </td>
    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
      <div className="h-9 bg-slate-200 rounded-md w-24"></div>
    </td>
  </tr>
);

function PesananPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationData, setPaginationData] = useState(null);
  const [activeTab, setActiveTab] = useState("semua");

  const statusTabs = [
    { key: "semua", label: "Semua" },
    { key: "belum_bayar", label: "Belum Bayar" },
    { key: "diproses", label: "Diproses" },
    { key: "dikirim", label: "Dikirim" },
    { key: "selesai", label: "Selesai" },
    { key: "dibatalkan", label: "Dibatalkan" },
  ];

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const fetchOrders = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/pesanan", {
          params: { page },
        });
        if (response.data && Array.isArray(response.data.data)) {
          setOrders(response.data.data);
          setPaginationData({
            meta: response.data.meta,
            links: response.data.links,
          });
        } else {
          console.warn("Format data pesanan tidak sesuai:", response.data);
          setOrders([]);
          setPaginationData(null);
          setError("Format data pesanan dari server tidak sesuai.");
        }
      } catch (err) {
        console.error("Gagal memuat riwayat pesanan:", err);
        if (err.response && err.response.status === 401) {
          setError(
            "Sesi Anda telah berakhir. Mohon login kembali untuk melihat riwayat pesanan Anda."
          );
          setTimeout(
            () =>
              navigate("/login", {
                replace: true,
                state: { from: location.pathname + location.search }, // Simpan path lengkap saat ini
              }),
            3500
          );
        } else {
          setError(
            "Gagal memuat riwayat pesanan. Silakan coba lagi dalam beberapa saat."
          );
        }
        setOrders([]);
        setPaginationData(null);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  ); // Tambahkan navigate sebagai dependency jika digunakan di dalam callback (untuk redirect)

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]); // Tambahkan fetchOrders ke dependency array

  const handlePageChange = (page) => {
    if (
      page >= 1 &&
      page <= (paginationData?.meta?.last_page || 1) &&
      page !== currentPage
    ) {
      setSearchParams({ page: page.toString() });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    if (!paginationData || !paginationData.meta) return null;
    const { current_page, last_page } = paginationData.meta;
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, current_page - halfPagesToShow);
    let endPage = Math.min(last_page, current_page + halfPagesToShow);

    if (current_page <= halfPagesToShow) {
      endPage = Math.min(last_page, maxPagesToShow);
    }
    if (current_page + halfPagesToShow >= last_page) {
      startPage = Math.max(1, last_page - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span
            key="start-ellipsis"
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700"
          >
            ...
          </span>
        );
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          aria-current={current_page === i ? "page" : undefined}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
            current_page === i
              ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              : "text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0"
          }`}
        >
          {i}
        </button>
      );
    }
    if (endPage < last_page) {
      if (endPage < last_page - 1) {
        pageNumbers.push(
          <span
            key="end-ellipsis"
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700"
          >
            ...
          </span>
        );
      }
      pageNumbers.push(
        <button
          key={last_page}
          onClick={() => handlePageChange(last_page)}
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0"
        >
          {last_page}
        </button>
      );
    }
    return pageNumbers;
  };

  const formatDate = (dateString) => {
    if (!dateString) return { tanggal: "N/A", jam: "" };
    const dateObj = new Date(dateString);
    return {
      tanggal: format(dateObj, "dd MMMM yyyy", { locale: id }),
      jam: format(dateObj, "HH:mm", { locale: id }),
    };
  };

  // Filter orders by activeTab
  const filteredOrders =
    activeTab === "semua"
      ? orders
      : orders.filter(
          (order) => (order.status || "").toLowerCase() === activeTab
        );

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Riwayat Pesanan
          </h1>
          <p className="text-base text-slate-500">
            Lihat dan lacak semua transaksi pembelian Anda di sini.
          </p>
        </div>

        {/* Tabs Status */}
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-8">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all
                ${
                  activeTab === tab.key
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-md shadow-md flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Terjadi Kesalahan</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* List Card Pesanan */}
        <div className="space-y-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow p-8 animate-pulse h-40"
              />
            ))
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const { tanggal, jam } = formatDate(
                order.created_at || order.tanggal_pesan
              );
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-4 border border-slate-100"
                >
                  {/* Header Card */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-base">
                        Andika Tani
                      </span>
                      {/* Bisa tambahkan logo/toko lain jika multi-toko */}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusPesananColor(
                          order.status
                        )}`}
                      >
                        {order.status
                          ? order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)
                          : "N/A"}
                      </span>
                      <span className="text-xs text-slate-400">
                        {tanggal}, {jam} WIB
                      </span>
                    </div>
                  </div>
                  {/* Produk List */}
                  <div className="flex flex-col gap-4">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img
                          src={item.gambar_utama_url}
                          alt={item.nama_pupuk}
                          className="w-16 h-16 object-cover rounded bg-slate-100 border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 truncate">
                            {item.nama_pupuk || "Produk"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.jumlah} x{" "}
                            {formatRupiah(item.harga_saat_pesanan || 0)}
                          </div>
                        </div>
                        <div className="font-bold text-slate-700 whitespace-nowrap">
                          {formatRupiah(
                            (item.harga_saat_pesanan || 0) * (item.jumlah || 0)
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Footer Card */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 mt-2">
                    <div className="text-lg font-extrabold text-emerald-700">
                      Total Pesanan: {formatRupiah(order.total_harga)}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {order.status === "selesai" && (
                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2 rounded-lg transition">
                          Nilai
                        </button>
                      )}
                      <button className="border border-slate-300 text-slate-700 font-semibold px-5 py-2 rounded-lg hover:bg-slate-100 transition">
                        Hubungi Penjual
                      </button>
                      <button className="border border-slate-300 text-slate-700 font-semibold px-5 py-2 rounded-lg hover:bg-slate-100 transition">
                        Beli Lagi
                      </button>
                      <Link
                        to={`/pesanan/detail/${order.id}`}
                        className="text-emerald-600 hover:text-emerald-800 font-semibold px-5 py-2 rounded-lg border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 transition"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 px-6">
              <InboxIcon className="h-20 w-20 text-slate-200 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-500 mb-2">
                Belum Ada Riwayat Pesanan
              </h3>
              <p className="text-slate-400">
                Kamu belum pernah melakukan transaksi pesanan.
              </p>
              <Link
                to="/katalog"
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-6"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2 -ml-1" /> Mulai Belanja
                Sekarang
              </Link>
            </div>
          )}
        </div>

        {paginationData &&
          paginationData.meta &&
          paginationData.meta.last_page > 1 &&
          !loading && (
            <nav
              className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-4 sm:px-6 mt-8 rounded-b-lg shadow-xl"
              aria-label="Pagination"
            >
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-700">
                    Menampilkan{" "}
                    <span className="font-semibold text-slate-900">
                      {paginationData.meta.from || 0}
                    </span>{" "}
                    -{" "}
                    <span className="font-semibold text-slate-900">
                      {paginationData.meta.to || 0}
                    </span>{" "}
                    dari{" "}
                    <span className="font-semibold text-slate-900">
                      {paginationData.meta.total || 0}
                    </span>{" "}
                    hasil
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!paginationData.links?.prev}
                      className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-slate-300 focus:z-20 focus:outline-offset-0 ${
                        !paginationData.links?.prev
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Sebelumnya</span>
                    </button>
                    {renderPageNumbers()}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!paginationData.links?.next}
                      className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-slate-300 focus:z-20 focus:outline-offset-0 ${
                        !paginationData.links?.next
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="sr-only">Berikutnya</span>
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </nav>
                </div>
              </div>
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!paginationData.links?.prev}
                  className={`relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium ${
                    !paginationData.links?.prev
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!paginationData.links?.next}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium ${
                    !paginationData.links?.next
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Berikutnya
                </button>
              </div>
            </nav>
          )}
      </div>
    </div>
  );
}

export default PesananPage;
