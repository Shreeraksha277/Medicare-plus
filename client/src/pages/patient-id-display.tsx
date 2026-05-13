import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, LogIn, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatientIdDisplayProps {
  params: { patientId: string };
}

export default function PatientIdDisplay({ params }: PatientIdDisplayProps) {
  const { toast } = useToast();
  const { patientId } = params;

  const copyId = () => {
    navigator.clipboard.writeText(patientId);
    toast({ title: "Copied!", description: "Patient ID copied to clipboard." });
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center fade-in">
        <div className="glass-card rounded-3xl p-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center mx-auto mb-6 glow-cyan">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Registration Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Your MediCare Plus account has been created. Save your Patient ID below.
          </p>
          <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-2xl p-6 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Your Unique Patient ID</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-bold font-mono tracking-widest text-cyan-400">{patientId}</span>
              <button onClick={copyId} className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-cyan-400 transition-colors">
                <Copy size={20} />
              </button>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-300 mb-8 text-left">
            <strong>Important:</strong> Save this Patient ID. Use it along with your password to log into your account.
          </div>
          <div className="flex items-center gap-4 text-left mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center flex-shrink-0">
              <Stethoscope size={24} className="text-white" />
            </div>
            <div>
              <div className="font-semibold">Next Steps</div>
              <div className="text-sm text-muted-foreground">Login to book your first appointment and explore our doctors.</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 btn-glow font-semibold gap-2">
                <LogIn size={18} />Go to Login
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full border-white/15">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
