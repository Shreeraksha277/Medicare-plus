import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Stethoscope, Search, Star, ArrowRight, Shield, Clock, Award, Users,
  Heart, Brain, Bone, Baby, Eye, Activity, ChevronRight, MapPin,
  Phone, Mail, Facebook, Twitter, Instagram, Youtube, CheckCircle2
} from "lucide-react";

const specialties = [
  { icon: Heart, label: "Cardiology", color: "from-red-500 to-rose-400", count: "3 Doctors" },
  { icon: Brain, label: "Neurology", color: "from-purple-500 to-violet-400", count: "2 Doctors" },
  { icon: Bone, label: "Orthopedics", color: "from-amber-500 to-orange-400", count: "2 Doctors" },
  { icon: Baby, label: "Pediatrics", color: "from-green-500 to-teal-400", count: "1 Doctor" },
  { icon: Eye, label: "Dermatology", color: "from-pink-500 to-rose-300", count: "1 Doctor" },
  { icon: Activity, label: "General", color: "from-cyan-500 to-blue-400", count: "1 Doctor" },
];

const features = [
  {
    icon: Shield,
    title: "Verified Specialists",
    desc: "Every doctor on our platform is board-certified and background-verified for your safety.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Clock,
    title: "Instant Booking",
    desc: "Book appointments in under 60 seconds with real-time slot availability and confirmation.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    icon: Award,
    title: "Top-Rated Hospitals",
    desc: "Access 8+ NABH-accredited hospitals with world-class infrastructure and care.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Users,
    title: "Expert Medical Team",
    desc: "12+ experienced doctors across 7 specialties with an average rating of 4.7 stars.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const testimonials = [
  {
    name: "Aditi Menon",
    role: "Heart Patient",
    rating: 5,
    text: "MediCare Plus made it incredibly easy to find and book with Dr. Sarah Chen. The appointment process was seamless and the care was exceptional.",
    avatar: "AM",
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Rohan Desai",
    role: "Orthopedic Patient",
    rating: 5,
    text: "Booked a consultation with Dr. Robert Brown for my knee surgery. The platform is intuitive and the receipt was generated instantly. Highly recommend!",
    avatar: "RD",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Kavitha S.",
    role: "Parent",
    rating: 5,
    text: "Finding a reliable pediatrician for my son was stressful until I found MediCare Plus. Dr. Maria Garcia is wonderful and the booking was effortless.",
    avatar: "KS",
    color: "from-teal-500 to-green-500",
  },
];

const stats = [
  { value: "12+", label: "Expert Doctors" },
  { value: "8+", label: "Top Hospitals" },
  { value: "5K+", label: "Happy Patients" },
  { value: "4.8", label: "Avg Rating" },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/doctors?name=${encodeURIComponent(searchQuery)}`);
    } else {
      setLocation("/doctors");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="hero-bg relative overflow-hidden min-h-[92vh] flex items-center">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/2 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot" />
                Your Trusted Healthcare Partner
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Modern
                <span className="gradient-text block">Healthcare</span>
                At Your Fingertips
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
                Connect with certified specialists, book appointments instantly, and manage your health records — all in one secure platform.
              </p>

              {/* Search */}
              <div className="flex gap-2 mb-8 max-w-lg">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <Input
                    placeholder="Search doctors, specialties..."
                    className="pl-10 h-12 glass border-white/10 focus:border-cyan-500/50 bg-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-12 px-6 bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-400 hover:to-teal-400 border-0 btn-glow font-semibold"
                >
                  Search
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-400 hover:to-teal-400 border-0 btn-glow font-semibold gap-2"
                  >
                    Get Started Free
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link href="/doctors">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/15 text-white hover:bg-white/5 font-semibold gap-2"
                  >
                    Browse Doctors
                    <ChevronRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                {/* Central card */}
                <div className="glass-card rounded-3xl p-8 w-80 animate-float">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center">
                      <Stethoscope size={32} className="text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">MediCare Plus</div>
                      <div className="text-gray-300 text-sm">Healthcare Platform</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Available Doctors", value: "12+", color: "text-cyan-400" },
                      { label: "Hospitals", value: "8+", color: "text-teal-400" },
                      { label: "Patient Rating", value: "4.8★", color: "text-amber-400" },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center p-3 rounded-xl bg-white/4">
                        <span className="text-gray-300 text-sm">{item.label}</span>
                        <span className={`font-bold ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-6 -right-6 glass-card rounded-2xl px-4 py-3 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-teal-400" />
                  <span className="text-sm font-medium text-white">Appointment Confirmed!</span>
                </div>
                <div className="absolute -bottom-6 -left-6 glass-card rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Star size={18} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium text-white">4.9 Top Rated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title gradient-text mb-3">Browse By Specialty</h2>
            <p className="text-gray-300 max-w-xl mx-auto">Find the right specialist for your health needs across our comprehensive range of medical specialties.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {specialties.map(({ icon: Icon, label, color, count }) => (
              <Link href={`/doctors?specialty=${label.toLowerCase()}`} key={label}>
                <div className="glass-card card-hover rounded-2xl p-5 text-center cursor-pointer group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <div className="font-semibold text-sm mb-1">{label}</div>
                  <div className="text-xs text-gray-300">{count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Why Choose <span className="gradient-text">MediCare Plus</span>?</h2>
            <p className="text-gray-300 max-w-xl mx-auto">We combine technology with compassionate care to deliver the best healthcare experience possible.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="glass-card card-hover rounded-2xl p-6">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon size={24} className={color} />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">What Our <span className="gradient-text">Patients Say</span></h2>
            <p className="text-gray-300 max-w-xl mx-auto">Thousands of patients trust MediCare Plus for their healthcare needs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card card-hover rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-300">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-teal-500/5 pointer-events-none" />
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
              <p className="text-gray-300 mb-8 max-w-lg mx-auto">Join thousands of patients who trust MediCare Plus for their healthcare journey.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 btn-glow font-semibold gap-2">
                    Create Free Account
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link href="/hospitals">
                  <Button size="lg" variant="outline" className="border-white/15 font-semibold">
                    View Hospitals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                  <Stethoscope size={16} className="text-white" />
                </div>
                <span className="font-bold gradient-text">MediCare Plus</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">Your trusted healthcare platform connecting patients with certified specialists across India.</p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-gray-300 hover:text-cyan-400 transition-colors">
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {[["Home", "/"], ["Hospitals", "/hospitals"], ["Doctors", "/doctors"], ["About Us", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-cyan-400 transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Specialties</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "Psychiatry"].map((s) => (
                  <li key={s}><Link href={`/doctors?specialty=${s.toLowerCase()}`} className="hover:text-cyan-400 transition-colors">{s}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2"><MapPin size={14} className="text-cyan-400" />Bangalore, Karnataka</li>
                <li className="flex items-center gap-2"><Phone size={14} className="text-cyan-400" />+91 80 1234 5678</li>
                <li className="flex items-center gap-2"><Mail size={14} className="text-cyan-400" />support@medicareplus.in</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
            <p>© 2026 MediCare Plus. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
