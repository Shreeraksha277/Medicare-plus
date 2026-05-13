import { patients, appointments, type Patient, type InsertPatient, type Appointment, type InsertAppointment, type Doctor, type Hospital } from "@shared/schema";

export interface IStorage {
  createPatient(patient: InsertPatient): Promise<Patient>;
  getPatientByPatientId(patientId: string): Promise<Patient | undefined>;
  getPatientByEmail(email: string): Promise<Patient | undefined>;
  updatePatientPassword(patientId: string, password: string): Promise<void>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByPatientId(patientId: string): Promise<Appointment[]>;
  getAllAppointments(): Promise<Appointment[]>;
  updateAppointmentStatus(confirmationNumber: string, status: string): Promise<void>;
  searchDoctors(specialty?: string, location?: string, name?: string): Promise<Doctor[]>;
  getDoctorById(id: string): Promise<Doctor | undefined>;
  getAllDoctors(): Promise<Doctor[]>;
  getHospitals(city?: string): Promise<Hospital[]>;
  getHospitalById(id: string): Promise<Hospital | undefined>;
  getAllPatients(): Promise<Patient[]>;
}

export class MemStorage implements IStorage {
  private patients: Map<number, Patient>;
  private appointments: Map<number, Appointment>;
  private patientIdCounter: number;
  private appointmentIdCounter: number;
  private doctors: Doctor[];
  private hospitals: Hospital[];

