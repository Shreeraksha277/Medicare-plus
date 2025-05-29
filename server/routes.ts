import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientSchema, insertAppointmentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Patient registration
  app.post("/api/patients", async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid patient data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create patient" });
      }
    }
  });

  // Patient login verification
  app.get("/api/patients/:patientId", async (req, res) => {
    try {
      const { patientId } = req.params;
      const patient = await storage.getPatientByPatientId(patientId);
      
      if (!patient) {
        res.status(404).json({ message: "Patient not found" });
        return;
      }
      
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve patient" });
    }
  });

  // Search doctors
  app.get("/api/doctors", async (req, res) => {
    try {
      const { specialty, location } = req.query;
      console.log(`Searching doctors with specialty: "${specialty}", location: "${location}"`);
      const doctors = await storage.searchDoctors(
        specialty as string,
        location as string
      );
      console.log(`Found ${doctors.length} doctors`);
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Failed to search doctors" });
    }
  });

  // Get doctor by ID
  app.get("/api/doctors/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const doctor = await storage.getDoctorById(id);
      
      if (!doctor) {
        res.status(404).json({ message: "Doctor not found" });
        return;
      }
      
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve doctor" });
    }
  });

  // Create appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create appointment" });
      }
    }
  });

  // Get patient appointments
  app.get("/api/appointments/patient/:patientId", async (req, res) => {
    try {
      const { patientId } = req.params;
      const appointments = await storage.getAppointmentsByPatientId(patientId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve appointments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
