import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Stethoscope, Shield, Users, Award, Heart, Target, ArrowRight } from "lucide-react";

const team = [
  { name: "Dr. Aravind Nair", role: "Chief Medical Officer", specialty: "Cardiology", avatar: "AN", color: "from-cyan-500 to-blue-500" },
  { name: "Meera Krishnan", role: "CEO & Co-founder", specialty: "Healthcare Tech", avatar: "MK", color: "from-purple-500 to-pink-500" },
  { name: "Dr. Sanjay Patel", role: "Head of Neurology", specialty: "Neurology", avatar: "SP", color: "from-teal-500 to-green-500" },
  { name: "Ritu Sharma", role: "Head of Product", specialty: "UX Design", avatar: "RS", color: "from-amber-500 to-orange-500" },
];

const values = [
  { icon: Heart, title: "Patient First", desc: "Every decision we make puts patient health and well-being at the center.", color: "text-red-400", bg: "bg-red-500/10" },
  { icon: Shield, title: "Trust & Safety", desc: "All doctors are verified. All data is encrypted and protected.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { icon: Target, title: "Accessibility", desc: "Making quality healthcare accessible to everyone, everywhere.", color: "text-teal-400", bg: "bg-teal-500/10" },
  { icon: Award, title: "Excellence", desc: "We maintain the highest standards in healthcare and technology.", color: "text-amber-400", bg: "bg-amber-500/10" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="hero-bg py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center mx-auto mb-6">
            <Stethoscope size={32} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6">About <span className="gradient-text">MediCare Plus</span></h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We are on a mission to transform healthcare delivery in India by connecting patients with the best doctors and hospitals through cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our <span className="gradient-text">Mission</span></h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              MediCare Plus was founded in 2020 with a simple but powerful vision: to make world-class healthcare accessible to every person in India, regardless of location or economic background.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We partner with NABH-accredited hospitals and board-certified specialists to create a seamless appointment booking experience that saves time, reduces stress, and improves health outcomes.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "5K+", label: "Patients Served" },
                { value: "12+", label: "Expert Doctors" },
                { value: "8+", label: "Top Hospitals" },
              ].map(({ value, label }) => (
                <div key={label} className="glass-card rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold gradient-text mb-1">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-3xl p-8">
            <h3 className="font-bold text-xl mb-5">Our Journey</h3>
            {[
              { year: "2020", event: "MediCare Plus founded in Bangalore" },
              { year: "2021", event: "Onboarded 5 hospitals and 20 doctors" },
              { year: "2022", event: "Launched AI Symptom Checker feature" },
              { year: "2023", event: "Crossed 2,500 registered patients" },
              { year: "2024", event: "Expanded to 8 cities across Karnataka" },
              { year: "2025", event: "Launched mobile app with 10K+ downloads" },
            ].map(({ year, event }, i) => (
              <div key={year} className="flex gap-4 mb-4 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  {i < 5 && <div className="w-px flex-1 bg-white/10 mt-1" />}
                </div>
                <div className="pb-4">
                  <span className="text-cyan-400 font-bold text-sm">{year}</span>
                  <p className="text-muted-foreground text-sm">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-white/2">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Our <span className="gradient-text">Core Values</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="glass-card card-hover rounded-2xl p-6 text-center">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={24} className={color} />
                </div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Meet Our <span className="gradient-text">Team</span></h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">Our diverse team of medical professionals and tech experts work together to deliver the best healthcare platform.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, specialty, avatar, color }) => (
              <div key={name} className="glass-card card-hover rounded-2xl p-6 text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold`}>
                  {avatar}
                </div>
                <h3 className="font-bold mb-1">{name}</h3>
                <p className="text-cyan-400 text-sm font-medium mb-1">{role}</p>
                <p className="text-muted-foreground text-xs">{specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-teal-500/5 pointer-events-none" />
          <div className="relative">
            <Users size={40} className="text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Be part of a healthcare revolution. Register today and experience the future of medical care.</p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 btn-glow font-semibold gap-2">
                Get Started <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
