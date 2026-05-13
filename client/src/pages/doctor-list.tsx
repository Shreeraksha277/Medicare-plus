import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Doctor } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Search, Star, MapPin, Clock, IndianRupee, User, ChevronRight, Stethoscope } from "lucide-react";

const specialties = [
  { value: "all", label: "All Specialties" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "dermatology", label: "Dermatology" },
  { value: "psychiatry", label: "Psychiatry" },
  { value: "gynecology", label: "Gynecology" },
  { value: "general", label: "General Medicine" },
];

const locations = [
  { value: "all", label: "All Cities" },
  { value: "bangalore", label: "Bangalore" },
  { value: "mysuru", label: "Mysuru" },
  { value: "udupi", label: "Udupi" },
  { value: "shivamogga", label: "Shivamogga" },
  { value: "davangere", label: "Davangere" },
  { value: "ballari", label: "Ballari" },
];

export default function DoctorList() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [location, setLocation] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sp = params.get("specialty");
    const loc = params.get("location");
    const name = params.get("name");
    if (sp) setSpecialty(sp);
    if (loc) setLocation(loc);
    if (name) setSearch(name);
  }, []);

  const { data: doctors, isLoading } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors", specialty, location, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (specialty && specialty !== "all") params.set("specialty", specialty);
      if (location && location !== "all") params.set("location", location);
      if (search) params.set("name", search);
      const r = await fetch(`/api/doctors?${params.toString()}`);
      return r.json();
    },
  });

  const getAvailabilityBadge = (availability: string) => {
    if (availability === "available") return <span className="badge-available text-xs px-2 py-0.5 rounded-full font-medium">Available Today</span>;
    if (availability === "next-day") return <span className="badge-next-day text-xs px-2 py-0.5 rounded-full font-medium">Next Available: Tomorrow</span>;
    return <span className="badge-busy text-xs px-2 py-0.5 rounded-full font-medium">Busy</span>;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            <Stethoscope size={14} />
            {doctors?.length || 0} Doctors Found
          </div>
          <h1 className="text-4xl font-bold mb-3">Find <span className="gradient-text">Expert Doctors</span></h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Browse our network of verified specialists and book your appointment instantly.</p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialty..."
              className="pl-9 glass border-white/10 focus:border-cyan-500/50 bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="sm:w-52 glass border-white/10"><SelectValue /></SelectTrigger>
            <SelectContent>
              {specialties.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="sm:w-44 glass border-white/10"><SelectValue /></SelectTrigger>
            <SelectContent>
              {locations.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Doctor Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="skeleton w-16 h-16 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors?.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} getAvailabilityBadge={getAvailabilityBadge} />
            ))}
          </div>
        )}

        {doctors?.length === 0 && !isLoading && (
          <div className="text-center py-16 text-muted-foreground">
            <User size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No doctors found</p>
            <p className="text-sm">Try adjusting your search filters</p>
            <Button
              variant="outline"
              className="mt-4 border-white/15"
              onClick={() => { setSearch(""); setSpecialty("all"); setLocation("all"); }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorCard({ doctor, getAvailabilityBadge }: { doctor: Doctor; getAvailabilityBadge: (a: string) => JSX.Element }) {
  const specialtyLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="glass-card card-hover rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={doctor.imageUrl}
          alt={doctor.name}
          className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0D8ABC&color=fff&size=200&rounded=true`;
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base leading-tight mb-0.5">{doctor.name}</h3>
          <p className="text-cyan-400 text-sm font-medium">{specialtyLabel(doctor.specialty)}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold">{doctor.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">({doctor.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={13} className="text-teal-400 flex-shrink-0" />
          <span className="truncate">{doctor.hospital}, {doctor.city}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={13} className="text-purple-400 flex-shrink-0" />
          <span>{doctor.experience} yrs exp · {doctor.schedule}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <IndianRupee size={13} className="text-amber-400 flex-shrink-0" />
          <span className="font-semibold text-amber-400">{formatCurrency(doctor.consultationFee)}</span>
          <span className="text-muted-foreground">consultation</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {getAvailabilityBadge(doctor.availability)}
        <Link href={`/doctors/${doctor.id}`}>
          <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 gap-1 text-xs">
            View & Book <ChevronRight size={13} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
