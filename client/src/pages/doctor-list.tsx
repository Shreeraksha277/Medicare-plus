import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { type Doctor, type InsertAppointment } from "@shared/schema";
import { ArrowLeft, User, MapPin, Clock, DollarSign } from "lucide-react";

export default function DoctorList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<URLSearchParams>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams(params);
  }, []);

  const specialty = searchParams?.get("specialty") || "";
  const location = searchParams?.get("location") || "";

  const { data: doctors, isLoading } = useQuery({
    queryKey: ["/api/doctors", specialty, location],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (specialty) params.set("specialty", specialty);
      if (location) params.set("location", location);
      
      const response = await fetch(`/api/doctors?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch doctors");
      return response.json() as Promise<Doctor[]>;
    },
    enabled: !!specialty && !!location,
  });

  const bookAppointmentMutation = useMutation({
    mutationFn: async (doctor: Doctor) => {
      // Get current patient ID from session storage (set during login)
      const currentPatientId = sessionStorage.getItem("currentPatientId");
      if (!currentPatientId) {
        throw new Error("Please log in first");
      }

      const appointmentData: InsertAppointment = {
        patientId: currentPatientId,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        hospital: doctor.hospital,
        appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        appointmentTime: "2:30 PM",
        consultationFee: doctor.consultationFee,
      };

      const response = await apiRequest("POST", "/api/appointments", appointmentData);
      return response.json();
    },
    onSuccess: (appointment) => {
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully scheduled.",
      });
      setLocation(`/confirmation/${appointment.confirmationNumber}`);
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getSpecialtyLabel = (value: string) => {
    const specialties: Record<string, string> = {
      cardiology: "Cardiology",
      dermatology: "Dermatology",
      neurology: "Neurology",
      orthopedics: "Orthopedics",
      pediatrics: "Pediatrics",
      psychiatry: "Psychiatry",
      general: "General Medicine",
    };
    return specialties[value] || value;
  };

  const getLocationLabel = (value: string) => {
    const locations: Record<string, string> = {
      downtown: "Downtown Medical District",
      north: "North Central",
      south: "South Bay",
      east: "East Valley",
      west: "West Hills",
    };
    return locations[value] || value;
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return <Badge className="bg-green-100 text-health-green">Available Today</Badge>;
      case "next-day":
        return <Badge className="bg-yellow-100 text-yellow-700">Next Available: Tomorrow</Badge>;
      default:
        return <Badge variant="secondary">Busy</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">Loading doctors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/search")}
            className="flex items-center text-medical-blue hover:text-deep-blue"
          >
            <ArrowLeft className="mr-1 w-4 h-4" />
            Back to Search
          </Button>
        </div>

        <Card className="shadow-lg mb-6">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-medical-gray mb-2">Available Doctors</h2>
            <p className="text-gray-600">
              Showing results for <span className="font-semibold">{getSpecialtyLabel(specialty)}</span> in{" "}
              <span className="font-semibold">{getLocationLabel(location)}</span>
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {doctors?.map((doctor) => (
            <Card key={doctor.id} className="shadow-lg card-hover">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-start space-x-4 mb-4 md:mb-0">
                    <div className="bg-medical-blue bg-opacity-10 rounded-full p-3">
                      <User className="text-medical-blue w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-medical-gray">{doctor.name}</h3>
                      <p className="text-medical-blue font-medium">{getSpecialtyLabel(doctor.specialty)}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {doctor.hospital}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {doctor.schedule}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Consultation: {formatCurrency(doctor.consultationFee)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-3">
                      {getAvailabilityBadge(doctor.availability)}
                    </div>
                    <Button 
                      onClick={() => bookAppointmentMutation.mutate(doctor)}
                      disabled={bookAppointmentMutation.isPending}
                      className="bg-medical-blue text-white hover:bg-deep-blue"
                    >
                      {bookAppointmentMutation.isPending ? "Booking..." : "Book Appointment"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {doctors?.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600">No doctors found for the selected criteria. Please try a different search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
