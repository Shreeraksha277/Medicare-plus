import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      <div className="text-center fade-in">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} className="text-red-400" />
        </div>
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 btn-glow gap-2">
              <Home size={18} />Go Home
            </Button>
          </Link>
          <Button variant="outline" className="border-white/15 gap-2" onClick={() => history.back()}>
            <ArrowLeft size={18} />Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
