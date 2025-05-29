import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/navbar";
import Landing from "@/pages/landing";
import Register from "@/pages/register";
import PatientIdDisplay from "@/pages/patient-id-display";
import Login from "@/pages/login";
import Search from "@/pages/search";
import DoctorList from "@/pages/doctor-list";
import Confirmation from "@/pages/confirmation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/register" component={Register} />
          <Route path="/patient-id/:patientId" component={PatientIdDisplay} />
          <Route path="/login" component={Login} />
          <Route path="/search" component={Search} />
          <Route path="/doctors" component={DoctorList} />
          <Route path="/confirmation/:confirmationNumber" component={Confirmation} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
