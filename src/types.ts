export type RequirementStatus = 
  | 'New'
  | 'Contacted'
  | 'Searching'
  | 'Tutor Assigned'
  | 'Demo Scheduled'
  | 'Filled'
  | 'Tuition Started'
  | 'Completed'
  | 'Cancelled'
  | 'On Hold'
  | 'No Tutor Available';

export type DemoStatus = 
  | 'DEMO_SCHEDULED'
  | 'DEMO_COMPLETED'
  | 'PARENT_APPROVED'
  | 'PARENT_NOT_APPROVED'
  | 'CHANGE_TUTOR'
  | 'CANCELLED';

export type TutorStatus = 
  | 'Pending' 
  | 'Approved' 
  | 'Rejected' 
  | 'REGISTRATION_RECEIVED' 
  | 'DOCUMENTS_PENDING' 
  | 'UNDER_REVIEW' 
  | 'VERIFIED' 
  | 'ACTIVE' 
  | 'INACTIVE';

export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected';

export type TeachingMode = 'Student Home' | 'Online' | 'Hybrid';

export interface DemoAssignment {
  id: string; // e.g. 'DEMO-1001'
  requirementId: string; // e.g. 'HW01'
  tutorId: string; // e.g. 'RHT-0001'
  tutorName: string;
  studentName: string;
  parentName: string;
  phone: string;
  subjects: string[];
  classes: string[];
  demoDate: string; // YYYY-MM-DD
  demoTime: string; // e.g. '05:00 PM'
  demoLocation: string; // e.g. 'Bariatu Road, near Hill View'
  status: DemoStatus;
  parentFeedback?: string;
  tutorFeedback?: string;
  coordinatorNotes?: string;
  finalDecision?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TuitionRequirement {
  id: string; // e.g. 'HW01', 'HW02', etc. (Form No.)
  reqCode: string; // Form number, e.g. 'HW01'
  parentName: string;
  studentName: string;
  phone: string;
  classes: string[]; // e.g. ['Class 8', 'Class 10']
  subjects: string[]; // e.g. ['Mathematics', 'Science']
  area: string; // Free text area / nearby location in Ranchi
  classesPerWeek: number; // 1 - 7, default 5
  timeFrom: string; // e.g. '05:00 PM'
  timeTo: string; // e.g. '07:00 PM'
  preferredTutor: 'Male' | 'Female' | 'No Preference';
  budget: string; // e.g. '₹3,500 – ₹4,500'
  additionalRequirements?: string;
  status: RequirementStatus;
  assignedTutorId?: string; // Internal Tutor ID e.g. 'RHT-0001', admin only
  assignedTutorName?: string;
  documentPhoto?: string; // Syllabus / assignment document photo if uploaded
  adminNotes?: string;
  createdAt: string;
}

export interface Tutor {
  id: string; // Internal Tutor ID e.g. 'RHT-0001' (STRICTLY ADMIN ONLY)
  fullName: string;
  dob?: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  highestQualification: string;
  college?: string;
  subjects: string[];
  classes: string[];
  teachingExperience: number | string; // in years
  teachingArea: string; // Areas in Ranchi
  teachingMode: TeachingMode;
  availability: string; // e.g. 'Morning & Evening'
  aadhaarLast4?: string; // Minimized Aadhaar storage (only last 4 digits if needed)
  aadhaarNumber?: string; // Legacy / masked display
  panNumber?: string; // optional
  profilePhoto?: string;
  qualificationPhoto?: string; // Private storage link / secure proxy
  aadhaarPhoto?: string; // Private storage link / secure proxy
  aadhaarVerified?: boolean;
  status: TutorStatus; // 'Pending' | 'Approved' | 'Rejected'
  isHidden: boolean;
  registeredAt: string;
  assignedRequirementsCount?: number;
  assignedStudentId?: string; // Assigned Student Requirement ID e.g. 'HW01' (ADMIN ONLY)
  assignedStudentName?: string;
  adminNotes?: string;
}

export interface Review {
  id: string;
  parentName: string;
  studentInfo: string; // e.g. 'Parent of Class 10 student, Doranda'
  locality: string;
  rating: number; // 1-5
  comment: string;
  status: ReviewStatus;
  date: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  isVisible: boolean;
}

export interface WebsiteSettings {
  websiteName: string;
  tagline: string;
  heroHeading: string;
  heroDescription: string;
  heroSubtitle?: string;
  whatsappNumber: string; // '7520907126'
  instagramProfile: string; // 'ranchi_hometuition_wala'
  email: string; // 'rahulkrg2008@gmail.com'
  officeAddress: string;
  city: string;
  state: string;
  parentAnnualServiceFee: number; // 599
  tutorVerificationFee: number; // 499
  firstMonthCommissionPercent: number; // 50
}
