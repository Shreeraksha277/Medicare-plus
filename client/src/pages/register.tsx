import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  UserPlus, User, Calendar, Droplet, Phone, Weight, Ruler,
  Mail, MapPin, Lock, ChevronRight, Stethoscope
} from "lucide-react";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  gender: z.string().min(1, "Please select gender"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  bloodGroup: z.string().min(1, "Please select blood group"),
  email: z.string().email("Please enter a valid email"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  height: z.coerce.number().min(50, "Height must be at least 50 cm").max(300, "Height must be realistic"),
  weight: z.coerce.number().min(1, "Weight must be at least 1 kg").max(500, "Weight must be realistic"),
  existingDiseases: z.string().optional(),
  allergies: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      gender: "",
      dateOfBirth: "",
      bloodGroup: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      height: 0,
      weight: 0,
      existingDiseases: "",
      allergies: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const { confirmPassword: _, ...payload } = data;
      const response = await apiRequest("POST", "/api/patients", payload);
      return response.json();
    },
    onSuccess: (patient) => {
      toast({
        title: "Registration Successful!",
        description: `Welcome to MediCare Plus! Your Patient ID: ${patient.patientId}`,
      });
      setLocation(`/patient-id/${patient.patientId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message.includes("409") ? "Email already registered. Please login." : error.message,
        variant: "destructive",
      });
    },
  });

  const nextStep = async () => {
    let fields: (keyof RegisterForm)[] = [];
    if (step === 1) fields = ["fullName", "gender", "dateOfBirth", "bloodGroup", "email", "phoneNumber"];
    if (step === 2) fields = ["address", "city", "state", "height", "weight"];
    const valid = await form.trigger(fields);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  const steps = ["Personal Info", "Health Details", "Account Setup"];

  return (
    <div className="min-h-screen hero-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center mx-auto mb-4">
            <Stethoscope size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Join MediCare Plus for seamless healthcare access</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i + 1 < step ? "bg-teal-500 text-white" : i + 1 === step ? "bg-cyan-500 text-white" : "bg-white/10 text-muted-foreground"
              }`}>
                {i + 1 < step ? "✓" : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${i + 1 === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i + 1 < step ? "bg-teal-500" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8 fade-in">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold mb-4 text-cyan-400">Personal Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-sm"><User size={14} />Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" className="glass border-white/10 focus:border-cyan-500/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="glass border-white/10"><SelectValue placeholder="Select Gender" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not">Prefer Not to Say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-sm"><Calendar size={14} />Date of Birth</FormLabel>
                        <FormControl><Input type="date" className="glass border-white/10 focus:border-cyan-500/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="bloodGroup" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-sm"><Droplet size={14} />Blood Group</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="glass border-white/10"><SelectValue placeholder="Select Blood Group" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-sm"><Mail size={14} />Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="john@example.com" className="glass border-white/10 focus:border-cyan-500/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-sm"><Phone size={14} />Phone Number</FormLabel>
                        <FormControl><Input type="tel" placeholder="+91 98765 43210" className="glass border-white/10 focus:border-cyan-500/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              )}

              {/* Step 2: Health Details */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold mb-4 text-cyan-400">Health & Address Details</h2>
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-sm"><MapPin size={14} />Street Address</FormLabel>
                      <FormControl><Input placeholder="123 MG Road, Koramangala" className="glass border-white/10 focus:border-cyan-500/50" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">City</FormLabel>
                        <FormControl><Input placeholder="Bangalore" className="glass border-white/10 focus:border-cyan-500/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="state" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">State</FormLabel>
                        <FormControl><Input placeholder="Karnataka" className="glass border-white/10 focus:border-cyan-500/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="height" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-sm"><Ruler size={14} />Height (cm)</FormLabel>
                        <FormControl><Input type="number" placeholder="175" className="glass border-white/10 focus:border-cyan-500/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="weight" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-sm"><Weight size={14} />Weight (kg)</FormLabel>
                        <FormControl><Input type="number" step="0.1" placeholder="70.5" className="glass border-white/10 focus:border-cyan-500/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="existingDiseases" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Existing Diseases / Conditions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Diabetes Type 2, Hypertension..."
                          className="glass border-white/10 focus:border-cyan-500/50 resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="allergies" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Allergies (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Penicillin, Peanuts, Shellfish..."
                          className="glass border-white/10 focus:border-cyan-500/50 resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              {/* Step 3: Account Setup */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold mb-4 text-cyan-400">Account Security</h2>
                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-300 mb-2">
                    A unique Patient ID (e.g., MC-2026-XXXXXX) will be automatically generated for you after registration.
                  </div>
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-sm"><Lock size={14} />Password</FormLabel>
                      <FormControl><Input type="password" placeholder="Create a strong password" className="glass border-white/10 focus:border-cyan-500/50" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-sm"><Lock size={14} />Confirm Password</FormLabel>
                      <FormControl><Input type="password" placeholder="Re-enter your password" className="glass border-white/10 focus:border-cyan-500/50" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="text-xs text-muted-foreground">
                    By registering, you agree to our Terms of Service and Privacy Policy.
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-1 border-white/15">
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 btn-glow font-semibold gap-2"
                  >
                    Next Step
                    <ChevronRight size={18} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 btn-glow font-semibold gap-2"
                  >
                    <UserPlus size={18} />
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{" "}
            <button onClick={() => setLocation("/login")} className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
