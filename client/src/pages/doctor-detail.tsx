import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Doctor } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import {
  Star, MapPin, Clock, Award, Languages, IndianRupee, Calendar,
  ChevronLeft, User, CheckCircle2, Stethoscope, Building2
} from "lucide-react";

interface DoctorDetailProps {
  params: { id: string };
}

export default function DoctorDetail({ params }: DoctorDetailProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { id } = params;
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [problem, setProblem] = useState("");
  const [showBooking, setShowBooking] = useState(false);

  const { data: doctor, isLoading } = useQuery<Doctor>({
    queryKey: ["/api/doctors", id],
    queryFn: async () => {
      const r = await fetch(`/api/doctors/${id}`);
      if (!r.ok) throw new Error("Doctor not found");
      return r.json();
    },
  });

  const bookMutation = useMutation({
    mutationFn: async () => {
      const patientId = sessionStorage.getItem("currentPatientId");
      if (!patientId) throw new Error("Please login to book an appointment");
      if (!selectedDate) throw new Error("Please select a date");
      if (!selectedSlot) throw new Error("Please select a time slot");

      const response = await apiRequest("POST", "/api/appointments", {
        patientId,
        doctorId: doctor!.id,
        doctorName: doctor!.name,
        specialty: doctor!.specialty,
        hospital: doctor!.hospital,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
        consultationFee: doctor!.consultationFee,
        problemDescription: problem,
        status: "upcoming",
      });
      return response.json();
    },
    onSuccess: (appt) => {
      toast({ title: "Appointment Booked!", description: `Confirmation: ${appt.confirmationNumber}` });
      setLocation(`/confirmation/${appt.confirmationNumber}`);
    },
    onError: (err: Error) => {
      if (err.message.includes("login")) {
        toast({ title: "Login Required", description: "Please login to book an appointment.", variant: "destructive" });
        setLocation("/login");
      } else {
        toast({ title: "Booking Failed", description: err.message, variant: "destructive" });
      }
    },
  });

  const getNext7Days = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        value: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      });
    }
    return days;
  };

  const specialtyLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex gap-6">
              <div className="skeleton w-32 h-32 rounded-2xl" />
              <div className="flex-1 space-y-3">
                <div className="skeleton h-6 w-64" />
                <div className="skeleton h-4 w-48" />
                <div className="skeleton h-4 w-full" />
              </div>
            </div>
          </div>
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="text-center">
          <User size={48} className="mx-auto mb-4 opacity-30" />
          <h2 className="text-xl font-bold mb-2">Doctor not found</h2>
          <Button onClick={() => setLocation("/doctors")} variant="outline" className="border-white/15">Back to Doctors</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => setLocation("/doctors")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Doctors
        </button>

        {/* Doctor Profile */}
        <div className="glass-card rounded-2xl p-6 mb-6 fade-in">
          <div className="flex flex-col sm:flex-row gap-6">
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="w-32 h-32 rounded-2xl object-cover flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0D8ABC&color=fff&size=200`;
              }}
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-3 mb-2">
                <h1 className="text-2xl font-bold">{doctor.name}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  doctor.availability === "available" ? "badge-available" :
                  doctor.availability === "next-day" ? "badge-next-day" : "badge-busy"
                }`}>
                  {doctor.availability === "available" ? "Available Today" :
                   doctor.availability === "next-day" ? "Next Day" : "Busy"}
                </span>
              </div>
              <p className="text-cyan-400 font-semibold text-lg mb-3">{specialtyLabel(doctor.specialty)}</p>
              <p className="text-sm text-muted-foreground mb-1">{doctor.qualifications}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="text-center p-3 rounded-xl bg-white/4">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  </div>
                  <div className="font-bold">{doctor.rating}</div>
                  <div className="text-xs text-muted-foreground">{doctor.reviewCount} reviews</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/4">
                  <Award size={18} className="text-purple-400 mx-auto mb-1" />
                  <div className="font-bold">{doctor.experience}+</div>
                  <div className="text-xs text-muted-foreground">Years Exp.</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/4">
                  <IndianRupee size={18} className="text-teal-400 mx-auto mb-1" />
                  <div className="font-bold text-sm">{formatCurrency(doctor.consultationFee)}</div>
                  <div className="text-xs text-muted-foreground">Consultation</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/4">
                  <Languages size={18} className="text-cyan-400 mx-auto mb-1" />
                  <div className="font-bold text-xs">{doctor.languages.slice(0, 2).join(", ")}</div>
                  <div className="text-xs text-muted-foreground">Languages</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-white/8 grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 size={15} className="text-teal-400 flex-shrink-0" />
              {doctor.hospital}, {doctor.city}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={15} className="text-purple-400 flex-shrink-0" />
              {doctor.schedule}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Stethoscope size={18} className="text-cyan-400" />About
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">{doctor.about}</p>
        </div>

        {/* Booking Section */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Calendar size={18} className="text-teal-400" />Book Appointment
            </h2>
            {!showBooking && (
              <Button
                onClick={() => setShowBooking(true)}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 btn-glow gap-2"
              >
                <Calendar size={16} />Book Now
              </Button>
            )}
          </div>

          {/* Available Slots Preview */}
          {!showBooking && (
            <div>
              <p className="text-sm text-muted-foreground mb-3">Available time slots:</p>
              <div className="flex flex-wrap gap-2">
                {doctor.availableSlots.map((slot) => (
                  <span key={slot.time} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    slot.available
                      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                      : "border-white/10 bg-white/4 text-muted-foreground line-through opacity-50"
                  }`}>
                    {slot.time}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Full Booking Form */}
          {showBooking && (
            <div className="space-y-5">
              {/* Date Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Date</label>
                <div className="flex flex-wrap gap-2">
                  {getNext7Days().map((day) => (
                    <button
                      key={day.value}
                      onClick={() => setSelectedDate(day.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedDate === day.value
                          ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                          : "border-white/10 bg-white/4 text-muted-foreground hover:border-white/20"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Time Slot</label>
                <div className="flex flex-wrap gap-2">
                  {doctor.availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => slot.available && setSelectedSlot(slot.time)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        !slot.available
                          ? "border-white/5 bg-white/2 text-muted-foreground opacity-40 cursor-not-allowed"
                          : selectedSlot === slot.time
                          ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                          : "border-white/10 bg-white/4 text-muted-foreground hover:border-white/20 hover:text-foreground"
                      }`}
                    >
                      {slot.available && selectedSlot === slot.time && <CheckCircle2 size={10} className="inline mr-1" />}
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">Problem Description (Optional)</label>
                <Textarea
                  placeholder="Briefly describe your symptoms or reason for visit..."
                  className="glass border-white/10 focus:border-cyan-500/50 resize-none"
                  rows={3}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                />
              </div>

              {/* Summary */}
              {selectedDate && selectedSlot && (
                <div className="p-4 rounded-xl bg-cyan-500/8 border border-cyan-500/20">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span className="font-medium">{doctor.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedDate}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{selectedSlot}</span></div>
                    <div className="flex justify-between pt-1 border-t border-white/8">
                      <span className="text-muted-foreground">Consultation Fee</span>
                      <span className="font-bold text-cyan-400">{formatCurrency(doctor.consultationFee)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-white/15"
                  onClick={() => { setShowBooking(false); setSelectedDate(""); setSelectedSlot(""); }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 btn-glow font-semibold gap-2"
                  disabled={bookMutation.isPending}
                  onClick={() => bookMutation.mutate()}
                >
                  {bookMutation.isPending ? "Booking..." : (
                    <><Calendar size={16} />Confirm Booking</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
