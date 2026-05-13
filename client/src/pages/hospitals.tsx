import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Hospital } from "@shared/schema";
import { Search, Star, MapPin, Phone, Users, Bed, Shield, ChevronRight, Building2 } from "lucide-react";

export default function Hospitals() {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");

  const { data: hospitals, isLoading } = useQuery<Hospital[]>({
    queryKey: ["/api/hospitals"],
    queryFn: async () => {
      const r = await fetch("/api/hospitals");
      return r.json();
    },
  });

  const filtered = hospitals?.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()) ||
      h.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchCity = cityFilter === "all" || h.location === cityFilter;
    return matchSearch && matchCity;
  });

  const cities = [
    { value: "all", label: "All Cities" },
    { value: "bangalore", label: "Bangalore" },
    { value: "mysuru", label: "Mysuru" },
    { value: "udupi", label: "Udupi" },
    { value: "shivamogga", label: "Shivamogga" },
    { value: "ballari", label: "Ballari" },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
            <Building2 size={14} />
            {hospitals?.length || 0} Hospitals Available
          </div>
          <h1 className="text-4xl font-bold mb-3">Find <span className="gradient-text">Hospitals Near You</span></h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Browse our network of NABH-accredited hospitals with world-class facilities and expert medical teams.</p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search hospitals, specialties..."
              className="pl-9 glass border-white/10 focus:border-cyan-500/50 bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="sm:w-48 glass border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Hospital Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <div className="skeleton h-40" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered?.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        )}

        {filtered?.length === 0 && !isLoading && (
          <div className="text-center py-16 text-muted-foreground">
            <Building2 size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No hospitals found</p>
            <p className="text-sm">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function HospitalCard({ hospital }: { hospital: Hospital }) {
  return (
    <div className="glass-card card-hover rounded-2xl overflow-hidden">
      {/* Color Banner */}
      <div className={`h-36 bg-gradient-to-br ${hospital.imageColor} relative flex items-end p-4`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative flex items-center gap-2">
          {hospital.emergency && (
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
              24/7 Emergency
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">
            Est. {hospital.established}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-white text-xs font-bold">{hospital.rating}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-1 leading-tight">{hospital.name}</h3>
        <div className="text-xs text-cyan-400 font-medium mb-3">{hospital.accreditation}</div>

        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
          <MapPin size={13} className="text-cyan-400 flex-shrink-0" />
          <span className="truncate">{hospital.address}</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 rounded-xl bg-white/4">
            <div className="flex items-center justify-center gap-1 text-teal-400 mb-0.5">
              <Users size={14} />
            </div>
            <div className="text-xs font-bold">{hospital.availableDoctors}</div>
            <div className="text-xs text-muted-foreground">Doctors</div>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/4">
            <div className="flex items-center justify-center gap-1 text-purple-400 mb-0.5">
              <Bed size={14} />
            </div>
            <div className="text-xs font-bold">{hospital.totalBeds}</div>
            <div className="text-xs text-muted-foreground">Beds</div>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/4">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
              <Star size={14} />
            </div>
            <div className="text-xs font-bold">{hospital.reviewCount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Reviews</div>
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hospital.specialties.slice(0, 3).map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{s}</span>
          ))}
          {hospital.specialties.length > 3 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-muted-foreground">
              +{hospital.specialties.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-1">
            <Phone size={12} className="text-teal-400" />
            {hospital.phone}
          </div>
          <Link href={`/doctors?hospitalId=${hospital.id}`}>
            <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 text-xs gap-1">
              View Doctors <ChevronRight size={13} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
