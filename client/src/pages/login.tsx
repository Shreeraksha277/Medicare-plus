import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { validatePatientId } from "@/lib/utils";
import { LogIn, IdCard } from "lucide-react";

const loginSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required").refine(validatePatientId, {
    message: "Please enter a valid Patient ID (format: MC-YYYY-XXXXXX)",
  }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      patientId: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("GET", `/api/patients/${data.patientId}`);
      return response.json();
    },
    onSuccess: () => {
      sessionStorage.setItem("currentPatientId", form.getValues().patientId);
      toast({
        title: "Login Successful",
        description: "Welcome back to MediCare Connect.",
      });
      setLocation("/search");
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message === "404: Patient not found" 
          ? "Patient ID not found. Please check your ID or register as a new patient."
          : "Login failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen py-8 bg-white">
      <div className="max-w-md mx-auto px-4">
        <Card className="shadow-lg fade-in">
          <CardHeader className="text-center pb-8">
            <LogIn className="text-medical-blue w-12 h-12 mb-4 mx-auto" />
            <CardTitle className="text-3xl font-bold text-medical-gray mb-2">Patient Login</CardTitle>
            <p className="text-gray-600">Enter your Patient ID to continue</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <IdCard className="mr-1 w-4 h-4" />
                        Patient ID
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="MC-2024-XXXXXX" 
                          className="text-center tracking-wider font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-medical-blue text-white hover:bg-deep-blue" 
                  size="lg"
                  disabled={loginMutation.isPending}
                >
                  <LogIn className="mr-2 w-4 h-4" />
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                New patient?{" "}
                <Button variant="link" onClick={() => setLocation("/register")} className="text-medical-blue hover:underline font-medium p-0">
                  Register here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
