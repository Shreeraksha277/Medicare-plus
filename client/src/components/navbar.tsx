import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Stethoscope, Sun, Moon, Menu, X, Home, Building2,
  UserRound, Info, Phone, LogIn, UserPlus, LayoutDashboard,
  Brain, ShieldCheck
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/hospitals", label: "Hospitals", icon: Building2 },
  { href: "/doctors", label: "Doctors", icon: UserRound },
  { href: "/symptom-checker", label: "AI Checker", icon: Brain },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
];

export default function Navbar() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!sessionStorage.getItem("currentPatientId");

  return (
    <nav className="glass-nav fixed w-full top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/30 transition-all duration-300">
              <Stethoscope size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">MediCare Plus</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}>
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location === href
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {label}
                </button>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isLoggedIn ? (
              <>
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hidden sm:flex gap-1.5 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  className="hidden sm:flex border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => {
                    sessionStorage.removeItem("currentPatientId");
                    window.location.href = "/";
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <LogIn size={16} />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="hidden sm:flex gap-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-400 hover:to-teal-400 border-0 btn-glow"
                  >
                    <UserPlus size={16} />
                    Register
                  </Button>
                </Link>
              </>
            )}

            {/* Admin link */}
            <Link href="/admin">
              <button
                className="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                title="Admin"
              >
                <ShieldCheck size={16} />
              </button>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden glass border-t border-white/5 px-4 py-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <button
                onClick={() => setMobileOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  location === href
                    ? "bg-cyan-500/15 text-cyan-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            </Link>
          ))}
          <div className="pt-2 border-t border-white/5 flex gap-2">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-500/30 text-red-400"
                  onClick={() => {
                    sessionStorage.removeItem("currentPatientId");
                    window.location.href = "/";
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full" onClick={() => setMobileOpen(false)}>
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0"
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
