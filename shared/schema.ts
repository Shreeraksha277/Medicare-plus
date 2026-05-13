import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  gender: text("gender").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  bloodGroup: text("blood_group").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  height: integer("height").notNull(),
  weight: real("weight").notNull(),
  existingDiseases: text("existing_diseases"),
  allergies: text("allergies"),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  confirmationNumber: text("confirmation_number").notNull().unique(),
  patientId: text("patient_id").notNull(),
  doctorId: text("doctor_id").notNull(),
  doctorName: text("doctor_name").notNull(),
  specialty: text("specialty").notNull(),
  hospital: text("hospital").notNull(),
  appointmentDate: text("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  consultationFee: integer("consultation_fee").notNull(),
  problemDescription: text("problem_description"),
  status: text("status").notNull().default("upcoming"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  patientId: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  confirmationNumber: true,
  createdAt: true,
});

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  hospitalId: string;
  location: string;
  city: string;
  schedule: string;
  consultationFee: number;
  availability: "available" | "next-day" | "busy";
  rating: number;
  reviewCount: number;
  experience: number;
  qualifications: string;
  about: string;
  imageUrl: string;
  availableSlots: TimeSlot[];
  languages: string[];
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string;
  rating: number;
  reviewCount: number;
  availableDoctors: number;
  totalBeds: number;
  specialties: string[];
  emergency: boolean;
  phone: string;
  imageColor: string;
  established: number;
  accreditation: string;
}
