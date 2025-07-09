"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Database, Zap, Users, Cloud } from "lucide-react"
import { ModeToggle } from "@/components/toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden font-[family-name:var(--font-geist-sans)]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-8 h-8 border border-muted rotate-45"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-muted rounded-full"></div>
        <div className="absolute bottom-40 left-20 w-4 h-4 bg-muted"></div>
        <div className="absolute top-60 left-1/4 w-3 h-3 bg-muted rotate-45"></div>
        <div className="absolute bottom-60 right-1/4 w-5 h-5 border border-muted rounded-full"></div>
        <div className="absolute top-40 right-1/3 w-2 h-2 bg-muted"></div>
        <div className="absolute bottom-32 left-1/3 w-6 h-6 border border-muted"></div>
        <div className="absolute top-80 right-10 w-4 h-4 bg-muted rotate-45"></div>
      </div>

      <header className="fixed top-0 w-full px-8 sm:px-20 z-50 flex-shrink-0 bg-background/95 backdrop-blur-lg border-b border-border">
        <nav className="flex items-center justify-between max-w-7xl mx-auto h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">Z</span>
            </div>
            <span className="text-xl font-semibold">Zectra</span>
          </div>

          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#home"
                  className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#about"
                  className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium"
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#services"
                  className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium"
                >
                  Service
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium"
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button variant="outline" className="font-medium text-sm h-10 px-4 bg-transparent">
              Sign In
            </Button>
          </div>
        </nav>
      </header>

      <main id="home" className="flex-1 flex flex-col items-center justify-center px-8 sm:px-20 text-center relative z-10 pt-16 mt-35">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-[-.02em]">
            Most Reliable Smart Contract Audit
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-[family-name:var(--font-geist-sans)]">
            Instant Smart Contract Audit with AI - Fast, Reliable and Comprehensive across Multiple Blockchain Networks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              size="lg"
              className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 h-12 transition-colors"
            >
              GET STARTED
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-3 h-12 group transition-colors font-medium bg-transparent"
            >
              TRY FOR FREE
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </main>

      <section id="about" className="w-full px-8 sm:px-20 py-16 pt-20 relative z-10 bg-muted/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-mono tracking-wider text-muted-foreground uppercase">UNMARSHAL 2.0</p>
            <h2 className="text-2xl font-semibold text-foreground">Smart Contract Audit and AI Integration</h2>
          </div>
          <div className="space-y-6">
            <p className="text-lg sm:text-xl leading-relaxed text-foreground max-w-3xl mx-auto">
              <strong>Zectra</strong> is <span className="inline-flex items-center gap-1">🧠🔐</span> redefining smart
              contract audits by fusing large language models and blockchain technology.{" "}
              <span className="inline-flex items-center gap-1">⚙️📜</span> Our platform leverages the power of AI to
              deeply understand, analyze, and secure smart contracts with unprecedented precision.{" "}
              <span className="inline-flex items-center gap-1">🚀</span> We aim to simplify and scale contract auditing,
              making Web3 safer and smarter for everyone.
            </p>
            <div className="pt-4">
              <Button
                variant="outline"
                className="rounded-full px-6 py-2 h-10 group transition-colors font-medium text-sm bg-transparent"
              >
                LEARN MORE ABOUT UNMARSHAL 2.0
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="w-full px-8 sm:px-20 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Services Hero */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Your Gateway to Advanced Blockchain Data Indexing
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Experience the power of the Unmarshal Network, where blockchain indexing meets decentralization. Our
                Proof of Staked Authority model empowers community members to run indexers, enhancing reliability and
                trust.
              </p>
              <Button className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 h-10 group transition-colors">
                EXPLORE
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
                </div>

                {/* Dashboard mockup */}
                <div className="absolute bottom-4 right-4 bg-card border rounded-lg p-4 shadow-lg">
                  <div className="text-sm text-muted-foreground mb-1">0x437...59f1</div>
                  <div className="text-2xl font-bold">$4,546</div>
                  <div className="flex gap-2 mt-2">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs text-black">+</span>
                    </div>
                    <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                      <ArrowRight className="w-3 h-3" />
                    </div>
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
                <h3 className="text-lg font-semibold">Deep Indexing</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We're best in class data decoders extract rich information & synthesises on-chain & off-chain data to
                  get contextual meaning.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold">Rich API suite</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Unmarshal Indexer tracks every single data bit that flows into blockchain and helps retrieve it
                  easily. Token balances etc.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold">Customer centric</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We offer 24X7 support assistance and dedicated channels for enterprise clients with flexible pricing
                  plans.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:bg-card/80 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Cloud className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold">True saas</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Unmarshal Indexer tracks every single data bit that flows into blockchain and helps retrieve it
                  easily.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex gap-6 flex-wrap items-center justify-center text-sm relative z-10 py-4 mt-auto flex-shrink-0">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
          href="#"
        >
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
          href="#"
        >
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
          href="#"
        >
          Term and Conditions
        </a>
      </footer>
    </div>
  )
}
