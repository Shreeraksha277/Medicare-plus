import { patients, appointments, type Patient, type InsertPatient, type Appointment, type InsertAppointment, type Doctor } from "@shared/schema";

export interface IStorage {
  // Patient operations
  createPatient(patient: InsertPatient): Promise<Patient>;
  getPatientByPatientId(patientId: string): Promise<Patient | undefined>;
  
  // Appointment operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByPatientId(patientId: string): Promise<Appointment[]>;
  
  // Doctor operations
  searchDoctors(specialty?: string, location?: string): Promise<Doctor[]>;
  getDoctorById(id: string): Promise<Doctor | undefined>;
}

export class MemStorage implements IStorage {
  private patients: Map<number, Patient>;
  private appointments: Map<number, Appointment>;
  private patientIdCounter: number;
  private appointmentIdCounter: number;
  private doctors: Doctor[];

  constructor() {
    this.patients = new Map();
    this.appointments = new Map();
    this.patientIdCounter = 1;
    this.appointmentIdCounter = 1;
    
    // Initialize mock doctor data
    this.doctors = [
      {
        id: "dr-sarah-chen",
        name: "Dr. Sarah Chen",
        specialty: "cardiology",
        hospital: "City General Hospital",
        location: "bangalore",
        schedule: "Mon-Fri: 9:00 AM - 5:00 PM",
        consultationFee: 1200,
        availability: "available"
      },
      {
        id: "dr-michael-rodriguez",
        name: "Dr. Michael Rodriguez",
        specialty: "cardiology",
        hospital: "Heart Care Clinic",
        location: "mysuru",
        schedule: "Mon-Sat: 8:00 AM - 6:00 PM",
        consultationFee: 1000,
        availability: "next-day"
      },
      {
        id: "dr-emily-johnson",
        name: "Dr. Emily Johnson",
        specialty: "cardiology",
        hospital: "Metropolitan Medical Center",
        location: "bangalore",
        schedule: "Tue-Thu: 10:00 AM - 4:00 PM",
        consultationFee: 1500,
        availability: "available"
      },
      {
        id: "dr-james-wilson",
        name: "Dr. James Wilson",
        specialty: "dermatology",
        hospital: "Skin Care Institute",
        location: "udupi",
        schedule: "Mon-Fri: 8:00 AM - 4:00 PM",
        consultationFee: 1100,
        availability: "available"
      },
      {
        id: "dr-lisa-patel",
        name: "Dr. Lisa Patel",
        specialty: "neurology",
        hospital: "Brain & Spine Center",
        location: "shivamogga",
        schedule: "Tue-Sat: 9:00 AM - 5:00 PM",
        consultationFee: 1600,
        availability: "next-day"
      },
      {
        id: "dr-robert-brown",
        name: "Dr. Robert Brown",
        specialty: "orthopedics",
        hospital: "Joint & Bone Clinic",
        location: "davangere",
        schedule: "Mon-Fri: 7:00 AM - 6:00 PM",
        consultationFee: 1400,
        availability: "available"
      },
      {
        id: "dr-maria-garcia",
        name: "Dr. Maria Garcia",
        specialty: "pediatrics",
        hospital: "Children's Health Center",
        location: "ballari",
        schedule: "Mon-Sat: 8:00 AM - 7:00 PM",
        consultationFee: 900,
        availability: "available"
      },
      {
        id: "dr-david-kim",
        name: "Dr. David Kim",
        specialty: "psychiatry",
        hospital: "Mental Health Institute",
        location: "udupi",
        schedule: "Mon-Fri: 9:00 AM - 6:00 PM",
        consultationFee: 1300,
        availability: "next-day"
      },
      {
        id: "dr-jennifer-taylor",
        name: "Dr. Jennifer Taylor",
        specialty: "general",
        hospital: "Family Practice Center",
        location: "mysuru",
        schedule: "Mon-Sun: 6:00 AM - 10:00 PM",
        consultationFee: 700,
        availability: "available"
      }
    ];
  }

  private generatePatientId(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    return `MC-${year}-${randomNum}`;
  }

  private generateConfirmationNumber(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    return `APT-${year}-${randomNum}`;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.patientIdCounter++;
    const patientId = this.generatePatientId();
    const patient: Patient = { 
      ...insertPatient, 
      id, 
      patientId,
      createdAt: new Date()
    };
    this.patients.set(id, patient);
    return patient;
  }

  async getPatientByPatientId(patientId: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.patientId === patientId
    );
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentIdCounter++;
    const confirmationNumber = this.generateConfirmationNumber();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      confirmationNumber,
      createdAt: new Date()
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.patientId === patientId
    );
  }

  async searchDoctors(specialty?: string, location?: string): Promise<Doctor[]> {
    let filteredDoctors = [...this.doctors];
    
    if (specialty) {
      filteredDoctors = filteredDoctors.filter(doctor => doctor.specialty === specialty);
    }
    
    if (location) {
      filteredDoctors = filteredDoctors.filter(doctor => doctor.location === location);
    }
    
    return filteredDoctors;
  }

  async getDoctorById(id: string): Promise<Doctor | undefined> {
    return this.doctors.find(doctor => doctor.id === id);
  }
}

export const storage = new MemStorage();
