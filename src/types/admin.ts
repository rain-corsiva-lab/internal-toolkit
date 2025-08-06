// Staff Management Types
export interface Staff {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  workEmail: string;
  country: "Singapore" | "Malaysia" | "Vietnam" | "Indonesia";
  joinedDate: string;
  department: "Management Team" | "Project Team" | "Sales Team" | "Design Team" | "Development Team" | "Maintenance Team";
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Intern";
  designation: string;
  approverEmail?: string;
  lastLoginDate?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  roleId?: string;
}

// Role Management Types
export interface Role {
  id: string;
  name: string;
  permissions: RolePermissions;
  isDefault?: boolean;
  lastUpdated: string;
  createdAt: string;
}

export interface RolePermissions {
  staff: CRUDPermissions;
  roles: CRUDPermissions;
  clients: CRUDPermissions;
}

export interface CRUDPermissions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface StaffRole {
  staffId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string;
}

// Client Management Types
export interface Client {
  id: string;
  companyName: string;
  registrationNumber: string;
  addresses: ClientAddress[];
  country: "Singapore" | "Malaysia";
  industry: "Retail" | "F&B" | "Manufacturing, Engineering and Technology" | "Sports" | "Education" | "Medical" | "Professional Services" | "Event & Hospitality" | "Construction" | "Automobile" | "Non-profit Organization/ Social Enterprise" | "Beauty and Fashion" | "Art, music and Entertainment" | "Others";
  customIndustry?: string;
  numberOfProjects: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientAddress {
  id: string;
  type: "Main" | "Billing";
  address: string;
  isMain: boolean;
}

export interface ClientPOC {
  id: string;
  clientId: string;
  contactName: string;
  contactNumber: string;
  contactEmail: string;
  designation: string;
  salesPIC: string; // Staff ID from Sales Team
  projectStatus: "Quoted" | "Confirmed";
  createdAt: string;
  updatedAt: string;
}

// Filter and Search Types
export interface StaffFilters {
  country?: string;
  department?: string;
  employmentType?: string;
  search?: string;
}

export interface ClientFilters {
  country?: string;
  industry?: string;
  search?: string;
}

export interface POCFilters {
  salesPIC?: string;
  projectStatus?: string;
  search?: string;
}