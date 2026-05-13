import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Stethoscope, AlertTriangle, ChevronRight, RotateCcw, Sparkles } from "lucide-react";

interface SymptomResult {
  possibleConditions: string[];
  recommendedSpecialty: string;
  urgency: "low" | "moderate" | "high";
  advice: string;
}

const symptomDatabase: Record<string, SymptomResult> = {
  chest: {
    possibleConditions: ["Angina", "Myocardial Infarction", "GERD", "Costochondritis"],
    recommendedSpecialty: "cardiology",
    urgency: "high",
    advice: "Chest pain can be a sign of a serious cardiac condition. Seek immediate medical attention.",
  },
  heart: {
    possibleConditions: ["Arrhythmia", "Palpitations", "Heart Disease"],
    recommendedSpecialty: "cardiology",
    urgency: "high",
    advice: "Heart-related symptoms require urgent evaluation by a cardiologist.",
  },
  headache: {
    possibleConditions: ["Migraine", "Tension Headache", "Cluster Headache", "Sinusitis"],
    recommendedSpecialty: "neurology",
    urgency: "moderate",
    advice: "Persistent or severe headaches should be evaluated by a neurologist.",
  },
  seizure: {
    possibleConditions: ["Epilepsy", "Febrile Seizure", "TIA"],
    recommendedSpecialty: "neurology",
    urgency: "high",
    advice: "Seizures require immediate neurological assessment.",
  },
  joint: {
    possibleConditions: ["Arthritis", "Gout", "Bursitis", "Ligament Injury"],
    recommendedSpecialty: "orthopedics",
    urgency: "moderate",
    advice: "Joint pain may indicate musculoskeletal conditions. An orthopedic consultation is recommended.",
  },
  knee: {
    possibleConditions: ["Knee Osteoarthritis", "Meniscal Tear", "Patellofemoral Syndrome"],
    recommendedSpecialty: "orthopedics",
    urgency: "moderate",
    advice: "Knee problems benefit from orthopedic evaluation and possible imaging.",
  },
  skin: {
    possibleConditions: ["Eczema", "Psoriasis", "Dermatitis", "Fungal Infection"],
    recommendedSpecialty: "dermatology",
    urgency: "low",
    advice: "Skin conditions can usually be managed effectively with proper dermatological care.",
  },
  rash: {
    possibleConditions: ["Allergic Reaction", "Eczema", "Hives", "Contact Dermatitis"],
    recommendedSpecialty: "dermatology",
    urgency: "moderate",
    advice: "If the rash is spreading rapidly or accompanied by breathing difficulty, seek emergency care.",
  },
  fever: {
    possibleConditions: ["Viral Infection", "Bacterial Infection", "Dengue", "Typhoid"],
    recommendedSpecialty: "general",
    urgency: "moderate",
    advice: "Persistent fever above 103°F (39.4°C) requires medical evaluation.",
  },
  child: {
    possibleConditions: ["Common Cold", "Otitis Media", "Hand-Foot-Mouth Disease"],
    recommendedSpecialty: "pediatrics",
    urgency: "low",
    advice: "Children's health issues are best addressed by a qualified pediatrician.",
  },
  mental: {
    possibleConditions: ["Depression", "Anxiety Disorder", "Bipolar Disorder"],
    recommendedSpecialty: "psychiatry",
    urgency: "moderate",
    advice: "Mental health conditions are treatable. A psychiatrist can provide the right support and therapy.",
  },
  anxiety: {
    possibleConditions: ["Generalized Anxiety Disorder", "Panic Disorder", "Social Anxiety"],
    recommendedSpecialty: "psychiatry",
    urgency: "low",
    advice: "Anxiety disorders respond well to therapy and medication. Consult a psychiatrist.",
  },
};

const commonSymptoms = [
  "Chest pain", "Headache", "Joint pain", "Skin rash",
  "Fever", "Knee pain", "Anxiety", "Heart palpitations",
];

