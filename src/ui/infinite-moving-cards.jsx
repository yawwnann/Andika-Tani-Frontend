// src/components/ui/InfiniteMovingCards.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "../lib/utils"; // <--- Pastikan path ini benar sesuai struktur proyek Anda

// Komponen Utama InfiniteMovingCards
export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  // Effect untuk setup duplikasi DOM dan memulai animasi
  useEffect(() => {
    function addAnimation() {
      if (containerRef.current && scrollerRef.current) {
        // Pastikan scrollerRef.current.children tidak kosong sebelum duplikasi
        // Ini mencegah duplikasi berulang jika useEffect dijalankan lebih dari sekali sebelum DOM benar-benar terisi
        if (items && scrollerRef.current.children.length === items.length) {
          const scrollerContent = Array.from(scrollerRef.current.children);
          scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            if (duplicatedItem instanceof HTMLElement) {
              duplicatedItem.setAttribute("aria-hidden", "true");
            }
            if (scrollerRef.current) {
              scrollerRef.current.appendChild(duplicatedItem);
            }
          });
        }
        if (!start) {
          setStart(true);
        }
      }
    }
    addAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]); // Bergantung pada items

  // Effect terpisah untuk mengatur speed dan direction (CSS Custom Properties)
  useEffect(() => {
    const getDirection = () => {
      if (containerRef.current) {
        if (direction === "left") {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "forwards"
          );
        } else {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "reverse"
          );
        }
      }
    };

    const getSpeed = () => {
      if (containerRef.current) {
        if (speed === "fast") {
          containerRef.current.style.setProperty("--animation-duration", "20s");
        } else if (speed === "normal") {
          containerRef.current.style.setProperty("--animation-duration", "40s");
        } else {
          containerRef.current.style.setProperty("--animation-duration", "80s");
        }
      }
    };

    getDirection();
    getSpeed();
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        // <--- Warna Background diubah
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] bg-emerald-600",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items?.map((item, idx) => (
          <li
            className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-100 bg-white px-8 py-6 shadow-sm md:w-[450px] dark:border-white dark:bg-white"
            key={`${item.name || "item"}-${idx}`}
          >
            <blockquote>
              <span className="relative z-20 text-sm leading-[1.6] font-normal text-slate-800">
                {" "}
                {/* <--- Warna teks diubah */}
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] font-semibold text-slate-600">
                    {" "}
                    {/* <--- Warna teks diubah */}
                    {item.name}
                  </span>
                  <span className="text-sm leading-[1.6] font-normal text-slate-500">
                    {" "}
                    {/* <--- Warna teks diubah */}
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
// Data Testimonials (Disesuaikan)
const testimonials = [
  {
    quote:
      "Andika Tani benar-benar jadi solusi pupuk saya. Pesanannya gampang, cepat sampai ke ladang, dan hasil panen bawang saya jadi lebih subur! Top markotop!",
    name: "Pak Slamet",
    title: "Petani Sayur, Godean", // Lebih spesifik ke Godean
  },
  {
    quote:
      "Dulu ragu beli pupuk online, tapi Andika Tani membuktikan pupuknya asli dan manjur. Tanah di kebun buah naga saya jadi lebih gembur, buahnya pun lebat. Harganya juga bersaing.",
    name: "Ibu Warsini",
    title: "Pekebun Buah, Sleman", // Lokasi di sekitar Yogyakarta
  },
  {
    quote:
      "Sebagai pengelola lahan, efisiensi pupuk itu penting. Andika Tani selalu menyediakan pupuk berkualitas tinggi yang konsisten. Pengiriman selalu tepat waktu, sangat membantu operasional saya.",
    name: "Mas Suryo",
    title: "Pengelola Lahan, Kulon Progo", // Lokasi di sekitar Yogyakarta
  },
  {
    quote:
      "Platformnya Andika Tani mudah sekali digunakan, pilihan pupuknya lengkap untuk berbagai jenis tanaman. Saya suka fitur detail produknya yang informatif. Memudahkan saya memilih pupuk yang pas.",
    name: "Mbak Retno",
    title: "Penyuluh Pertanian, Bantul", // Role yang lebih spesifik
  },
  {
    quote:
      "Saya baru pertama kali mencoba Andika Tani dan langsung puas. Proses pemesanan gampang, admin ramah dan responsif, dan yang paling penting, pupuknya memang bikin tanaman saya makin hijau!",
    name: "Joko Setiawan", // Nama yang umum di Jawa
    title: "Petani Jagung, Gunungkidul", // Lokasi di sekitar Yogyakarta
  },
];

// Komponen Demo (Wrapper)
export function InfiniteMovingCardsDemo() {
  return (
    <div className="pb-10 pt-4 md:pt-8 rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-emerald-600 dark:bg-grid-white/[0.05]">
      {/* <--- Background diubah */}
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-6 md:mb-10">
        Apa Kata Mereka Tentang Andika Tani? {/* <--- Teks diubah */}
      </h2>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
        pauseOnHover={true}
      />
    </div>
  );
}
