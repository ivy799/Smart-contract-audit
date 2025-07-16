"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../components/Background";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Globe } from "@/components/magicui/globe";

// Data dummy untuk tim
const teamMembers = [
  {
    id: 1,
    name: "Innocentia",
    role: "CEO & Founder",
    bio: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita eveniet perspiciatis, doloribus magni sapiente nihil error delectus earum hic. Vitae, numquam quam. Voluptates quidem, neque assumenda nostrum natus impedit similique.",
    avatar: "https://1nnocentia.github.io/assets/img/Me1.jpg",
    skills: ["Blockchain", "Smart Contracts", "Solidity", "Security"],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: 2,
    name: "Mc Gregory",
    role: "Lorem Ipsum",
    bio: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita eveniet perspiciatis, doloribus magni sapiente nihil error delectus earum hic. Vitae, numquam quam. Voluptates quidem, neque assumenda nostrum natus impedit similique.",
    avatar: "https://avatar.vercel.sh/sari",
    skills: ["Machine Learning", "Python", "TensorFlow", "Data Analysis"],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: 3,
    name: "Muhammad Raihan",
    role: "Lead Security Auditor",
    bio: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita eveniet perspiciatis, doloribus magni sapiente nihil error delectus earum hic. Vitae, numquam quam. Voluptates quidem, neque assumenda nostrum natus impedit similique.",
    avatar: "https://ivy799.github.io/Pas%20Foto.jpg",
    skills: [
      "Security Audit",
      "Penetration Testing",
      "Code Review",
      "Risk Assessment",
    ],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: 4,
    name: "Yusra Erlangga Putra",
    role: "Data Scientist dan Frontend Developer",
    bio: "Data scientist dengan spesialisasi dalam machine learning serta Frontend developer dengan spesialisasi dalam membangun user interface yang intuitif.",
    avatar: "https://avatars.githubusercontent.com/u/143472196?v=4",
    skills: ["Python", "Machine Learning", "Next.js", "UI/UX"],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
];

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative font-[family-name:var(--font-geist-sans)]">
      <Background />
      <Navbar />

      {/* Hero Section */}
      <section className="w-full px-8 sm:px-20 py-16 relative z-20 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            Tentang{" "}
            <span className="bg-yellow-500 bg-clip-text text-transparent">
              Zectra
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Platform analisis keamanan inovatid yang  dirancang untuk memperkuat ekosistem Web3. 
            Proyek ini dibangun dengan pendekatan hybrid, menggunakan kecepatan dan ketepatan analisis statis dengan kedalaman dan kecerdasan analisis kontekstual yang didukung oleh Large Language Model (LLM).
            Kami tidak hanya mengidentifikasi kerentanan umum tetapi juga menggali lebih dalam untuk menemukan celah logika bisnis, 
            risiko ekonomi, dan masalah sentralisasi yang seringkali terlewat oleh analisa otomatis biasa. 
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="w-full px-8 sm:px-20 py-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Misi Kami
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Memberikan layanan audit smart contract yang paling akurat dan
                  terpercaya di industri blockchain Indonesia. Kami berkomitmen
                  untuk melindungi ekosistem Web3 dari kerentanan keamanan
                  melalui teknologi AI yang canggih dan expertise tim yang
                  berpengalaman.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Visi Kami
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Menjadi platform audit smart contract terdepan di Asia
                  Tenggara yang menggabungkan kecerdasan artifisial dengan human
                  expertise untuk menciptakan ekosistem blockchain yang lebih
                  aman dan terpercaya bagi semua pengguna.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full px-8 sm:px-20 py-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              Tim{" "}
              <span className="bg-yellow-500 bg-clip-text text-transparent">
                Expert
              </span>{" "}
              Kami
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas
              quasi corrupti reprehenderit eaque nemo ipsum asperiores deleniti
              ad esse ea eos a repellendus laborum accusantium soluta, mollitia
              adipisci cupiditate aspernatur!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="bg-card/50 border-border hover:bg-card/80 transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mb-4 object-cover"
                    />
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-yellow-500 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {member.bio}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-3">
                      <a
                        href={member.social.github}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github size={18} />
                      </a>
                      <a
                        href={member.social.linkedin}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin size={18} />
                      </a>
                      <a
                        href={member.social.twitter}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter size={18} />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="w-full px-8 sm:px-20 py-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-yellow-500">500+</h3>
              <p className="text-muted-foreground">Smart Contracts Audited</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-yellow-500">99.9%</h3>
              <p className="text-muted-foreground">Detection Accuracy</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-yellow-500">50+</h3>
              <p className="text-muted-foreground">Enterprise Clients</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-yellow-500">24/7</h3>
              <p className="text-muted-foreground">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex size-full items-center justify-center overflow-hidden rounded-lg border bg-background px-40 pb-40 pt-8 md:pb-60">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-foreground dark:to-background">
          Zectra is Real beibeh
        </span>
        <Globe className="top-20" />
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
      </section>

      <Footer />
    </div>
  );
};

export default About;
