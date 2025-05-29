import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search as SearchIcon, MedicalServices, LocationOn } from "@mui/icons-material";

const searchSchema = z.object({
  specialty: z.string().min(1, "Please select a specialty"),
  location: z.string().min(1, "Please select a location"),
});

type SearchForm = z.infer<typeof searchSchema>;

export default function Search() {
  const [, setLocation] = useLocation();

  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      specialty: "",
      location: "",
    },
  });

  const onSubmit = (data: SearchForm) => {
    const searchParams = new URLSearchParams(data);
    setLocation(`/doctors?${searchParams.toString()}`);
  };

  const specialties = [
    { value: "cardiology", label: "Cardiology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "neurology", label: "Neurology" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "psychiatry", label: "Psychiatry" },
    { value: "general", label: "General Medicine" },
  ];

  const locations = [
    { value: "downtown", label: "Downtown Medical District" },
    { value: "north", label: "North Central" },
    { value: "south", label: "South Bay" },
    { value: "east", label: "East Valley" },
    { value: "west", label: "West Hills" },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-lg fade-in">
          <CardHeader className="text-center pb-8">
            <SearchIcon className="text-medical-blue text-5xl mb-4 mx-auto" />
            <CardTitle className="text-3xl font-bold text-medical-gray mb-2">Find a Specialist</CardTitle>
            <p className="text-gray-600">Search for doctors by specialty and location</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <MedicalServices className="mr-1 text-sm" />
                          Specialty
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Specialty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {specialties.map((specialty) => (
                              <SelectItem key={specialty.value} value={specialty.value}>
                                {specialty.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <LocationOn className="mr-1 text-sm" />
                          Area/Location
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location.value} value={location.value}>
                                {location.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-medical-blue text-white hover:bg-deep-blue" 
                  size="lg"
                >
                  <SearchIcon className="mr-2" />
                  Search Doctors
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
