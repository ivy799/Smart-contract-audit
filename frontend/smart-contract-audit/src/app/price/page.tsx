"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import Background from "../components/Background";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";

const Home = () => {
  const router = useRouter();
  return (
    <div>
      <Navbar />
      <Background />
      {/* Choose your plan */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 pt-12">Pilih Paket Anda</h2>
          <p className="text-gray-600">
            Pilih paket yang sempurna untuk kebutuhan audit smart contract Anda
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <Card className="relative flex flex-col">
            <CardHeader>
              <CardTitle>Dasar</CardTitle>
              <CardDescription>Sempurna untuk proyek kecil</CardDescription>
              <div className="text-3xl font-bold">Gratis</div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Audit keamanan dasar
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Hingga 500 baris kode
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Pengiriman 48 jam
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Dukungan email
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Mulai Sekarang</Button>
            </CardFooter>
          </Card>

          {/* Professional Plan */}
          <Card className="relative border-yellow-500 border-2 flex flex-col">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-slate-900 font-semibold bg-yellow-400 px-4 py-1 rounded-full text-sm">
              Populer
            </div>
            <CardHeader>
              <CardTitle>Profesional</CardTitle>
              <CardDescription>Terbaik untuk bisnis yang berkembang</CardDescription>
              <div className="text-3xl font-bold">Rp99.000,-</div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Audit keamanan komprehensif
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Hingga 2000 baris kode
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Pengiriman 24 jam
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Dukungan prioritas
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Laporan detail
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-yellow-500 hover:bg-amber-400">Mulai Sekarang</Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative flex flex-col">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>Untuk organisasi besar</CardDescription>
              <div className="text-3xl font-bold">Rp.299.000,-</div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Audit keamanan lengkap
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Baris kode tanpa batas
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Pengiriman 12 jam
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Dukungan khusus 24/7
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Laporan komprehensif
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Sesi review kode
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Mulai Sekarang</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
