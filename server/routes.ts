import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientSchema, insertAppointmentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Patient registration
  app.post("/api/patients", async (req, res) => {
    try {
      const existing = await storage.getPatientByEmail(req.body.email);
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      const { password: _, ...safePatient } = patient;
      res.json(safePatient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid patient data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create patient" });
      }
    }
  });

  // Patient login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) {
        return res.status(400).json({ message: "Identifier and password required" });
      }
      let patient = await storage.getPatientByEmail(identifier);
      if (!patient) {
        patient = await storage.getPatientByPatientId(identifier);
      }
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      if (patient.password !== password) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      const { password: _, ...safePatient } = patient;
      res.json(safePatient);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get patient by ID
  app.get("/api/patients/:patientId", async (req, res) => {
    try {
      const patient = await storage.getPatientByPatientId(req.params.patientId);
      if (!patient) return res.status(404).json({ message: "Patient not found" });
      const { password: _, ...safePatient } = patient;
      res.json(safePatient);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve patient" });
    }
  });

  // Get all patients (admin)
  app.get("/api/patients", async (_req, res) => {
    try {
      const all = await storage.getAllPatients();
      res.json(all.map(({ password: _, ...p }) => p));
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve patients" });
    }
  });

  // Search doctors
  app.get("/api/doctors", async (req, res) => {
    try {
      const { specialty, location, name } = req.query;
      const doctors = await storage.searchDoctors(
        specialty as string,
        location as string,
        name as string
      );
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Failed to search doctors" });
    }
  });

  // Get doctor by ID
  app.get("/api/doctors/:id", async (req, res) => {
    try {
      const doctor = await storage.getDoctorById(req.params.id);
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve doctor" });
    }
  });

  // Get hospitals
  app.get("/api/hospitals", async (req, res) => {
    try {
      const { city } = req.query;
      const hospitals = await storage.getHospitals(city as string);
      res.json(hospitals);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve hospitals" });
    }
  });

  // Get hospital by ID
  app.get("/api/hospitals/:id", async (req, res) => {
    try {
      const hospital = await storage.getHospitalById(req.params.id);
      if (!hospital) return res.status(404).json({ message: "Hospital not found" });
      res.json(hospital);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve hospital" });
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
      const appointments = await storage.getAppointmentsByPatientId(req.params.patientId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve appointments" });
    }
  });

  // Get all appointments (admin)
  app.get("/api/appointments", async (_req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve appointments" });
    }
  });

  // Update appointment status
  app.patch("/api/appointments/:confirmationNumber/status", async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateAppointmentStatus(req.params.confirmationNumber, status);
      res.json({ message: "Status updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  // Admin stats
  app.get("/api/admin/stats", async (_req, res) => {
    try {
      const [patients, appointments, doctors, hospitals] = await Promise.all([
        storage.getAllPatients(),
        storage.getAllAppointments(),
        storage.getAllDoctors(),
        storage.getHospitals(),
      ]);
      res.json({
        totalPatients: patients.length,
        totalAppointments: appointments.length,
        totalDoctors: doctors.length,
        totalHospitals: hospitals.length,
        upcomingAppointments: appointments.filter((a) => a.status === "upcoming").length,
        completedAppointments: appointments.filter((a) => a.status === "completed").length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
