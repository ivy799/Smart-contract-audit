"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Database,
  Zap,
  Users,
  Cloud,
  Lightbulb,
  LightbulbIcon,
  HandCoins,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AnimatedGridPatternDemo } from "./components/GridPattern";
import { SpinningText } from "@/components/magicui/spinning-text";
import { TextReveal } from "@/components/magicui/text-reveal";
import { MarqueeDemo } from "./components/Review";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative font-[family-name:var(--font-geist-sans)]">
      <AnimatedGridPatternDemo />
      <Navbar />

      <main
        id="home"
        className="flex-1 flex flex-col items-center justify-center px-8 sm:px-20 text-center relative z-20 pt-16 mt-35"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-[-.02em] text-foreground">
            {/* <b className="bg-purple-500 bg-clip-text text-transparent ">
              Percaya
            </b>{" "}
            Sebelum Anda{" "}
            <b className="bg-blue-700 bg-clip-text text-transparent">
              Berinvestasi
            </b>{" "}
            <br />
            <b className="bg-purple-500 bg-clip-text text-transparent ">
              Verifikasi
            </b>{" "}
            Sebelum Anda{" "}
            <b className="bg-blue-700 bg-clip-text text-transparent">
              Meluncurkan
            </b> */}
            Analisa Smart Contract Anda Bersama{" "}
            <b className=" bg-yellow-500 bg-clip-text text-transparent">
              Zectra
            </b>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-[family-name:var(--font-geist-sans)]">
            Percaya Sebelum Anda Investasi,<br /> Verifikasi Sebelum Anda Meluncurkan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              size="lg"
              className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 h-12 "
            >
              JELAJAHI
            </Button>
            <ShimmerButton
              onClick={() => router.push("/analyze")}
              className="shadow-2xl"
            >
              <BorderBeam className="from-yellow-500 to-transparent"/>
              <BorderBeam className="from-yellow-500 to-transparent" delay={3}/>
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                PERIKSA RESIKO SEKARANG 
              </span>
              
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform fill-white" />
              
            </ShimmerButton>
          </div>
        </div>
      </main>

      <section>
        <TextReveal>
          Layanan Audit Smart Contract instan untuk analisa secara general
          maupun mendalam untuk proyek Web3. Zectra melindungi Anda dari kedua
          sisi.
        </TextReveal>
      </section>

      {/* 
      <section
        id="about"
        className="w-full px-8 sm:px-20 py-16 pt-20 relative z-20 bg-muted/5"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-mono tracking-wider text-muted-foreground uppercase">
              UNMARSHAL 2.0
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              Audit Smart Contract dan Integrasi AI
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-lg sm:text-xl leading-relaxed text-foreground max-w-3xl mx-auto">
              <strong>Zectra</strong> sedang{" "}
              <span className="inline-flex items-center gap-1">🧠🔐</span>{" "}
              mengubah cara audit smart contract dengan menggabungkan teknologi AI
              dan blockchain.{" "}
              <span className="inline-flex items-center gap-1">⚙️📜</span> Platform
              kami memanfaatkan kekuatan AI untuk memahami, menganalisis,
              dan mengamankan smart contract dengan tingkat akurasi yang luar biasa.{" "}
              <span className="inline-flex items-center gap-1">🚀</span> Kami bertujuan
              menyederhanakan dan meningkatkan skala audit kontrak, membuat Web3
              lebih aman dan cerdas untuk semua orang.
            </p>
            <div className="pt-4">
              <Button
                variant="outline"
                className="rounded-full px-6 py-2 h-10 group transition-colors font-medium text-sm bg-transparent"
              >
                PELAJARI LEBIH LANJUT TENTANG UNMARSHAL 2.0
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section> */}

      <section
        id="services"
        className="w-full px-8 sm:px-20 py-16 relative z-20"
      >
        <div className="max-w-7xl mx-auto">
          {/* Services Hero */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                <b className="bg-yellow-500 bg-clip-text text-transparent">
                  Zectra
                </b>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Zectra adalah platform keamanan Web3 yang memberdayakan investor
                dan pengguna. Gunakan analisa gratis kami untuk memeriksa risiko
                keamanan token sebelum berinvestasi dan hindari penipuan.
                Jadilah investor yang lebih cerdas dengan Zectra.
              </p>
              <Button className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 h-10 group transition-colors">
                JELAJAHI
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Visual representation */}
            <div className="relative">
              <div className="bg-muted/10 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
                <div className="relative">
                  {/* Central element */}
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center relative z-10">
                    <Database className="w-8 h-8 text-black" />
                  </div>

                  {/* Surrounding elements */}
                  <div className="absolute -top-12 -left-12 w-8 h-8 bg-muted rounded-lg opacity-60"></div>
                  <div className="absolute -top-8 right-8 w-6 h-6 bg-muted rounded-full opacity-40"></div>
                  <div className="absolute top-8 -right-16 w-10 h-10 bg-muted rounded-lg opacity-50"></div>
                  <div className="absolute bottom-4 -right-8 w-6 h-6 bg-muted rounded-full opacity-60"></div>
                  <div className="absolute -bottom-12 left-4 w-8 h-8 bg-muted rounded-lg opacity-40"></div>
                  <div className="absolute bottom-8 -left-16 w-6 h-6 bg-muted rounded-full opacity-50"></div>

                  {/* Dotted connections */}
                  <div className="absolute inset-0 border-2 border-dotted border-yellow-400/30 rounded-full w-32 h-32 -translate-x-8 -translate-y-8"></div>
                  <div className="justify-center items-center flex absolute inset-0">
                    <SpinningText radius={8}>
                      Zectra: Kepercayaan Terverifikasi.
                    </SpinningText>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mt-5 mb-5 text-foreground">
            Layanan Analisis Smart Contract Cerdas{" "}
            <b className="bg-yellow-500 bg-clip-text text-transparent">
              Zectra
            </b>
          </h2>
          <p className="text-base sm:text-xs md:text-sm text-muted-foreground mx-auto leading-relaxed mb-14 text-center max-w-4xl">
            <b>Zectra</b> menghadirkan generasi baru analisa keamanan smart
            contract Web3. Menggabungkan Analisa Statis dan AI yang{" "}
            <i>canggih</i>, memberikan wawasan kontekstual smart contract yang
            lebih{" "}
            <b>
              <i>dalam, cepat dan akurat.</i>
            </b>
          </p>
          {/* Service Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold">
                  Analisis Instan, Hasil dalam Hitungan Menit
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Lupakan proses audit manual yang memakan waktu
                  berminggu-minggu. Dengan Zectra, Anda bisa mendapatkan
                  analisis yang mendalam untuk seluruh basis kode Anda dalam
                  hitungan menit.
                </p>
                <div className="flex flex-wrap gap-2 my-6">
                  <span className="px-3 py-1 text-gray-400 rounded-full text-sm backdrop-blur-sm bg-white/10 border border-white/20 shadow-[0_0_10px_rgba(243,244,246,0.5)]">
                    Basic
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold">
                  Akurasi Deteksi dengan Trained AI
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Zectra menggunakan Analisis Statis dan AI yang dikembangkan
                  untuk memahami konteks kode sehingga kami dapat menemukan
                  kerentanan yang lebih kompleks.
                </p>
                <div className="flex flex-wrap gap-2 my-6">
                  <span className="px-3 py-1 text-gray-400 rounded-full text-sm backdrop-blur-sm bg-white/10 border border-white/20 shadow-[0_0_10px_rgba(243,244,246,0.5)]">
                    Basic
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold">
                  Berpusat pada Pelanggan
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Zectra memberikan ringkasan eksekutif yang mudah dipahami,
                  sehingga Anda dapat dengan cepat memahami risiko dan tindakan
                  yang diperlukan.
                </p>
                <div className="flex flex-wrap gap-2 my-6">
                  <span className="px-3 py-1 text-gray-400 rounded-full text-sm backdrop-blur-sm bg-white/10 border border-white/20 shadow-[0_0_10px_rgba(243,244,246,0.5)]">
                    Basic
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <HandCoins className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold">
                  Efisiensi Biaya dan
                  <br /> Waktu Pengembangan
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Temukan dan perbaiki kerentanan sejak dini dalam siklus
                  pengembangan, jauh sebelum menjadi masalah yang mahal untuk
                  diperbaiki.
                </p>

                <div className="flex flex-wrap gap-2 my-6">
                  <span className="px-3 py-1 text-white rounded-full text-sm backdrop-blur-sm bg-blue-400/80 border border-white/20 shadow-[0_0_10px_rgba(243,244,246,0.5)]">
                    Devs
                  </span>
                  <span className="px-3 py-1 text-white rounded-full text-sm backdrop-blur-sm bg-yellow-400/80 border border-white/20 shadow-[0_0_10px_rgba(250,204,21,0.8)]">
                    Enterprise
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="reviews"
        className="w-full px-8 sm:px-20 py-10 relative z-20"
      >
        <h1 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mt-5 mb-5 text-foreground">
          Ulasan Pengguna{" "}
          <b className="bg-yellow-500 bg-clip-text text-transparent">Zectra</b>
        </h1>
        <MarqueeDemo />
      </section>

      <section
        id="contact"
        className="w-full px-8 sm:px-20 py-16 relative z-20 bg-muted/5"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Hubungi{" "}
              <b className="bg-yellow-500 bg-clip-text text-transparent">
                Kami
              </b>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Kami di Zectra selalu siap membantu Anda. Jika Anda memiliki
              pertanyaan, ingin memberikan umpan balik, atau membutuhkan
              bantuan, jangan ragu untuk menghubungi kami.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto bg-card/80 border-border relative overflow-hidden">
            <BorderBeam size={250} duration={12} />
            <BorderBeam delay={6} size={400} duration={12} />
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-left">
                Kirim Pesan
              </h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nama Anda"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email Anda"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-colors"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subjek"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-colors"
                />
                <textarea
                  placeholder="Pesan Anda"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 resize-none transition-colors"
                />
              </form>
            </CardContent>
            <CardFooter className="px-8 pb-8 pt-0">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold flex-1 rounded-full h-12 transition-colors"
                >
                  KIRIM PESAN
                </Button>
                <Button
                  variant="outline"
                  className="group flex-1 rounded-full h-12 bg-transparent transition-colors"
                >
                  DETAIL KONTAK
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
