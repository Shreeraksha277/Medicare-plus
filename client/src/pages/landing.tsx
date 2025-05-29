import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, UserCheck, Calendar, Shield } from "lucide-react";

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
                <Stethoscope className="text-medical-blue" size={120} />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">MediCare Plus</h1>
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
          <h2 className="text-3xl font-bold mb-4 text-black">Why Choose MediCare Plus?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Professional healthcare services with modern convenience and trusted medical expertise.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6 shadow-lg card-hover">
            <CardContent className="pt-6">
              <UserCheck className="text-health-green w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-black">Verified Doctors</h3>
              <p className="text-gray-700">All our medical professionals are verified and certified specialists.</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 shadow-lg card-hover">
            <CardContent className="pt-6">
              <Calendar className="text-medical-blue w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-black">Easy Scheduling</h3>
              <p className="text-gray-700">Book appointments instantly with real-time availability updates.</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 shadow-lg card-hover">
            <CardContent className="pt-6">
              <Shield className="text-health-green w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-black">Secure & Private</h3>
              <p className="text-gray-700">Your medical information is protected with enterprise-grade security.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
