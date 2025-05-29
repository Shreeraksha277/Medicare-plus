import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";
import { type Appointment } from "@shared/schema";
import { CheckCircle, Download, Search } from "@mui/icons-material";

interface ConfirmationProps {
  params: {
    confirmationNumber: string;
  };
}

export default function Confirmation({ params }: ConfirmationProps) {
  const [, setLocation] = useLocation();
  const { confirmationNumber } = params;

  const { data: appointment, isLoading } = useQuery({
    queryKey: ["/api/appointments", confirmationNumber],
    queryFn: async () => {
      // For now, we'll get the appointment data from local storage or create mock data
      // In a real app, you'd fetch this from the API
      const mockAppointment: Appointment = {
        id: 1,
        confirmationNumber,
        patientId: sessionStorage.getItem("currentPatientId") || "MC-2024-001234",
        doctorName: "Dr. Sarah Chen",
        specialty: "Cardiology",
        hospital: "City General Hospital",
        appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointmentTime: "2:30 PM",
        consultationFee: 150,
        createdAt: new Date(),
      };
      return mockAppointment;
    },
  });

  const downloadReceipt = () => {
    alert("Receipt download started! (This is a simulation)");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center">Loading appointment details...</div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-lg">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600">Appointment not found.</p>
              <Button 
                onClick={() => setLocation("/search")} 
                className="mt-4 bg-medical-blue text-white hover:bg-deep-blue"
              >
                Back to Search
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg fade-in">
          <CardContent className="pt-8">
            <div className="text-center mb-8">
              <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="text-health-green text-3xl" />
              </div>
              <h2 className="text-3xl font-bold text-medical-gray mb-2">Appointment Confirmed!</h2>
              <p className="text-gray-600">Your appointment has been successfully booked</p>
            </div>

            {/* Appointment Receipt */}
            <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-medical-gray">Appointment Receipt</h3>
                  <p className="text-sm text-gray-600">
                    Confirmation #: <span className="font-mono">{appointment.confirmationNumber}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Booking Date</p>
                  <p className="font-semibold">{formatDate(appointment.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient ID:</span>
                  <span className="font-semibold font-mono">{appointment.patientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-semibold">{appointment.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialty:</span>
                  <span className="font-semibold">{appointment.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hospital/Clinic:</span>
                  <span className="font-semibold">{appointment.hospital}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Appointment Date:</span>
                  <span className="font-semibold">{formatDate(appointment.appointmentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold">{appointment.appointmentTime}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Consultation Fee:</span>
                  <span className="font-bold text-medical-blue">{formatCurrency(appointment.consultationFee)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <Button 
                onClick={downloadReceipt}
                className="w-full bg-health-green text-white hover:bg-green-600" 
                size="lg"
              >
                <Download className="mr-2" />
                Download Receipt
              </Button>
              <Button 
                onClick={() => setLocation("/search")}
                variant="outline"
                className="w-full border-2 border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white" 
                size="lg"
              >
                Book Another Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