  constructor() {
    this.patients = new Map();
    this.appointments = new Map();
    this.patientIdCounter = 1;
    this.appointmentIdCounter = 1;

    this.hospitals = [
      {
        id: "city-general",
        name: "City General Hospital",
        location: "bangalore",
        city: "Bangalore",
        address: "15 MG Road, Bangalore, Karnataka 560001",
        rating: 4.7,
        reviewCount: 2348,
        availableDoctors: 42,
        totalBeds: 500,
        specialties: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology"],
        emergency: true,
        phone: "+91 80 2234 5678",
        imageColor: "from-blue-600 to-cyan-500",
        established: 1982,
        accreditation: "NABH Accredited",
      },
      {
        id: "apollo-health",
        name: "Apollo Health Institute",
        location: "bangalore",
        city: "Bangalore",
        address: "Plot 45, Jayanagar, Bangalore, Karnataka 560041",
        rating: 4.9,
        reviewCount: 5621,
        availableDoctors: 78,
        totalBeds: 800,
        specialties: ["Cardiology", "Oncology", "Transplant", "Neurology", "Dermatology"],
        emergency: true,
        phone: "+91 80 6677 8899",
        imageColor: "from-purple-600 to-pink-500",
        established: 1995,
        accreditation: "JCI & NABH Accredited",
      },
      {
        id: "heart-care",
        name: "Heart Care Clinic",
        location: "mysuru",
        city: "Mysuru",
        address: "78 Devaraja Urs Road, Mysuru, Karnataka 570001",
        rating: 4.5,
        reviewCount: 987,
        availableDoctors: 18,
        totalBeds: 150,
        specialties: ["Cardiology", "General Medicine", "Diagnostics"],
        emergency: false,
        phone: "+91 821 4455 667",
        imageColor: "from-red-500 to-rose-400",
        established: 2003,
        accreditation: "NABH Accredited",
      },
      {
        id: "metropolitan",
        name: "Metropolitan Medical Center",
        location: "bangalore",
        city: "Bangalore",
        address: "22 Cunningham Road, Bangalore, Karnataka 560052",
        rating: 4.6,
        reviewCount: 3102,
        availableDoctors: 55,
        totalBeds: 650,
        specialties: ["Orthopedics", "Sports Medicine", "Physiotherapy", "Rheumatology"],
        emergency: true,
        phone: "+91 80 4433 2211",
        imageColor: "from-teal-500 to-green-400",
        established: 1990,
        accreditation: "NABH Accredited",
      },
      {
        id: "brain-spine",
        name: "Brain & Spine Center",
        location: "shivamogga",
        city: "Shivamogga",
        address: "101 KEB Colony, Shivamogga, Karnataka 577201",
        rating: 4.4,
        reviewCount: 654,
        availableDoctors: 12,
        totalBeds: 100,
        specialties: ["Neurology", "Neurosurgery", "Spine Surgery"],
        emergency: true,
        phone: "+91 8182 234567",
        imageColor: "from-indigo-600 to-blue-400",
        established: 2008,
        accreditation: "NABH Accredited",
      },
      {
        id: "childrens-health",
        name: "Children's Health Center",
        location: "ballari",
        city: "Ballari",
        address: "55 Gandhi Nagar, Ballari, Karnataka 583101",
        rating: 4.8,
        reviewCount: 1245,
        availableDoctors: 22,
        totalBeds: 200,
        specialties: ["Pediatrics", "Neonatology", "Pediatric Surgery", "Child Psychiatry"],
        emergency: true,
        phone: "+91 8392 456789",
        imageColor: "from-yellow-400 to-orange-400",
        established: 2000,
        accreditation: "NABH Accredited",
      },
      {
        id: "skin-care",
        name: "Skin Care Institute",
        location: "udupi",
        city: "Udupi",
        address: "33 Manipal Highway, Udupi, Karnataka 576101",
        rating: 4.3,
        reviewCount: 432,
        availableDoctors: 8,
        totalBeds: 50,
        specialties: ["Dermatology", "Cosmetic Surgery", "Trichology"],
        emergency: false,
        phone: "+91 820 2345678",
        imageColor: "from-pink-500 to-rose-300",
        established: 2012,
        accreditation: "NABH Accredited",
      },
      {
        id: "mental-health",
        name: "Mental Health Institute",
        location: "udupi",
        city: "Udupi",
        address: "12 Indrali Road, Udupi, Karnataka 576102",
        rating: 4.6,
        reviewCount: 765,
        availableDoctors: 15,
        totalBeds: 120,
        specialties: ["Psychiatry", "Psychology", "De-addiction", "Child Psychiatry"],
        emergency: true,
        phone: "+91 820 3456789",
        imageColor: "from-violet-500 to-purple-400",
        established: 2006,
        accreditation: "NABH Accredited",
      },
    ];

    this.doctors = [
      {
        id: "dr-sarah-chen",
        name: "Dr. Sarah Chen",
        specialty: "cardiology",
        hospital: "City General Hospital",
        hospitalId: "city-general",
        location: "bangalore",
        city: "Bangalore",
        schedule: "Mon-Fri: 9:00 AM - 5:00 PM",
        consultationFee: 1200,
        availability: "available",
        rating: 4.9,
        reviewCount: 342,
        experience: 15,
        qualifications: "MBBS, MD (Cardiology), DM (Interventional Cardiology), FACC",
        about: "Dr. Sarah Chen is a renowned interventional cardiologist with 15+ years of experience in treating complex cardiac conditions. She specializes in minimally invasive cardiac procedures and preventive cardiology.",
        imageUrl: "https://ui-avatars.com/api/?name=Sarah+Chen&background=0D8ABC&color=fff&size=200&rounded=true",
        availableSlots: [
          { time: "09:00 AM", available: true },
          { time: "10:00 AM", available: false },
          { time: "11:00 AM", available: true },
          { time: "02:00 PM", available: true },
          { time: "03:00 PM", available: false },
          { time: "04:00 PM", available: true },
        ],
        languages: ["English", "Kannada", "Hindi"],
      },
      {
        id: "dr-michael-rodriguez",
        name: "Dr. Michael Rodriguez",
        specialty: "cardiology",
        hospital: "Heart Care Clinic",
        hospitalId: "heart-care",
        location: "mysuru",
        city: "Mysuru",
        schedule: "Mon-Sat: 8:00 AM - 6:00 PM",
        consultationFee: 1000,
        availability: "next-day",
        rating: 4.7,
        reviewCount: 215,
        experience: 12,
        qualifications: "MBBS, MD (Medicine), DM (Cardiology), FRCP",
        about: "Dr. Michael Rodriguez is a dedicated cardiologist specializing in heart failure management and echocardiography. He has performed over 3000 cardiac procedures.",
        imageUrl: "https://ui-avatars.com/api/?name=Michael+Rodriguez&background=1565C0&color=fff&size=200&rounded=true",
        availableSlots: [
          { time: "08:00 AM", available: false },
          { time: "09:30 AM", available: true },
          { time: "11:00 AM", available: true },
          { time: "02:30 PM", available: true },
          { time: "04:00 PM", available: false },
          { time: "05:00 PM", available: true },
        ],
        languages: ["English", "Hindi"],
      },
      {
        id: "dr-emily-johnson",
        name: "Dr. Emily Johnson",
        specialty: "cardiology",
        hospital: "Metropolitan Medical Center",
        hospitalId: "metropolitan",
        location: "bangalore",
        city: "Bangalore",
        schedule: "Tue-Thu: 10:00 AM - 4:00 PM",
        consultationFee: 1500,
        availability: "available",
        rating: 4.8,
        reviewCount: 489,
        experience: 18,
        qualifications: "MBBS, MD, DM (Cardiology), PhD, FESC",
        about: "Dr. Emily Johnson is a leading expert in electrophysiology and cardiac rhythm disorders. She has published over 50 research papers and trained hundreds of cardiologists.",
        imageUrl: "https://ui-avatars.com/api/?name=Emily+Johnson&background=AD1457&color=fff&size=200&rounded=true",
        availableSlots: [
          { time: "10:00 AM", available: true },
          { time: "11:30 AM", available: true },
          { time: "12:00 PM", available: false },
          { time: "02:00 PM", available: true },
          { time: "03:30 PM", available: true },
        ],
        languages: ["English", "Kannada"],
      },
      {
        id: "dr-james-wilson",
        name: "Dr. James Wilson",
        specialty: "dermatology",
        hospital: "Skin Care Institute",
        hospitalId: "skin-care",
        location: "udupi",
        city: "Udupi",
        schedule: "Mon-Fri: 8:00 AM - 4:00 PM",
        consultationFee: 1100,
        availability: "available",
        rating: 4.6,
        reviewCount: 178,
        experience: 10,
        qualifications: "MBBS, MD (Dermatology), Fellowship in Aesthetic Dermatology",
        about: "Dr. James Wilson is a skilled dermatologist specializing in acne treatment, psoriasis management, and cosmetic dermatology. He uses the latest laser technologies.",
        imageUrl: "https://ui-avatars.com/api/?name=James+Wilson&background=558B2F&color=fff&size=200&rounded=true",
        availableSlots: [
          { time: "08:00 AM", available: true },
          { time: "09:00 AM", available: true },
          { time: "10:30 AM", available: false },
          { time: "01:00 PM", available: true },
          { time: "02:30 PM", available: true },
          { time: "03:30 PM", available: false },
        ],
        languages: ["English", "Kannada", "Tulu"],
      },
      {
        id: "dr-lisa-patel",
        name: "Dr. Lisa Patel",
        specialty: "neurology",
        hospital: "Brain & Spine Center",
        hospitalId: "brain-spine",
        location: "shivamogga",
        city: "Shivamogga",
        schedule: "Tue-Sat: 9:00 AM - 5:00 PM",
        consultationFee: 1600,
        availability: "next-day",
        rating: 4.8,
        reviewCount: 267,
        experience: 14,
        qualifications: "MBBS, MD (Neurology), DM (Neurology), DNB, FAAN",
        about: "Dr. Lisa Patel is a renowned neurologist with expertise in stroke management, epilepsy, and movement disorders. She leads the stroke intervention team.",
        imageUrl: "https://ui-avatars.com/api/?name=Lisa+Patel&background=6A1B9A&color=fff&size=200&rounded=true",
        availableSlots: [
          { time: "09:00 AM", available: false },
          { time: "10:30 AM", available: true },
          { time: "12:00 PM", available: true },
          { time: "02:00 PM", available: false },
          { time: "03:30 PM", available: true },
          { time: "04:30 PM", available: true },
        ],
        languages: ["English", "Hindi", "Gujarati"],
      },
      {
        id: "dr-robert-brown",
        name: "Dr. Robert Brown",
        specialty: "orthopedics",
        hospital: "Metropolitan Medical Center",
        hospitalId: "metropolitan",
        location: "bangalore",
        city: "Bangalore",
        schedule: "Mon-Fri: 7:00 AM - 6:00 PM",
        consultationFee: 1400,
        availability: "available",
        rating: 4.7,
        reviewCount: 394,
        experience: 20,
        qualifications: "MBBS, MS (Orthopedics), Fellowship in Joint Replacement, MCh",
        about: "Dr. Robert Brown is a pioneer in minimally invasive joint replacement surgery. He has performed over 5000 successful knee and hip replacements.",
        imageUrl: "https://ui-avatars.com/api/?name=Robert+Brown&background=4E342E&color=fff&size=200&rounded=true",
        availableSlots: [
          { time: "07:30 AM", available: true },
          { time: "09:00 AM", available: true },
          { time: "10:30 AM", available: false },
          { time: "02:00 PM", available: true },
          { time: "03:30 PM", available: false },
          { time: "05:00 PM", available: true },
        ],
        languages: ["English", "Kannada", "Hindi"],
      },
      {
        id: "dr-maria-garcia",
        name: "Dr. Maria Garcia",
        specialty: "pediatrics",
        hospital: "Children's Health Center",
        hospitalId: "childrens-health",
        location: "ballari",
        city: "Ballari",
        schedule: "Mon-Sat: 8:00 AM - 7:00 PM",
        consultationFee: 900,
        availability: "available",
        rating: 4.9,
        reviewCount: 521,
        experience: 16,
        qualifications: "MBBS, MD (Pediatrics), Fellowship in Neonatology, PGPN",
        about: "Dr. Maria Garcia is a compassionate pediatrician with special expertise in neonatology and developmental pediatrics. She cares for over 200 children monthly.",
        imageUrl: "https://ui-avatars.com/api/?name=Maria+Garcia&background=F57F17&color=fff&size=200&rounded=true",
        availableSlots: [
          { time: "08:00 AM", available: true },
          { time: "09:30 AM", available: false },
          { time: "11:00 AM", available: true },
          { time: "01:00 PM", available: true },
          { time: "03:00 PM", available: true },
          { time: "05:00 PM", available: false },
        ],
        languages: ["English", "Hindi", "Kannada"],
      },
      {
        id: "dr-david-kim",
        name: "Dr. David Kim",
        specialty: "psychiatry",
        hospital: "Mental Health Institute",
        hospitalId: "mental-health",
        location: "udupi",
        city: "Udupi",
        schedule: "Mon-Fri: 9:00 AM - 6:00 PM",
        consultationFee: 1300,
        availability: "next-day",
        rating: 4.7,
        reviewCount: 189,
        experience: 11,
        qualifications: "MBBS, MD (Psychiatry), Fellowship in Addiction Medicine, MRCPsych",
        about: "Dr. David Kim is a compassionate psychiatrist specializing in mood disorders, anxiety, and addiction medicine. He believes in holistic patient care.",
        imageUrl: "https://ui-avatars.com/api/?name=David+Kim&background=283593&color=fff&size=200&rounded=true",
        availableSlots: [
          { time: "09:00 AM", available: true },
          { time: "10:30 AM", available: true },
          { time: "12:00 PM", available: false },
          { time: "02:30 PM", available: true },
          { time: "04:00 PM", available: true },
          { time: "05:30 PM", available: false },
        ],
        languages: ["English", "Korean", "Hindi"],
      },
      {
        id: "dr-jennifer-taylor",
        name: "Dr. Jennifer Taylor",
        specialty: "general",
        hospital: "City General Hospital",
        hospitalId: "city-general",
        location: "bangalore",
        city: "Bangalore",
        schedule: "Mon-Sun: 6:00 AM - 10:00 PM",
        consultationFee: 700,
        availability: "available",
        rating: 4.5,
        reviewCount: 856,
        experience: 8,
        qualifications: "MBBS, MRCGP, Diploma in Family Medicine",
        about: "Dr. Jennifer Taylor is a dedicated family physician providing comprehensive primary care. She is known for her thorough examinations and patient-centered approach.",
        imageUrl: "https://ui-avatars.com/api/?name=Jennifer+Taylor&background=00897B&color=fff&size=200&rounded=true",
        availableSlots: [
          { time: "06:00 AM", available: true },
          { time: "08:00 AM", available: false },
          { time: "10:00 AM", available: true },
          { time: "12:00 PM", available: true },
          { time: "02:00 PM", available: true },
          { time: "06:00 PM", available: true },
        ],
        languages: ["English", "Kannada"],
      },
      {
        id: "dr-priya-sharma",
        name: "Dr. Priya Sharma",
        specialty: "gynecology",
        hospital: "Apollo Health Institute",
        hospitalId: "apollo-health",
        location: "bangalore",
        city: "Bangalore",
        schedule: "Mon-Sat: 9:00 AM - 5:00 PM",
        consultationFee: 1400,
        availability: "available",
        rating: 4.9,
        reviewCount: 623,
        experience: 17,
        qualifications: "MBBS, MS (OBG), Fellowship in Reproductive Medicine, FRCOG",
        about: "Dr. Priya Sharma is a leading gynecologist and obstetrician with vast experience in high-risk pregnancies, laparoscopic surgeries, and fertility treatments.",
        imageUrl: "https://ui-avatars.com/api/?name=Priya+Sharma&background=C62828&color=fff&size=200&rounded=true",
        availableSlots: [
          { time: "09:00 AM", available: true },
          { time: "10:30 AM", available: true },
          { time: "12:00 PM", available: false },
          { time: "02:00 PM", available: true },
          { time: "03:30 PM", available: false },
          { time: "04:30 PM", available: true },
        ],
        languages: ["English", "Hindi", "Kannada"],
      },
      {
        id: "dr-rajesh-kumar",
        name: "Dr. Rajesh Kumar",
        specialty: "orthopedics",
        hospital: "Apollo Health Institute",
        hospitalId: "apollo-health",
        location: "bangalore",
        city: "Bangalore",
        schedule: "Mon-Fri: 8:00 AM - 5:00 PM",
        consultationFee: 1600,
        availability: "available",
        rating: 4.8,
        reviewCount: 412,
        experience: 22,
        qualifications: "MBBS, MS (Orthopedics), MCh (Sports Medicine), Fellowship USA",
        about: "Dr. Rajesh Kumar is a sports medicine specialist and orthopedic surgeon. He has treated numerous national-level athletes and performed cutting-edge arthroscopic surgeries.",
        imageUrl: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=1B5E20&color=fff&size=200&rounded=true",
        availableSlots: [
          { time: "08:00 AM", available: false },
          { time: "09:30 AM", available: true },
          { time: "11:00 AM", available: true },
          { time: "02:00 PM", available: false },
          { time: "03:30 PM", available: true },
          { time: "04:30 PM", available: true },
        ],
        languages: ["English", "Hindi", "Telugu"],
      },
      {
        id: "dr-ananya-nair",
        name: "Dr. Ananya Nair",
        specialty: "neurology",
        hospital: "Apollo Health Institute",
        hospitalId: "apollo-health",
        location: "bangalore",
        city: "Bangalore",
        schedule: "Mon-Fri: 10:00 AM - 6:00 PM",
        consultationFee: 1800,
        availability: "next-day",
        rating: 4.9,
        reviewCount: 287,
        experience: 13,
        qualifications: "MBBS, MD (Neurology), DM, Fellowship in Movement Disorders (USA)",
        about: "Dr. Ananya Nair is a movement disorder specialist with expertise in Parkinson's disease, tremors, and dystonia. She received her fellowship training at Johns Hopkins.",
        imageUrl: "https://ui-avatars.com/api/?name=Ananya+Nair&background=880E4F&color=fff&size=200&rounded=true",
        availableSlots: [
          { time: "10:00 AM", available: true },
          { time: "11:30 AM", available: false },
          { time: "01:00 PM", available: true },
          { time: "03:00 PM", available: true },
          { time: "05:00 PM", available: false },
        ],
        languages: ["English", "Malayalam", "Kannada", "Hindi"],
      },
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
      existingDiseases: insertPatient.existingDiseases ?? null,
      allergies: insertPatient.allergies ?? null,
      createdAt: new Date(),
    };
    this.patients.set(id, patient);
    return patient;
  }