const urgencyConfig = {
  high: { label: "High Urgency", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", icon: AlertTriangle },
  moderate: { label: "Moderate", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", icon: AlertTriangle },
  low: { label: "Low Urgency", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/30", icon: Stethoscope },
};

const specialtyMap: Record<string, string> = {
  cardiology: "Cardiology",
  neurology: "Neurology",
  orthopedics: "Orthopedics",
  dermatology: "Dermatology",
  pediatrics: "Pediatrics",
  psychiatry: "Psychiatry",
  general: "General Medicine",
};

export default function SymptomChecker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeSymptoms = () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const lower = input.toLowerCase();
      let matched: SymptomResult | null = null;

      for (const [keyword, data] of Object.entries(symptomDatabase)) {
        if (lower.includes(keyword)) {
          matched = data;
          break;
        }
      }

      if (!matched) {
        matched = {
          possibleConditions: ["General Health Concern", "Possible Infection", "Stress-Related Condition"],
          recommendedSpecialty: "general",
          urgency: "low",
          advice: "Your symptoms could be related to various conditions. A general physician can evaluate and refer you to the appropriate specialist.",
        };
      }

      setResult(matched);
      setLoading(false);
    }, 1800);
  };

  const reset = () => { setInput(""); setResult(null); };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
            <Brain size={32} className="text-white" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            <Sparkles size={14} />AI-Powered Symptom Analysis
          </div>
          <h1 className="text-4xl font-bold mb-3">AI <span className="gradient-text-warm">Symptom Checker</span></h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Describe your symptoms and our AI will suggest possible conditions and the right specialist to consult.
          </p>
          <div className="mt-3 text-xs text-amber-400 flex items-center justify-center gap-1">
            <AlertTriangle size={12} />
            For informational purposes only. Always consult a qualified doctor.
          </div>
        </div>

        {/* Common Symptoms Quick Select */}
        <div className="glass-card rounded-2xl p-5 mb-5">
          <p className="text-sm text-muted-foreground mb-3">Quick select common symptoms:</p>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s.toLowerCase())}
                className="px-3 py-1.5 rounded-full text-xs border border-white/10 bg-white/4 text-muted-foreground hover:border-purple-500/30 hover:text-purple-400 hover:bg-purple-500/8 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="glass-card rounded-2xl p-6 mb-5">
          <label className="text-sm font-medium mb-3 block flex items-center gap-2">
            <Stethoscope size={15} className="text-cyan-400" />
            Describe your symptoms
          </label>
          <Textarea
            placeholder="e.g., I have been experiencing chest pain and shortness of breath for the past 2 days..."
            className="glass border-white/10 focus:border-purple-500/50 resize-none mb-4"
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex gap-3">
            <Button
              onClick={analyzeSymptoms}
              disabled={!input.trim() || loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 font-semibold gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <><Brain size={18} />Analyze Symptoms</>
              )}
            </Button>
            {result && (
              <Button variant="outline" className="border-white/15 gap-2" onClick={reset}>
                <RotateCcw size={16} />Reset
              </Button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="glass-card rounded-2xl p-8 text-center fade-in">
            <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Our AI is analyzing your symptoms...</p>
            <div className="flex justify-center gap-2 mt-4">
              {["Checking database", "Matching symptoms", "Generating report"].map((s, i) => (
                <span key={s} className="text-xs text-muted-foreground px-2 py-1 rounded-full glass">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="space-y-4 fade-in">
            {/* Urgency Banner */}
            <div className={`rounded-2xl p-4 border ${urgencyConfig[result.urgency].bg} flex items-start gap-3`}>
              <AlertTriangle size={20} className={urgencyConfig[result.urgency].color} />
              <div>
                <div className={`font-bold ${urgencyConfig[result.urgency].color} mb-1`}>
                  {urgencyConfig[result.urgency].label}
                </div>
                <p className="text-sm text-muted-foreground">{result.advice}</p>
              </div>
            </div>

            {/* Possible Conditions */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Brain size={18} className="text-purple-400" />Possible Conditions
              </h3>
              <div className="space-y-2">
                {result.possibleConditions.map((c, i) => (
                  <div key={c} className="flex items-center gap-3 p-3 rounded-xl bg-white/4">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Specialist */}
            <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-cyan-500/8 to-teal-500/5 border border-cyan-500/15">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Stethoscope size={18} className="text-cyan-400" />Recommended Specialist
              </h3>
              <p className="text-2xl font-bold gradient-text mb-4">{specialtyMap[result.recommendedSpecialty]}</p>
              <Link href={`/doctors?specialty=${result.recommendedSpecialty}`}>
                <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 btn-glow font-semibold gap-2">
                  Find {specialtyMap[result.recommendedSpecialty]} Doctors
                  <ChevronRight size={16} />
                </Button>
              </Link>
            </div>

            <div className="text-center text-xs text-muted-foreground p-4 glass rounded-xl">
              ⚠️ This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult a licensed healthcare provider for proper diagnosis and treatment.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
