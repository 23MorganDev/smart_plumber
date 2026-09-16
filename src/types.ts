export type UrgencyLevel = "critical" | "high" | "medium" | "low";

export type ServiceCategory =
  | "Emergency Repairs"
  | "Pump & Pressure Systems"
  | "Solar & Water Heating"
  | "Water Storage & Tanks"
  | "Waste & Drainage Systems"
  | "Leak Detection & Pipe Relining"
  | "Metering & Smart Systems"
  | "Drain Cleaning & Hydro Jetting";

export interface SubService {
  name: string;
  detail: string;
}

export interface PlumbingService {
  id: string;
  category: ServiceCategory;
  title: string;
  tagline: string;
  iconId: string;
  priceRange: string;
  turnaround: string;
  warranty: string;
  includes: string[];
  warningSigns: string[];
  emergency: boolean;
}

export interface TroubleshootStep {
  title: string;
  detail: string;
  critical?: boolean;
}

export interface TroubleshootIssue {
  id: string;
  symptom: string;
  summary: string;
  urgency: UrgencyLevel;
  urgencyLabel: string;
  expectedService: ServiceCategory;
  diySteps: TroubleshootStep[];
  notToDo: string[];
  repairScope: string;
  etaLabel: string;
}

export interface BookingRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  urgency: string;
  description: string;
  createdAt: string;
  etaWindow: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  neighborhood: string;
  service: string;
  rating: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export type GalleryCategory =
  | "Water Tanks & Pumps"
  | "Sewer & Drainage"
  | "Bathroom Piping"
  | "Solar Water Heating"
  | "Commercial Plumbing";

export interface GalleryProject {
  id: string;
  title: string;
  category: GalleryCategory;
  description: string;
  image: string;
  beforeImage?: string;
  afterImage?: string;
  location: string;
  tags: string[];
  specs: { label: string; value: string }[];
  duration: string;
  completionDate: string;
  materials: string[];
}