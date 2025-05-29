import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Search } from "lucide-react";

interface PatientIdDisplayProps {
  params: {
    patientId: string;
  };
}

export default function PatientIdDisplay({ params }: PatientIdDisplayProps) {
  const [, setLocation] = useLocation();
  const { patientId } = params;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-lg mx-auto px-4">
        <Card className="shadow-lg text-center fade-in">
          <CardContent className="pt-8">
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="text-health-green w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-medical-gray mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your unique Patient ID has been generated. Please save this ID for future visits.
            </p>
            
            <div className="bg-medical-blue bg-opacity-10 border border-medical-blue rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Your Patient ID</p>
              <p className="text-2xl font-bold text-medical-blue tracking-wider font-mono">
                {patientId}
              </p>
            </div>
            
            <Button 
              onClick={() => setLocation("/search")} 
              className="w-full bg-medical-blue text-white hover:bg-deep-blue" 
              size="lg"
            >
              <Search className="mr-2 w-4 h-4" />
              Find a Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
