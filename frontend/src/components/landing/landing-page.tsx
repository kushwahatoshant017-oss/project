"use client"

import Link from "next/link"
import { Button } from "@/components/ui"
import {
  CloudSun,
  MapPin,
  Bell,
  Wind,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Star,
  ArrowUp,
  Cloud,
  Sun,
  Moon,
  CloudRain,
  Thermometer,
  BarChart3,
  Shield,
  Users,
  Globe,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  Heart,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/hooks/use-auth"
import { motion, useInView } from "framer-motion"

const features = [
  {
    icon: CloudSun,
    title: "Real-Time Weather",
    description: "Live conditions, temperature, humidity, wind speed and more for any location worldwide. Updated every minute.",
    color: "from-blue-500 to-cyan-400",
    gradient: "from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40",
  },
  {
    icon: MapPin,
    title: "Interactive Maps",
    description: "Visualize weather patterns with dynamic maps. Zoom, pan, and explore weather data across the globe.",
    color: "from-green-500 to-emerald-400",
    gradient: "from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40",
  },
  {
    icon: Wind,
    title: "Air Quality Index",
    description: "Real-time AQI monitoring with detailed PM2.5, PM10, ozone, and NO2 pollutant breakdowns for your location.",
    color: "from-purple-500 to-violet-400",
    gradient: "from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/40",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get instant notifications for severe weather changes, custom thresholds, and conditions you care about.",
    color: "from-amber-500 to-orange-400",
    gradient: "from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40",
  },
  {
    icon: BarChart3,
    title: "Hourly & Weekly Forecasts",
    description: "Plan ahead with detailed 48-hour hourly and 7-day weekly forecasts. Temperature, precipitation, and wind trends.",
    color: "from-sky-500 to-blue-400",
    gradient: "from-sky-50 to-blue-50 dark:from-sky-950/40 dark:to-blue-950/40",
  },
  {
    icon: Heart,
    title: "Favorite Locations",
    description: "Save and manage your favorite cities. Switch between locations instantly with one click.",
    color: "from-rose-500 to-pink-400",
    gradient: "from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40",
  },
]

const stats = [
  { icon: Globe, value: "10,000+", label: "Cities Covered", suffix: "" },
  { icon: Users, value: "50", label: "Active Users", suffix: "K+" },
  { icon: TrendingUp, value: "1", label: "Forecasts Generated", suffix: "M+" },
  { icon: Shield, value: "99.9", label: "Uptime", suffix: "%" },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Meteorologist",
    avatar: "SC",
    content: "WeatherSphere has become an essential tool in my daily workflow. The accuracy of the data and the intuitive interface make it stand out from other weather platforms.",
    rating: 5,
  },
  {
    name: "Marcus Rivera",
    role: "Pilot",
    avatar: "MR",
    content: "The hourly forecast feature is incredibly precise. I rely on WeatherSphere for flight planning and it hasn't let me down. The wind speed data is particularly accurate.",
    rating: 5,
  },
  {
    name: "Emily Nakamura",
    role: "Event Planner",
    avatar: "EN",
    content: "Planning outdoor events is so much easier now. The weekly forecast and alert system help me stay ahead of weather changes. Absolutely love the location saving feature!",
    rating: 5,
  },
  {
    name: "David Okonkwo",
    role: "Photographer",
    avatar: "DO",
    content: "The air quality index and weather maps are game-changers for outdoor photography. I can plan shoots around the best conditions with confidence.",
    rating: 5,
  },
]

const steps = [
  {
    icon: MapPin,
    title: "Choose Your Location",
    description: "Search any city worldwide or enable location services for instant local weather data.",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  {
    icon: CloudSun,
    title: "Get Real-Time Data",
    description: "Access current conditions, hourly forecasts, weekly outlook, and air quality all in one place.",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100 dark:bg-cyan-950",
  },
  {
    icon: Bell,
    title: "Stay Informed",
    description: "Set custom alerts, save favorite locations, and never miss important weather changes again.",
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-950",
  },
]

const floatingIcons = [
  { Icon: Cloud, x: "10%", y: "15%", size: 32, duration: 7, delay: 0 },
  { Icon: Sun, x: "85%", y: "10%", size: 40, duration: 9, delay: 1 },
  { Icon: CloudRain, x: "75%", y: "60%", size: 28, duration: 8, delay: 2 },
  { Icon: Wind, x: "20%", y: "70%", size: 24, duration: 6, delay: 0.5 },
  { Icon: CloudSun, x: "50%", y: "80%", size: 36, duration: 10, delay: 1.5 },
  { Icon: Thermometer, x: "90%", y: "40%", size: 20, duration: 7.5, delay: 3 },
  { Icon: Cloud, x: "5%", y: "45%", size: 22, duration: 8.5, delay: 0.8 },
  { Icon: Sparkles, x: "60%", y: "5%", size: 18, duration: 6.5, delay: 2.5 },
]

function AnimatedCounter({ to, suffix, label }: { to: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const increment = to / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= to) {
        setCount(to)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to])

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  )
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return progress
}

