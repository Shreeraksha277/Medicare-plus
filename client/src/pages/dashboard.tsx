import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Appointment, type Doctor } from "@shared/schema";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Calendar, Clock, User, Activity, Stethoscope, Building2,
  Heart, Brain, ChevronRight, Star, MapPin, LogOut, FileText,
  Droplet, Ruler, Weight, Phone
} from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const patientId = sessionStorage.getItem("currentPatientId");
  const patientStr = sessionStorage.getItem("currentPatient");
  const patient = patientStr ? JSON.parse(patientStr) : null;

  useEffect(() => {
    if (!patientId) setLocation("/login");
  }, [patientId, setLocation]);

  const { data: appointments, isLoading: apptLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments/patient", patientId],
    queryFn: async () => {
      const r = await fetch(`/api/appointments/patient/${patientId}`);
      return r.json();
    },
    enabled: !!patientId,
  });

  const { data: recommendedDoctors } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"],
    queryFn: async () => {
      const r = await fetch("/api/doctors");
      return r.json();
    },
  });

  const now = new Date();
  const upcoming = appointments?.filter((a) => {
    const date = new Date(a.appointmentDate);
    return date >= now && a.status !== "cancelled";
  }) || [];
  const previous = appointments?.filter((a) => {
    const date = new Date(a.appointmentDate);
    return date < now || a.status === "completed";
  }) || [];

  const getStatusBadge = (status: string) => {
    if (status === "upcoming") return <span className="badge-available text-xs px-2 py-0.5 rounded-full font-medium">Upcoming</span>;
    if (status === "completed") return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30">Completed</span>;
    return <span className="badge-busy text-xs px-2 py-0.5 rounded-full font-medium">Cancelled</span>;
  };

  const quickStats = [
    { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Completed", value: previous.length, icon: Activity, color: "text-teal-400", bg: "bg-teal-500/10" },
    { label: "Doctors Seen", value: new Set(appointments?.map((a) => a.doctorName)).size, icon: User, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Total Spent", value: formatCurrency(appointments?.reduce((s, a) => s + a.consultationFee, 0) || 0), icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  if (!patientId) return null;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 fade-in">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, <span className="gradient-text">{patient?.fullName?.split(" ")[0] || "Patient"}</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Patient ID: <span className="font-mono text-cyan-400">{patientId}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/doctors">
              <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 btn-glow gap-2">
                <Calendar size={16} />Book Appointment
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2"
              onClick={() => { sessionStorage.clear(); setLocation("/"); }}
            >
              <LogOut size={16} />Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="glass-card rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <div className="text-2xl font-bold mb-0.5">{value}</div>
              <div className="text-muted-foreground text-sm">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Appointments */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Calendar size={20} className="text-cyan-400" />Upcoming Appointments
                </h2>
                <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/20">{upcoming.length}</Badge>
              </div>
              {apptLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
                </div>
              ) : upcoming.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No upcoming appointments</p>
                  <Link href="/doctors">
                    <Button size="sm" className="mt-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0">
                      Book Now
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((appt) => (
                    <div key={appt.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/4 hover:bg-white/6 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                        <Stethoscope size={22} className="text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{appt.doctorName}</div>
                        <div className="text-sm text-muted-foreground">{appt.specialty} · {appt.hospital}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(appt.appointmentDate)}</span>
                          <span className="flex items-center gap-1"><Clock size={12} />{appt.appointmentTime}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {getStatusBadge(appt.status)}
                        <div className="text-sm font-semibold text-cyan-400 mt-1">{formatCurrency(appt.consultationFee)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Previous Appointments */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Activity size={20} className="text-teal-400" />Previous Appointments
                </h2>
                <Badge className="bg-teal-500/15 text-teal-400 border-teal-500/20">{previous.length}</Badge>
              </div>
              {previous.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No previous appointments</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {previous.map((appt) => (
                    <div key={appt.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/4 opacity-75">
                      <div className="w-12 h-12 rounded-xl bg-teal-500/15 flex items-center justify-center flex-shrink-0">
                        <Stethoscope size={22} className="text-teal-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{appt.doctorName}</div>
                        <div className="text-sm text-muted-foreground">{appt.specialty}</div>
                        <div className="text-xs text-muted-foreground mt-1">{formatDate(appt.appointmentDate)} · {appt.appointmentTime}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {getStatusBadge("completed")}
                        <div className="text-sm font-semibold mt-1">{formatCurrency(appt.consultationFee)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Doctors */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <User size={20} className="text-purple-400" />Recommended Doctors
                </h2>
                <Link href="/doctors">
                  <button className="text-xs text-cyan-400 flex items-center gap-1 hover:text-cyan-300">
                    View All <ChevronRight size={14} />
                  </button>
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {recommendedDoctors?.slice(0, 4).map((doc) => (
                  <Link href={`/doctors/${doc.id}`} key={doc.id}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/4 hover:bg-white/6 transition-colors cursor-pointer">
                      <img src={doc.imageUrl} alt={doc.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{doc.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">{doc.specialty}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs">{doc.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Profile */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <User size={20} className="text-amber-400" />Medical Profile
              </h2>
              {patient ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl">
                      {patient.fullName?.[0] || "P"}
                    </div>
                    <div>
                      <div className="font-bold">{patient.fullName}</div>
                      <div className="text-xs text-muted-foreground">{patient.gender} · DOB: {patient.dateOfBirth}</div>
                    </div>
                  </div>
                  {[
                    { icon: Droplet, label: "Blood Group", value: patient.bloodGroup, color: "text-red-400" },
                    { icon: Ruler, label: "Height", value: `${patient.height} cm`, color: "text-blue-400" },
                    { icon: Weight, label: "Weight", value: `${patient.weight} kg`, color: "text-green-400" },
                    { icon: Phone, label: "Phone", value: patient.phoneNumber, color: "text-purple-400" },
                    { icon: MapPin, label: "City", value: `${patient.city}, ${patient.state}`, color: "text-amber-400" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      <Icon size={16} className={color} />
                      <span className="text-muted-foreground text-sm flex-1">{label}</span>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  ))}
                  {patient.existingDiseases && (
                    <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/15 text-sm">
                      <div className="flex items-center gap-1.5 mb-1 text-red-400 font-medium"><Heart size={14} />Conditions</div>
                      <div className="text-muted-foreground">{patient.existingDiseases}</div>
                    </div>
                  )}
                  {patient.allergies && (
                    <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/15 text-sm">
                      <div className="flex items-center gap-1.5 mb-1 text-amber-400 font-medium"><Activity size={14} />Allergies</div>
                      <div className="text-muted-foreground">{patient.allergies}</div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Profile data not available.</p>
              )}
            </div>

            {/* Nearby Hospitals */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-teal-400" />Nearby Hospitals
              </h2>
              <div className="space-y-3">
                {[
                  { name: "City General Hospital", distance: "2.3 km", rating: 4.7 },
                  { name: "Apollo Health Institute", distance: "5.1 km", rating: 4.9 },
                  { name: "Metropolitan Medical", distance: "8.4 km", rating: 4.6 },
                ].map((h) => (
                  <div key={h.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/4">
                    <div className="w-9 h-9 rounded-lg bg-teal-500/15 flex items-center justify-center flex-shrink-0">
                      <Building2 size={18} className="text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{h.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="flex items-center gap-1"><MapPin size={11} />{h.distance}</span>
                        <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{h.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/hospitals">
                  <Button variant="outline" size="sm" className="w-full border-white/15 mt-2 gap-1.5 text-xs">
                    <MapPin size={14} />View All Hospitals
                  </Button>
                </Link>
              </div>
            </div>

            {/* AI Symptom Checker */}
            <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Brain size={20} className="text-purple-400" />
                </div>
                <div>
                  <div className="font-bold text-sm">AI Symptom Checker</div>
                  <div className="text-xs text-muted-foreground">Get instant health guidance</div>
                </div>
              </div>
              <Link href="/symptom-checker">
                <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 gap-2">
                  <Brain size={14} />Check Symptoms
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
