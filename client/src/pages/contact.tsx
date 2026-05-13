import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    }, 1500);
  };

  const contactInfo = [
    { icon: MapPin, label: "Address", value: "15 MG Road, Bangalore, Karnataka 560001", color: "text-cyan-400" },
    { icon: Phone, label: "Phone", value: "+91 80 1234 5678", color: "text-teal-400" },
    { icon: Mail, label: "Email", value: "support@medicareplus.in", color: "text-purple-400" },
    { icon: Clock, label: "Working Hours", value: "Mon–Sat: 9:00 AM – 6:00 PM", color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Get in <span className="gradient-text">Touch</span></h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Have questions? We're here to help. Reach out to our support team anytime.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="glass-card rounded-2xl p-5 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`} style={{ background: "rgba(255,255,255,0.06)" }}>
                  <Icon size={20} className={color} />
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-1">{label}</div>
                  <div className="font-medium text-sm">{value}</div>
                </div>
              </div>
            ))}

            {/* Emergency */}
            <div className="glass-card rounded-2xl p-5 bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Phone size={16} className="text-red-400" />
                <span className="font-bold text-red-400 text-sm">Emergency Helpline</span>
              </div>
              <div className="text-2xl font-bold mb-1">108</div>
              <p className="text-xs text-muted-foreground">Available 24/7 for medical emergencies</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 glass-card rounded-2xl p-8">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-6">Thank you for reaching out. Our team will respond within 24 hours.</p>
                <Button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} variant="outline" className="border-white/15">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                      <Input
                        placeholder="Your name"
                        className="glass border-white/10 focus:border-cyan-500/50"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Email *</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="glass border-white/10 focus:border-cyan-500/50"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Subject</label>
                    <Input
                      placeholder="How can we help you?"
                      className="glass border-white/10 focus:border-cyan-500/50"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Message *</label>
                    <Textarea
                      placeholder="Tell us more about your query..."
                      rows={5}
                      className="glass border-white/10 focus:border-cyan-500/50 resize-none"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 btn-glow font-semibold gap-2"
                    size="lg"
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                    ) : (
                      <><Send size={18} />Send Message</>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-8 glass-card rounded-2xl overflow-hidden h-48 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin size={40} className="mx-auto mb-3 text-cyan-400" />
            <p className="font-medium">MediCare Plus HQ</p>
            <p className="text-sm">15 MG Road, Bangalore, Karnataka</p>
            <a
              href="https://maps.google.com/?q=MG+Road+Bangalore"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 inline-block"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
