// src/pages/LoginPage.jsx
import React, { useState, useEffect, Fragment, useCallback } from "react";
import apiClient from "../api/apiClient";
import { useNavigate, Link } from "react-router-dom";
// Pastikan path background image ini benar dan ganti gambar jika masih ada ikan
import backgroundImage from "../assets/bg-login.png";
import Icon from "../assets/icon-pasifix.png";
import { Dialog, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const closeModalAndNavigate = useCallback(() => {
    setIsSuccessModalOpen(false);
    navigate("/dashboard");
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (isSuccessModalOpen) {
      timer = setTimeout(() => {
        closeModalAndNavigate();
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isSuccessModalOpen, closeModalAndNavigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!agree) {
      setError(
        "Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi untuk melanjutkan."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post("/login", {
        email: email,
        password: password,
      });

      console.log("Login successful response:", response.data);

      const token = response.data.access_token; // Menggunakan access_token sesuai respons JWT
      const user = response.data.user;

      if (token) {
        localStorage.setItem("authToken", token);
        console.log("Token saved to localStorage:", token);

        if (user) {
          localStorage.setItem("authUser", JSON.stringify(user));
        }
        setIsSuccessModalOpen(true);
      } else {
        console.error("Token not found in login response!");
        setError("Login berhasil, namun data autentikasi tidak diterima.");
      }
    } catch (err) {
      console.error("Login error:", err.response || err.message);
      setError(
        err.response?.data?.message ||
          "Login gagal. Periksa kembali email dan password Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-8 overflow-hidden font-sans">
      <div
        className={`w-full max-w-4xl flex rounded-xl shadow-2xl overflow-hidden transition-all duration-700 ease-out transform ${
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Left side - Gambar dan Teks */}
        <div
          className="w-1/2 p-8 sm:p-12 flex-col items-start justify-center text-white hidden md:flex relative"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 50, 0, 0.5), rgba(0, 50, 0, 0.5)), url(${backgroundImage})`, // <--- Warna gradient hijau gelap
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <img
            src={Icon}
            alt="Pasifix Icon"
            className="w-28 h-auto mb-6 sm:mb-8"
          />
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-left leading-tight">
            Selamat Datang di Andika Tani!
          </h1>
          <p className="text-base lg:text-lg mb-8 text-left leading-relaxed">
            Berbelanja Pupuk Berkualitas Jadi Mudah dengan Kami: Pilihan
            Terbaik, Harga Bersaing, dan Pengiriman Tepat Waktu ke Lahan Anda.{" "}
            {/* <--- Teks diubah */}
          </p>
          <div className="absolute bottom-8 left-8 text-xs opacity-75">
            &copy; {new Date().getFullYear()} Andika Tani. All rights reserved.
          </div>
        </div>

        {/* Right side - Form Login */}
        <div className="w-full md:w-1/2 bg-white p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="text-center md:hidden mb-6">
            <img
              src={Icon}
              alt="Pasifix Icon"
              className="w-20 h-auto mx-auto"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">
            Masuk ke Akun Anda
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md relative shadow-sm"
                role="alert"
              >
                <strong className="font-bold">Oops!</strong>
                <span className="block sm:inline ml-1">{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-slate-700 font-semibold mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-slate-50 focus:bg-white placeholder-slate-400"
                placeholder="contoh@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-slate-700 font-semibold mb-1.5"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-slate-50 focus:bg-white placeholder-slate-400 pr-12"
                  placeholder="Masukkan kata sandi"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-500 hover:text-emerald-600 focus:outline-none" // <--- Warna hover diubah
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox Persetujuan Syarat & Ketentuan */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeLogin"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded" // <--- Warna checkbox diubah
              />
              <label htmlFor="agreeLogin" className="text-sm text-slate-600">
                Saya menerima{" "}
                <Link
                  to="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-800 hover:underline" // <--- Warna link diubah
                >
                  Syarat dan Ketentuan
                </Link>{" "}
                serta{" "}
                <Link
                  to="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-800 hover:underline" // <--- Warna link diubah
                >
                  Kebijakan Privasi
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agree}
              className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                loading || !agree
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500" // <--- Warna tombol diubah
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </div>
              ) : (
                "Masuk"
              )}
            </button>

            <div className="text-sm text-center">
              <Link
                to="/lupa-password"
                className="font-medium text-emerald-600 hover:text-emerald-800 hover:underline" // <--- Warna link diubah
              >
                Lupa kata sandi?
              </Link>
            </div>

            <p className="text-center text-slate-600 text-sm">
              <span>Belum punya akun? </span>
              <Link
                to="/register"
                className="text-emerald-600 hover:text-emerald-800 hover:underline font-semibold" // <--- Warna link diubah
              >
                Daftar di sini
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* === Modal Sukses Login === */}
      <Transition appear show={isSuccessModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            /* Biarkan kosong */
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 backdrop-blur-sm bg-black/30"
              aria-hidden="true"
            />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl sm:text-2xl font-semibold leading-6 text-slate-900 text-center"
                  >
                    Login Berhasil!
                  </Dialog.Title>
                  <div className="mt-5 flex flex-col items-center">
                    <CheckCircleIcon
                      className="h-20 w-20 sm:h-24 sm:w-24 text-emerald-500 mb-5" // <--- Warna ikon sukses diubah
                      aria-hidden="true"
                    />
                    <p className="text-sm sm:text-base text-slate-600 text-center leading-relaxed">
                      Selamat datang kembali! Anda akan segera diarahkan ke
                      halaman dashboard.
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default LoginPage;
