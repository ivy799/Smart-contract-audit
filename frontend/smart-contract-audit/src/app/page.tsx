"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Zap, Users, Cloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AnimatedGridPatternDemo } from "./components/GridPattern";
import { SpinningText } from "@/components/magicui/spinning-text";
import { TextReveal } from "@/components/magicui/text-reveal";
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
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-[-.02em]">
            <i>Audit Smart Contract</i> Terpercaya dan Reliabel
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-[family-name:var(--font-geist-sans)]">
            <b>Percaya</b> Sebelum Anda Berinvestasi. <br />
            <b>Verifikasi</b> Sebelum Anda Meluncurkan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              size="lg"
              className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 h-12 transition-colors"
            >
              MULAI SEKARANG
            </Button>
            <Button
              onClick={() => router.push("/analyze")}
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-3 h-12 group transition-colors font-medium bg-transparent"
            >
              COBA GRATIS
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </main>

      <section>
        <TextReveal >
          Tingkatkan Keamanan Smart Contract Anda dan Minimalkan Resiko dalam
          Bertransaksi
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
                Gateway Anda untuk Indexing Data Blockchain Tingkat Lanjut
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Rasakan kekuatan Unmarshal Network, di mana indexing blockchain
                bertemu dengan desentralisasi. Model Proof of Staked Authority
                kami memberdayakan anggota komunitas untuk menjalankan indexer,
                meningkatkan keandalan dan kepercayaan.
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
                    <SpinningText radius={10}>
                      Smart Contract menjadi lebih terjamin keamanannnya
                    </SpinningText>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold">Indexing Mendalam</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Decoder data terbaik di kelasnya mengekstrak informasi kaya &
                  mensintesis data on-chain & off-chain untuk mendapatkan makna
                  kontekstual.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold">Rangkaian API Lengkap</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Unmarshal Indexer melacak setiap bit data yang masuk ke
                  blockchain dan membantu mengambilnya dengan mudah. Saldo
                  token, dll.
                </p>
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
                  Kami menawarkan bantuan support 24/7 dan channel khusus untuk
                  klien enterprise dengan paket harga yang fleksibel.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Cloud className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold">SaaS Sejati</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Unmarshal Indexer melacak setiap bit data yang masuk ke
                  blockchain dan membantu mengambilnya dengan mudah.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
