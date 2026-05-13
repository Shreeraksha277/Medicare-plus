import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { LogIn, Mail, Lock, Stethoscope, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Patient ID is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "", rememberMe: false },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/auth/login", {
        identifier: data.identifier,
        password: data.password,
      });
      return response.json();
    },
    onSuccess: (patient) => {
      sessionStorage.setItem("currentPatientId", patient.patientId);
      sessionStorage.setItem("currentPatient", JSON.stringify(patient));
      toast({
        title: "Welcome back!",
        description: `Logged in as ${patient.fullName}`,
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      const msg = error.message;
      toast({
        title: "Login Failed",
        description: msg.includes("404")
          ? "Patient not found. Please check your credentials or register."
          : msg.includes("401")
          ? "Incorrect password. Please try again."
          : "Login failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => loginMutation.mutate(data);

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center mx-auto mb-4 glow-cyan">
            <Stethoscope size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your MediCare Plus account</p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8 fade-in">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm">
                      <Mail size={14} />
                      Email or Patient ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com or MC-2026-XXXXXX"
                        className="glass border-white/10 focus:border-cyan-500/50 h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm">
                      <Lock size={14} />
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="glass border-white/10 focus:border-cyan-500/50 h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-white/20 bg-transparent"
                    {...form.register("rememberMe")}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  onClick={() =>
                    toast({ title: "Reset Link Sent", description: "Check your email for password reset instructions." })
                  }
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-11 bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 btn-glow font-semibold gap-2 mt-2"
              >
                {loginMutation.isPending ? (
                  "Signing in..."
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-6 border-t border-white/8 text-center">
            <p className="text-muted-foreground text-sm mb-4">
              Don't have an account?{" "}
              <button
                onClick={() => setLocation("/register")}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Create account
              </button>
            </p>

            {/* Admin shortcut */}
            <button
              onClick={() => setLocation("/admin")}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight size={12} />
              Admin Dashboard
            </button>
          </div>
        </div>

        {/* Demo note */}
        <div className="mt-4 p-4 rounded-xl glass text-sm text-muted-foreground text-center">
          <span className="text-amber-400 font-medium">Demo:</span> Register first, then login with your email &amp; password.
        </div>
      </div>
    </div>
  );
}
