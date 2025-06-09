import React from "react";
// 1. HAPUS IMPORT LOGO INI: import siteLogo from "../assets/pasifix.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <section className="py-10 bg-white sm:pt-16 lg:pt-24 border-t border-gray-200 text-slate-700">
      {/* <--- Background putih sudah benar, tambahkan warna teks default */}
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-10 gap-x-8 xl:gap-x-12">
          {/* Kolom Deskripsi (Logo dihapus, deskripsi diperluas) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 lg:pr-8">
            {/* Logo dihapus */}
            {/* Anda bisa menambahkan teks nama perusahaan di sini jika ingin */}
            <h3 className="text-2xl font-bold text-emerald-700 mb-4">
              Andika Tani
            </h3>{" "}
            {/* <--- Nama Perusahaan */}
            <p className="text-base leading-relaxed text-slate-600 mt-2">
              {/* <--- Teks diubah */}
              Andika Tani menyediakan pupuk berkualitas tinggi di Godean,
              Yogyakarta, langsung untuk kebutuhan pertanian Anda. Nikmati
              kemudahan memesan pupuk terbaik untuk hasil panen maksimal.
            </p>
            {/* Sesuaikan Ikon Sosial Media */}
            <ul className="flex items-center space-x-3 mt-7">
              <li>
                <a
                  href="#" // <-- Ganti dengan URL Instagram Andika Tani
                  title="Instagram Andika Tani" // <--- Title diubah
                  className="flex items-center justify-center text-white transition-all duration-200 bg-emerald-600 rounded-full w-8 h-8 hover:bg-emerald-700 focus:bg-emerald-700" // <--- Warna diubah
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="#" // <-- Ganti dengan URL Facebook Andika Tani
                  title="Facebook Andika Tani" // <--- Title diubah
                  className="flex items-center justify-center text-white transition-all duration-200 bg-emerald-600 rounded-full w-8 h-8 hover:bg-emerald-700 focus:bg-emerald-700" // <--- Warna diubah
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="#" // <-- Ganti dengan URL WhatsApp Andika Tani / nomor
                  title="WhatsApp Andika Tani" // <--- Title diubah
                  className="flex items-center justify-center text-white transition-all duration-200 bg-emerald-600 rounded-full w-8 h-8 hover:bg-emerald-700 focus:bg-emerald-700" // <--- Warna diubah
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16.6 14.2c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.1.1-.3.2-.5.1-.3-.1-1-.4-1.9-.9-.7-.7-1.2-1.5-1.3-1.8-.1-.2 0-.4.1-.5l.4-.5c.1-.1.2-.2.3-.3.1-.1.1-.2.1-.3s0-.4-.1-.5L8 7.8C7.8 7.3 7.6 7 7.4 7c-.1 0-.3.1-.5.1h-.5c-.2 0-.5.2-.6.7-.1.5-.7 2.2.2 4.1.8 1.6 2.1 3.1 3.7 4.1 1.9 1 2.8.9 3.7.8.4 0 1.3-.6 1.5-1.1.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"></path>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
          {/* Kolom Tautan Perusahaan */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <p className="text-sm font-semibold tracking-widest text-slate-500 uppercase">
              Perusahaan
            </p>
            <ul className="mt-6 space-y-4">
              <li>
                <a
                  href="#"
                  title=""
                  className="flex text-base text-slate-700 transition-all duration-200 hover:text-emerald-600 focus:text-emerald-600" // <--- Warna diubah
                >
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="flex text-base text-slate-700 transition-all duration-200 hover:text-emerald-600 focus:text-emerald-600" // <--- Warna diubah
                >
                  Cara Pesan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="flex text-base text-slate-700 transition-all duration-200 hover:text-emerald-600 focus:text-emerald-600" // <--- Warna diubah
                >
                  Katalog Produk
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="flex text-base text-slate-700 transition-all duration-200 hover:text-emerald-600 focus:text-emerald-600" // <--- Warna diubah
                >
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>
          {/* Kolom Tautan Bantuan */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <p className="text-sm font-semibold tracking-widest text-slate-500 uppercase">
              Bantuan
            </p>
            <ul className="mt-6 space-y-4">
              <li>
                <a
                  href="#"
                  title=""
                  className="flex text-base text-slate-700 transition-all duration-200 hover:text-emerald-600 focus:text-emerald-600" // <--- Warna diubah
                >
                  Tanya Jawab (FAQ)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="flex text-base text-slate-700 transition-all duration-200 hover:text-emerald-600 focus:text-emerald-600" // <--- Warna diubah
                >
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="flex text-base text-slate-700 transition-all duration-200 hover:text-emerald-600 focus:text-emerald-600" // <--- Warna diubah
                >
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="flex text-base text-slate-700 transition-all duration-200 hover:text-emerald-600 focus:text-emerald-600" // <--- Warna diubah
                >
                  Lacak Pengiriman
                </a>
              </li>
            </ul>
          </div>
          {/* Kolom Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 lg:pl-4 xl:pl-8">
            <p className="text-sm font-semibold tracking-widest text-slate-500 uppercase">
              Langganan Info & Promo
            </p>
            <form action="#" method="POST" className="mt-6">
              <div>
                <label htmlFor="footer-email" className="sr-only">
                  Email
                </label>
                <input
                  type="email"
                  name="footer-email"
                  id="footer-email"
                  placeholder="Masukkan alamat email Anda"
                  className="block w-full p-4 text-base text-slate-900 placeholder-slate-500 transition-all duration-200 bg-slate-100 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent caret-emerald-600" // <--- Warna diubah
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center w-full px-6 py-4 mt-3 font-semibold text-white transition-all duration-200 bg-emerald-600 rounded-md hover:bg-emerald-700 focus:bg-emerald-700" // <--- Warna diubah
              >
                Berlangganan
              </button>
            </form>
          </div>
        </div>

        <hr className="mt-16 mb-10 border-gray-200" />

        {/* Copyright */}
        <p className="text-sm text-center text-slate-600">
          {/* <--- Warna diubah */}© Copyright {currentYear}, Andika Tani. All
          Rights Reserved. {/* <--- Nama Perusahaan diubah */}
        </p>
      </div>
    </section>
  );
};

export default Footer;