  async getPatientByPatientId(patientId: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find((p) => p.patientId === patientId);
  }

  async getPatientByEmail(email: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find((p) => p.email === email);
  }

  async updatePatientPassword(patientId: string, password: string): Promise<void> {
    const patient = await this.getPatientByPatientId(patientId);
    if (patient) {
      this.patients.set(patient.id, { ...patient, password });
    }
  }

  async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentIdCounter++;
    const confirmationNumber = this.generateConfirmationNumber();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      confirmationNumber,
      problemDescription: insertAppointment.problemDescription ?? null,
      status: insertAppointment.status ?? "upcoming",
      createdAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter((a) => a.patientId === patientId);
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async updateAppointmentStatus(confirmationNumber: string, status: string): Promise<void> {
    const entry = Array.from(this.appointments.entries()).find(
      ([, a]) => a.confirmationNumber === confirmationNumber
    );
    if (entry) {
      this.appointments.set(entry[0], { ...entry[1], status });
    }
  }

  async searchDoctors(specialty?: string, location?: string, name?: string): Promise<Doctor[]> {
    let result = [...this.doctors];
    if (specialty && specialty !== "all") {
      result = result.filter((d) => d.specialty === specialty);
    }
    if (location && location !== "all") {
      result = result.filter((d) => d.location === location);
    }
    if (name) {
      const q = name.toLowerCase();
      result = result.filter(
        (d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getDoctorById(id: string): Promise<Doctor | undefined> {
    return this.doctors.find((d) => d.id === id);
  }

  async getAllDoctors(): Promise<Doctor[]> {
    return [...this.doctors];
  }

  async getHospitals(city?: string): Promise<Hospital[]> {
    if (city && city !== "all") {
      return this.hospitals.filter((h) => h.location === city);
    }
    return [...this.hospitals];
  }

  async getHospitalById(id: string): Promise<Hospital | undefined> {
    return this.hospitals.find((h) => h.id === id);
  }
}

export const storage = new MemStorage();
