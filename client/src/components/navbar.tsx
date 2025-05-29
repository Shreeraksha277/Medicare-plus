import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Hospital } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-md border-b-2 border-medical-blue fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Hospital className="text-medical-blue text-3xl mr-2" />
            <span className="text-xl font-bold text-medical-gray">MediCare Connect</span>
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link href="/">
              <Button 
                variant="ghost" 
                className={`text-medical-gray hover:text-medical-blue ${location === '/' ? 'text-medical-blue' : ''}`}
              >
                Home
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                variant="ghost" 
                className={`text-medical-gray hover:text-medical-blue ${location === '/login' ? 'text-medical-blue' : ''}`}
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button 
                className="bg-medical-blue text-white hover:bg-deep-blue"
              >
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