export function LandingPage() {
  const { theme, setTheme } = useTheme()
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const scrollProgress = useScrollProgress()

  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Floating background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {mounted && floatingIcons.map((item, i) => {
          const Icon = item.Icon
          return (
            <motion.div
              key={i}
              className="absolute text-blue-200/30 dark:text-blue-800/20"
              style={{ left: item.x, top: item.y }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut",
              }}
            >
              <Icon size={item.size} />
            </motion.div>
          )
        })}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105 group-hover:shadow-blue-500/30">
              <CloudSun className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              WeatherSphere
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 after:bg-blue-500 after:transition-all hover:after:w-full">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 after:bg-blue-500 after:transition-all hover:after:w-full">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 after:bg-blue-500 after:transition-all hover:after:w-full">
              Testimonials
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard/current-weather">
                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25">
                  <CloudSun className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                {mounted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                )}
                <Link href="/login">
                  <Button variant="outline" className="border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-muted-foreground"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
            <button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t md:hidden bg-background/95 backdrop-blur-xl"
          >
            <div className="space-y-1 px-4 py-4">
              <Link
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
              >
                Testimonials
              </Link>
              <hr className="my-3" />
              {isAuthenticated ? (
                <Link href="/dashboard/current-weather" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white">Dashboard</Button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-36 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 px-4 py-1.5 text-sm text-blue-700 dark:text-blue-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Trusted by thousands of weather enthusiasts</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="text-foreground">Your Personal</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
                Weather Companion
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Get accurate real-time weather data, detailed forecasts, air quality insights, and intelligent alerts for any location worldwide.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              {isAuthenticated ? (
                <Link href="/dashboard/current-weather">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-xl shadow-blue-500/25">
                    <CloudSun className="h-5 w-5" />
                    Go to Dashboard
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="gap-2 h-12 px-8 text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-xl shadow-blue-500/25">
                      <Sparkles className="h-5 w-5" />
                      Get Started Free
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="h-12 px-8 text-base border-blue-200 dark:border-blue-800">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Unlimited locations</span>
              </div>
            </div>
          </motion.div>

          {/* Dashboard preview mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-2xl border bg-card shadow-2xl shadow-blue-500/10 overflow-hidden">
              {/* Mockup browser bar */}
              <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="mx-auto max-w-md rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground text-center truncate">
                    weathersphere.com/dashboard/current-weather
                  </div>
                </div>
              </div>
              {/* Mockup content */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Current Weather</div>
                    <div className="text-2xl font-bold flex items-baseline gap-1 mt-0.5">
                      <span>San Francisco</span>
                      <span className="text-sm font-normal text-muted-foreground">, CA</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      72°
                    </div>
                    <div className="text-xs text-muted-foreground">Partly Cloudy</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Humidity", value: "58%" },
                    { label: "Wind", value: "12 mph" },
                    { label: "AQI", value: "42" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg bg-muted/50 p-3 text-center">
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="text-lg font-semibold mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {[
                    { time: "Now", temp: 72 },
                    { time: "3PM", temp: 71 },
                    { time: "4PM", temp: 69 },
                    { time: "5PM", temp: 67 },
                    { time: "6PM", temp: 65 },
                  ].map((item) => (
                    <div
                      key={item.time}
                      className={`flex-1 rounded-lg p-2 text-center text-xs transition-colors ${
                        item.time === "Now"
                          ? "bg-blue-500 text-white"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <div className="font-medium">{item.time}</div>
                      <div className={item.time === "Now" ? "text-blue-100" : "text-muted-foreground/80"}>
                        {item.temp}°
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y bg-background/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <AnimatedCounter
                key={stat.label}
                to={parseInt(stat.value.replace(/,/g, ""))}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-4">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">stay ahead</span>
            {" "}of the weather
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Comprehensive weather tools designed for everyone — from outdoor enthusiasts to weather professionals.
          </p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative rounded-2xl border bg-card p-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/5 group-hover:-translate-y-1">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 border-y bg-background/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-4">
              <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Get started in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">3 easy steps</span>
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
              From signup to your first weather check in under a minute.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-blue-500/40 via-cyan-400/40 to-transparent" />
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${step.bgColor} ${step.color} shadow-lg mb-6`}>
                    <Icon className="h-7 w-7" />
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold shadow-md">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-4">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>Loved by Users</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            What our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">users</span>
            {" "}say
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Join thousands of satisfied users who trust WeatherSphere for their weather needs.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-2xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <StarRating rating={item.rating} />
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">&ldquo;{item.content}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-xs font-bold">
                  {item.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 px-6 py-14 sm:px-14 sm:py-20 text-center shadow-2xl shadow-blue-500/25"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative z-10">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm"
            >
              <CloudSun className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Ready to check the weather?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-lg text-blue-100">
              Join WeatherSphere today and get access to real-time weather data, forecasts, and alerts — completely free.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link href="/dashboard/current-weather">
                  <Button size="lg" className="h-12 px-8 text-base bg-white text-blue-700 hover:bg-blue-50 shadow-xl">
                    <CloudSun className="h-5 w-5 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="h-12 px-8 text-base bg-white text-blue-700 hover:bg-blue-50 shadow-xl gap-2">
                      <Sparkles className="h-5 w-5" />
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/30 text-white hover:bg-white/10 hover:text-white">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                  <CloudSun className="h-4 w-4" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  WeatherSphere
                </span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Your personal weather companion. Real-time data, accurate forecasts, and smart alerts for any location worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-3">
                {["Features", "How It Works", "Testimonials", "Pricing"].map((item) => (
                  <li key={item}>
                    <Link
                      href={item === "Features" ? "#features" : item === "How It Works" ? "#how-it-works" : item === "Testimonials" ? "#testimonials" : "#"}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-3">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-muted-foreground cursor-default">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-muted-foreground cursor-default">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} WeatherSphere. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link href="/dashboard/current-weather" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Dashboard <ExternalLink className="h-3 w-3" />
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
                  <Link href="/register" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: scrollProgress > 0.2 ? 1 : 0, scale: scrollProgress > 0.2 ? 1 : 0 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-shadow"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>
    </div>
  )
}

