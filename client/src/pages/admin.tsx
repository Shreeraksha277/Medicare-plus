import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDate, formatCurrency } from "@/lib/utils";
import { type Appointment, type Doctor, type Hospital } from "@shared/schema";
import {
  Users, Calendar, Stethoscope, Building2, Activity, TrendingUp,
  CheckCircle2, Clock, XCircle, ShieldCheck, Star, MapPin
} from "lucide-react";

interface AdminStats {
  totalPatients: number;
  totalAppointments: number;
  totalDoctors: number;
  totalHospitals: number;
  upcomingAppointments: number;
  completedAppointments: number;
}

export default function Admin() {
  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const r = await fetch("/api/admin/stats");
      return r.json();
    },
  });

  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      const r = await fetch("/api/appointments");
      return r.json();
    },
  });

  const { data: doctors } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"],
    queryFn: async () => {
      const r = await fetch("/api/doctors");
      return r.json();
    },
  });

  const { data: hospitals } = useQuery<Hospital[]>({
    queryKey: ["/api/hospitals"],
    queryFn: async () => {
      const r = await fetch("/api/hospitals");
      return r.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ confirmationNumber, status }: { confirmationNumber: string; status: string }) => {
      const r = await apiRequest("PATCH", `/api/appointments/${confirmationNumber}/status`, { status });
      return r.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/appointments"] }),
  });

  const statCards = [
    { label: "Total Patients", value: stats?.totalPatients ?? 0, icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10", change: "+12%" },
    { label: "Appointments", value: stats?.totalAppointments ?? 0, icon: Calendar, color: "text-teal-400", bg: "bg-teal-500/10", change: "+8%" },
    { label: "Doctors", value: stats?.totalDoctors ?? 0, icon: Stethoscope, color: "text-purple-400", bg: "bg-purple-500/10", change: "+2" },
    { label: "Hospitals", value: stats?.totalHospitals ?? 0, icon: Building2, color: "text-amber-400", bg: "bg-amber-500/10", change: "Active" },
    { label: "Upcoming", value: stats?.upcomingAppointments ?? 0, icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10", change: "Scheduled" },
    { label: "Completed", value: stats?.completedAppointments ?? 0, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", change: "Done" },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-in">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-2">
              <ShieldCheck size={14} />Admin Dashboard
            </div>
            <h1 className="text-3xl font-bold">MediCare Plus <span className="gradient-text">Admin</span></h1>
            <p className="text-muted-foreground text-sm">Manage hospitals, doctors, and appointments.</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-white/15">View Site</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, bg, change }) => (
            <div key={label} className="glass-card rounded-2xl p-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <div className="text-2xl font-bold mb-0.5">{value}</div>
              <div className="text-muted-foreground text-xs mb-1">{label}</div>
              <div className="text-xs font-medium text-teal-400">{change}</div>
            </div>
          ))}
        </div>

        {/* Analytics Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-cyan-400" />Performance Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Avg Rating", value: "4.76", color: "text-amber-400" },
                { label: "Booking Rate", value: "94%", color: "text-green-400" },
                { label: "Cancellation", value: "6%", color: "text-red-400" },
                { label: "Satisfaction", value: "98%", color: "text-cyan-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center p-4 rounded-xl bg-white/4">
                  <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>

            {/* Simple bar chart */}
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">Appointments by Specialty</p>
              <div className="space-y-2">
                {[
                  { label: "Cardiology", pct: 80, color: "bg-red-500" },
                  { label: "Neurology", pct: 55, color: "bg-purple-500" },
                  { label: "Orthopedics", pct: 70, color: "bg-amber-500" },
                  { label: "Pediatrics", pct: 45, color: "bg-green-500" },
                  { label: "General", pct: 65, color: "bg-cyan-500" },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-24">{label}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Activity size={18} className="text-teal-400" />Quick Actions
            </h2>
            <div className="space-y-2">
              {[
                { label: "Manage Hospitals", icon: Building2, color: "text-teal-400", bg: "bg-teal-500/10", href: "/hospitals" },
                { label: "Manage Doctors", icon: Stethoscope, color: "text-cyan-400", bg: "bg-cyan-500/10", href: "/doctors" },
                { label: "View Appointments", icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10", href: "#appointments" },
                { label: "Patient Records", icon: Users, color: "text-amber-400", bg: "bg-amber-500/10", href: "#patients" },
              ].map(({ label, icon: Icon, color, bg, href }) => (
                <a key={label} href={href}>
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/4 hover:bg-white/8 transition-colors text-left">
                    <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                      <Icon size={18} className={color} />
                    </div>
                    <span className="font-medium text-sm">{label}</span>
                  </button>
                </a>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-400 font-medium mb-1">⚠ Admin Notice</p>
              <p className="text-xs text-muted-foreground">This is a demo admin panel. In production, implement proper authentication.</p>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div id="appointments" className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
            <Calendar size={18} className="text-purple-400" />All Appointments
          </h2>
          {appointments && appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground text-xs uppercase tracking-wider border-b border-white/8">
                    <th className="pb-3 text-left">Confirmation #</th>
                    <th className="pb-3 text-left">Patient</th>
                    <th className="pb-3 text-left">Doctor</th>
                    <th className="pb-3 text-left">Date & Time</th>
                    <th className="pb-3 text-left">Fee</th>
                    <th className="pb-3 text-left">Status</th>
                    <th className="pb-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="py-3">
                      <td className="py-3 font-mono text-xs text-cyan-400">{appt.confirmationNumber}</td>
                      <td className="py-3 text-xs">{appt.patientId}</td>
                      <td className="py-3">
                        <div className="font-medium text-xs">{appt.doctorName}</div>
                        <div className="text-xs text-muted-foreground capitalize">{appt.specialty}</div>
                      </td>
                      <td className="py-3 text-xs">
                        <div>{formatDate(appt.appointmentDate)}</div>
                        <div className="text-muted-foreground">{appt.appointmentTime}</div>
                      </td>
                      <td className="py-3 text-xs font-semibold text-teal-400">{formatCurrency(appt.consultationFee)}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          appt.status === "upcoming" ? "badge-available" :
                          appt.status === "completed" ? "bg-blue-500/15 text-blue-400 border border-blue-500/30" :
                          "badge-busy"
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStatusMutation.mutate({ confirmationNumber: appt.confirmationNumber, status: "completed" })}
                            className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                            title="Mark Complete"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                          <button
                            onClick={() => updateStatusMutation.mutate({ confirmationNumber: appt.confirmationNumber, status: "cancelled" })}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Cancel"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar size={40} className="mx-auto mb-3 opacity-30" />
              <p>No appointments yet</p>
            </div>
          )}
        </div>

        {/* Doctors Table */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
            <Stethoscope size={18} className="text-cyan-400" />Doctor Directory ({doctors?.length || 0})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {doctors?.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/4">
                <img src={doc.imageUrl} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{doc.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{doc.specialty}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs">{doc.rating}</span>
                  </div>
                  <span className={`text-xs ${doc.availability === "available" ? "text-teal-400" : doc.availability === "next-day" ? "text-amber-400" : "text-red-400"}`}>
                    {doc.availability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hospitals Table */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
            <Building2 size={18} className="text-teal-400" />Hospital Network ({hospitals?.length || 0})
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {hospitals?.map((h) => (
              <div key={h.id} className="flex items-center gap-3 p-4 rounded-xl bg-white/4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${h.imageColor} flex items-center justify-center flex-shrink-0`}>
                  <Building2 size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{h.name}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={11} />{h.city}
                    <span className="mx-1">·</span>
                    <Star size={11} className="text-amber-400 fill-amber-400" />{h.rating}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold">{h.availableDoctors} docs</div>
                  {h.emergency && <div className="text-xs text-red-400">24/7 ER</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
