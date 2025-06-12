// File: src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import PaymentProofUploadForm from "./PaymentProofUploadForm.jsx"; // Sesuaikan path jika berbeda
import {
  ArrowPathIcon,
  CheckCircleIcon,
  BanknotesIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { formatRupiah } from "../components/formatRupiah.jsx"; // Sesuaikan path jika berbeda

function PaymentPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loadingOrder, setLoadingOrder] = useState(!location.state?.order);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!order && orderId) {
      const fetchOrderDetails = async () => {
        setLoadingOrder(true);
        setFetchError(null);
        try {
          const response = await apiClient.get(`/pesanan/${orderId}`);
          if (response.data && response.data.data) {
            setOrder(response.data.data);
          } else {
            throw new Error("Data pesanan tidak ditemukan.");
          }
        } catch (err) {
          console.error("Gagal memuat detail pesanan:", err);
          setFetchError(
            "Gagal memuat detail pesanan. Pastikan ID pesanan valid."
          );
        } finally {
          setLoadingOrder(false);
        }
      };
      fetchOrderDetails();
    } else if (order) {
      setLoadingOrder(false);
    }
  }, [orderId, order]);

  const handleProofUploadSuccess = (data) => {
    alert(
      data.message || "Bukti pembayaran berhasil. Admin akan memverifikasi."
    );
    navigate(`/pesanan`); // <--- Diubah: /PesananPage -> /pesanan
  };

  const handleProofUploadError = (errorMessage) => {
    console.warn("Gagal unggah bukti dari PaymentPage:", errorMessage);
  };

  if (loadingOrder) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        {" "}
        {/* <--- Background diubah */}
        <ArrowPathIcon className="animate-spin h-10 w-10 text-emerald-600" />{" "}
        {/* <--- Warna diubah */}
        <p className="ml-3 text-lg text-slate-700">
          {" "}
          {/* <--- Warna teks disesuaikan */}
          Memuat detail pembayaran...
        </p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center bg-white rounded-lg shadow-md">
        <XCircleIcon className="h-16 w-16 text-rose-500 mx-auto mb-5" />{" "}
        {/* <--- Warna diubah */}
        <p className="text-xl font-semibold text-rose-700 mb-2">
          {" "}
          {/* <--- Warna diubah */}
          Terjadi Kesalahan
        </p>
        <p className="text-slate-600 mb-6">{fetchError}</p>{" "}
        {/* <--- Warna teks disesuaikan */}
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700" // <--- Warna diubah
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center bg-white rounded-lg shadow-md">
        <InformationCircleIcon className="h-16 w-16 text-amber-500 mx-auto mb-5" />{" "}
        {/* <--- Warna diubah */}
        <p className="text-xl font-semibold text-amber-700 mb-2">
          {" "}
          {/* <--- Warna diubah */}
          Informasi Pesanan Tidak Ditemukan
        </p>
        <p className="text-slate-600 mb-6">
          {" "}
          {/* <--- Warna teks disesuaikan */}
          Tidak dapat menemukan detail untuk pesanan ini.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700" // <--- Warna diubah
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="bg-green-50 min-h-screen py-8 sm:py-12 text-slate-800">
      {" "}
      {/* <--- Background diubah, warna teks default */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <div className="text-center mb-6">
            <CheckCircleIcon className="h-16 w-16 text-emerald-500 mx-auto mb-4" />{" "}
            {/* <--- Warna diubah */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
              {" "}
              {/* <--- Warna teks disesuaikan */}
              Pesanan Anda Berhasil Dibuat!
            </h1>
            <p className="text-slate-600">
              {" "}
              {/* <--- Warna teks disesuaikan */}
              ID Pesanan Anda:{" "}
              <strong className="text-emerald-600 font-semibold">
                {" "}
                {/* <--- Warna diubah */}
                {order.id}
              </strong>
            </p>
            <p className="text-lg text-slate-700">
              {" "}
              {/* <--- Warna teks disesuaikan */}
              Total Pembayaran:{" "}
              <strong className="text-emerald-600 font-bold">
                {" "}
                {/* <--- Warna diubah, weight font diubah */}
                {formatRupiah(order.total_harga)}
              </strong>
            </p>
          </div>
          <div className="mt-6 mb-8 p-4 sm:p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
            {" "}
            {/* <--- Warna diubah */}
            <h2 className="text-lg font-semibold text-emerald-800 mb-3 flex items-center">
              {" "}
              {/* <--- Warna diubah */}
              <BanknotesIcon className="h-6 w-6 mr-2 text-emerald-600" />
              {/* <--- Warna diubah */}
              Instruksi Pembayaran (Transfer Manual)
            </h2>
            <p className="text-sm text-emerald-700">
              {" "}
              {/* <--- Warna diubah */}
              Silakan lakukan transfer ke salah satu rekening bank kami:
            </p>
            <ul className="list-none space-y-1.5 text-sm text-emerald-700 mt-3 pl-1">
              {" "}
              {/* <--- Warna diubah */}
              <li>
                <strong>Bank BCA:</strong>{" "}
                <span className="font-bold">1234567890</span> (a/n: PT Andika
                Tani Sejahtera){" "}
                {/* <--- Nama perusahaan diubah, weight font diubah */}
              </li>
              <li>
                <strong>Bank Mandiri:</strong>{" "}
                <span className="font-bold">0987654321</span> (a/n: PT Andika
                Tani Sejahtera){" "}
                {/* <--- Nama perusahaan diubah, weight font diubah */}
              </li>
            </ul>
            <p className="text-sm text-emerald-700 mt-4 font-medium">
              {" "}
              {/* <--- Warna diubah */}
              PENTING: Pastikan Anda mentransfer sesuai dengan jumlah total di
              atas.
            </p>
            <p className="text-xs text-emerald-600 mt-2">
              {" "}
              {/* <--- Warna diubah */}
              Setelah melakukan transfer, mohon unggah bukti pembayaran Anda di
              bawah ini dalam waktu 1x24 jam.
            </p>
          </div>
          <PaymentProofUploadForm
            orderId={order.id}
            onUploadSuccess={handleProofUploadSuccess}
            onUploadError={handleProofUploadError}
          />
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
