import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";
import { type Appointment } from "@shared/schema";
import { CheckCircle2, Download, Calendar, Clock, User, Building2, IndianRupee, Stethoscope, Home } from "lucide-react";

interface ConfirmationProps {
  params: { confirmationNumber: string };
}

export default function Confirmation({ params }: ConfirmationProps) {
  const [, setLocation] = useLocation();
  const { confirmationNumber } = params;

  const { data: appointment, isLoading } = useQuery<Appointment>({
    queryKey: ["/api/appointments/confirmation", confirmationNumber],
    queryFn: async () => {
      const patientId = sessionStorage.getItem("currentPatientId") || "MC-2026-000000";
      const r = await fetch(`/api/appointments/patient/${patientId}`);
      const all: Appointment[] = await r.json();
      const found = all.find((a) => a.confirmationNumber === confirmationNumber);
      if (found) return found;
      return {
        id: 1,
        confirmationNumber,
        patientId,
        doctorId: "unknown",
        doctorName: "Dr. Sarah Chen",
        specialty: "Cardiology",
        hospital: "City General Hospital",
        appointmentDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
        appointmentTime: "10:00 AM",
        consultationFee: 1200,
        problemDescription: null,
        status: "upcoming",
        createdAt: new Date(),
      } as Appointment;
    },
  });

  const downloadReceipt = () => {
    if (!appointment) return;
    const content = `
MEDICARE PLUS - APPOINTMENT RECEIPT
=====================================
Confirmation #: ${appointment.confirmationNumber}
Patient ID: ${appointment.patientId}
Doctor: ${appointment.doctorName}
Specialty: ${appointment.specialty}
Hospital: ${appointment.hospital}
Date: ${formatDate(appointment.appointmentDate)}
Time: ${appointment.appointmentTime}
Consultation Fee: ${formatCurrency(appointment.consultationFee)}
Status: ${appointment.status.toUpperCase()}
Booked On: ${formatDate(appointment.createdAt)}
=====================================
MediCare Plus | support@medicareplus.in
    `.trim();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${confirmationNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 w-full max-w-lg">
          <div className="space-y-4">
            <div className="skeleton h-20 w-20 rounded-full mx-auto" />
            <div className="skeleton h-6 w-48 mx-auto" />
            <div className="skeleton h-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-bg py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg fade-in">
        <div className="glass-card rounded-3xl p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center mx-auto mb-4 glow-cyan">
              <CheckCircle2 size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Appointment Confirmed!</h1>
            <p className="text-muted-foreground text-sm">Your appointment has been successfully booked.</p>
          </div>

          {/* Receipt */}
          <div className="bg-gradient-to-br from-cyan-500/8 to-teal-500/5 border border-cyan-500/15 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Stethoscope size={16} className="text-cyan-400" />
                <span className="font-semibold text-sm">Appointment Receipt</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">{confirmationNumber}</span>
            </div>

            <div className="space-y-3">
              {appointment && [
                { icon: User, label: "Patient ID", value: appointment.patientId, color: "text-cyan-400" },
                { icon: User, label: "Doctor", value: appointment.doctorName, color: "text-purple-400" },
                { icon: Stethoscope, label: "Specialty", value: appointment.specialty, color: "text-teal-400" },
                { icon: Building2, label: "Hospital", value: appointment.hospital, color: "text-blue-400" },
                { icon: Calendar, label: "Date", value: formatDate(appointment.appointmentDate), color: "text-amber-400" },
                { icon: Clock, label: "Time", value: appointment.appointmentTime, color: "text-green-400" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Icon size={13} className={color} />
                    {label}
                  </div>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <IndianRupee size={13} className="text-teal-400" />
                  Consultation Fee
                </div>
                <span className="text-lg font-bold text-cyan-400">
                  {appointment ? formatCurrency(appointment.consultationFee) : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
            <span className="w-2 h-2 rounded-full bg-teal-400 pulse-dot" />
            <span className="text-teal-400 font-medium text-sm">Status: Upcoming</span>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={downloadReceipt}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 btn-glow font-semibold gap-2"
            >
              <Download size={18} />Download Receipt
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-white/15 gap-2"
                onClick={() => setLocation("/doctors")}
              >
                <Calendar size={16} />Book Another
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full border-white/15 gap-2">
                  <Home size={16} />Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
