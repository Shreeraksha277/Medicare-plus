import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/navbar";
import Landing from "@/pages/landing";
import Register from "@/pages/register";
import PatientIdDisplay from "@/pages/patient-id-display";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Hospitals from "@/pages/hospitals";
import DoctorList from "@/pages/doctor-list";
import DoctorDetail from "@/pages/doctor-detail";
import Confirmation from "@/pages/confirmation";
import Admin from "@/pages/admin";
import SymptomChecker from "@/pages/symptom-checker";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-16">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/register" component={Register} />
          <Route path="/patient-id/:patientId" component={PatientIdDisplay} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/hospitals" component={Hospitals} />
          <Route path="/doctors" component={DoctorList} />
          <Route path="/doctors/:id" component={DoctorDetail} />
          <Route path="/confirmation/:confirmationNumber" component={Confirmation} />
          <Route path="/admin" component={Admin} />
          <Route path="/symptom-checker" component={SymptomChecker} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
