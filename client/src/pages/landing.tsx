import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MedicalServices, VerifiedUser, Schedule, Security } from "@mui/icons-material";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-medical-blue to-deep-blue text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="fade-in">
            {/* Medical logo display */}
            <div className="flex justify-center items-center mb-8">
              <div className="bg-white rounded-full p-8 shadow-2xl">
                <MedicalServices className="text-medical-blue" style={{ fontSize: '120px' }} />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">MediCare Connect</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Your trusted partner in healthcare. Connect with qualified specialists and book appointments with ease.
            </p>
            <div className="space-x-4">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="bg-white text-medical-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-medical-blue"
                >
                  Patient Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-medical-gray mb-4">Why Choose MediCare Connect?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Professional healthcare services with modern convenience and trusted medical expertise.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6 shadow-lg card-hover">
            <CardContent className="pt-6">
              <VerifiedUser className="text-health-green text-5xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Verified Doctors</h3>
              <p className="text-gray-600">All our medical professionals are verified and certified specialists.</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 shadow-lg card-hover">
            <CardContent className="pt-6">
              <Schedule className="text-medical-blue text-5xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">Book appointments instantly with real-time availability updates.</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 shadow-lg card-hover">
            <CardContent className="pt-6">
              <Security className="text-health-green text-5xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your medical information is protected with enterprise-grade security.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
