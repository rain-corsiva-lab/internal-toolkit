import { Staff, Role, Client, ClientPOC, RolePermissions } from "@/types/admin";

// Mock Staff Data
export const mockStaff: Staff[] = [
  {
    id: "1",
    fullName: "John Smith",
    phoneNumber: "+65 9123 4567",
    address: "123 Orchard Road, Singapore 238873",
    workEmail: "john.smith@company.com",
    country: "Singapore",
    joinedDate: "2023-01-15",
    department: "Management Team",
    employmentType: "Full-Time",
    designation: "General Manager",
    lastLoginDate: "2024-01-06 09:30:00",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-06T09:30:00Z"
  },
  {
    id: "2",
    fullName: "Sarah Johnson",
    phoneNumber: "+65 8234 5678",
    address: "456 Marina Bay, Singapore 018956",
    workEmail: "sarah.johnson@company.com",
    country: "Singapore",
    joinedDate: "2023-03-20",
    department: "Sales Team",
    employmentType: "Full-Time",
    designation: "Sales Manager",
    lastLoginDate: "2024-01-05 14:15:00",
    createdAt: "2023-03-20T00:00:00Z",
    updatedAt: "2024-01-05T14:15:00Z"
  },
  {
    id: "3",
    fullName: "Ahmad Rahman",
    phoneNumber: "+60 12 345 6789",
    address: "789 KLCC, Kuala Lumpur 50088",
    workEmail: "ahmad.rahman@company.com",
    country: "Malaysia",
    joinedDate: "2023-06-10",
    department: "Development Team",
    employmentType: "Full-Time",
    designation: "Senior Developer",
    lastLoginDate: "2024-01-06 11:20:00",
    createdAt: "2023-06-10T00:00:00Z",
    updatedAt: "2024-01-06T11:20:00Z"
  },
  {
    id: "4",
    fullName: "Nguyen Van Long",
    phoneNumber: "+84 987 654 321",
    address: "Ho Chi Minh City, Vietnam",
    workEmail: "nguyen.long@company.com",
    country: "Vietnam",
    joinedDate: "2023-09-05",
    department: "Design Team",
    employmentType: "Full-Time",
    designation: "UI/UX Designer",
    otApproverEmail: "john.smith@company.com",
    lastLoginDate: "2024-01-04 16:45:00",
    createdAt: "2023-09-05T00:00:00Z",
    updatedAt: "2024-01-04T16:45:00Z"
  },
  {
    id: "5",
    fullName: "Lisa Wang",
    phoneNumber: "+65 9876 5432",
    address: "101 Sentosa Cove, Singapore 098524",
    workEmail: "lisa.wang@company.com",
    country: "Singapore",
    joinedDate: "2023-11-12",
    department: "Project Team",
    employmentType: "Part-Time",
    designation: "Project Coordinator",
    lastLoginDate: "2024-01-05 10:30:00",
    createdAt: "2023-11-12T00:00:00Z",
    updatedAt: "2024-01-05T10:30:00Z"
  }
];

// Mock Role and Permissions Data
const managementPermissions: RolePermissions = {
  staff: { create: true, read: true, update: true, delete: true },
  roles: { create: true, read: true, update: true, delete: true },
  clients: { 
    create: true, 
    read: true, 
    update: true, 
    delete: true, 
    deletePOC: true,
    addClientPOC: true,
    viewMyClientPOCs: true,
    viewAllClientPOCs: true,
    editClientPOC: true,
    exportMyClientPOCs: true,
    exportAllClientPOCs: true
  },
  exportContacts: true
};

const salesPermissions: RolePermissions = {
  staff: { create: false, read: false, update: false, delete: false },
  roles: { create: false, read: false, update: false, delete: false },
  clients: { 
    create: true, 
    read: true, 
    update: true, 
    delete: false, 
    deletePOC: false,
    addClientPOC: true,
    viewMyClientPOCs: true,
    viewAllClientPOCs: false,
    editClientPOC: true,
    exportMyClientPOCs: true,
    exportAllClientPOCs: false
  },
  exportContacts: false
};

const projectPermissions: RolePermissions = {
  staff: { create: false, read: false, update: false, delete: false },
  roles: { create: false, read: false, update: false, delete: false },
  clients: { 
    create: false, 
    read: true, 
    update: false, 
    delete: false, 
    deletePOC: false,
    addClientPOC: false,
    viewMyClientPOCs: false,
    viewAllClientPOCs: true,
    editClientPOC: false,
    exportMyClientPOCs: false,
    exportAllClientPOCs: false
  },
  exportContacts: false
};

const designerPermissions: RolePermissions = {
  staff: { create: false, read: false, update: false, delete: false },
  roles: { create: false, read: false, update: false, delete: false },
  clients: { 
    create: false, 
    read: false, 
    update: false, 
    delete: false, 
    deletePOC: false,
    addClientPOC: false,
    viewMyClientPOCs: false,
    viewAllClientPOCs: false,
    editClientPOC: false,
    exportMyClientPOCs: false,
    exportAllClientPOCs: false
  },
  exportContacts: false
};

const developerPermissions: RolePermissions = {
  staff: { create: false, read: false, update: false, delete: false },
  roles: { create: false, read: false, update: false, delete: false },
  clients: { 
    create: false, 
    read: false, 
    update: false, 
    delete: false, 
    deletePOC: false,
    addClientPOC: false,
    viewMyClientPOCs: false,
    viewAllClientPOCs: false,
    editClientPOC: false,
    exportMyClientPOCs: false,
    exportAllClientPOCs: false
  },
  exportContacts: false
};

// Mock Roles Data
export const mockRoles: Role[] = [
  {
    id: "1",
    name: "Management",
    permissions: managementPermissions,
    isDefault: true,
    lastUpdated: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Sales",
    permissions: salesPermissions,
    lastUpdated: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    name: "Project",
    permissions: projectPermissions,
    lastUpdated: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "4",
    name: "Designer",
    permissions: designerPermissions,
    lastUpdated: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "5",
    name: "Developer",
    permissions: developerPermissions,
    lastUpdated: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z"
  }
];

// Mock Clients Data
export const mockClients: Client[] = [
  {
    id: "1",
    companyName: "Tech Innovations Pte Ltd",
    registrationNumber: "202301234A",
    addresses: [
      { id: "1", type: "Main", address: "1 Raffles Place, Singapore 048616", isMain: true },
      { id: "2", type: "Other", address: "2 Marina Boulevard, Singapore 018987", isMain: false }
    ],
    country: "Singapore",
    industry: "Professional Services",
    numberOfProjects: 3,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-06T00:00:00Z"
  },
  {
    id: "2",
    companyName: "Food Paradise Sdn Bhd",
    registrationNumber: "123456-K",
    addresses: [
      { id: "3", type: "Main", address: "Jalan Bukit Bintang, Kuala Lumpur 55100", isMain: true }
    ],
    country: "Malaysia",
    industry: "F&B",
    numberOfProjects: 1,
    createdAt: "2023-03-20T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z"
  },
  {
    id: "3",
    companyName: "Singapore Retail Group",
    registrationNumber: "202305678B",
    addresses: [
      { id: "4", type: "Main", address: "313 Orchard Road, Singapore 238895", isMain: true }
    ],
    country: "Singapore",
    industry: "Retail",
    numberOfProjects: 5,
    createdAt: "2023-05-10T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z"
  }
];

// Mock Client POCs Data
export const mockClientPOCs: ClientPOC[] = [
  {
    id: "1",
    clientId: "1",
    contactName: "Michael Tan",
    contactNumber: "+65 9123 4567",
    contactEmail: "michael.tan@techinnovations.com",
    designation: "CTO",
    salesPIC: "2", // Sarah Johnson
    projectStatus: "Active",
    projectName: "Enterprise CRM System",
    projectType: "Software Development",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-06T00:00:00Z"
  },
  {
    id: "2",
    clientId: "1",
    contactName: "Jennifer Lee",
    contactNumber: "+65 8234 5678",
    contactEmail: "jennifer.lee@techinnovations.com",
    designation: "Project Manager",
    salesPIC: "2", // Sarah Johnson
    projectStatus: "Active",
    projectName: "Mobile App Development",
    projectType: "Mobile Application",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-06T00:00:00Z"
  },
  {
    id: "3",
    clientId: "2",
    contactName: "Lim Wei Ming",
    contactNumber: "+60 12 345 6789",
    contactEmail: "wei.ming@foodparadise.com.my",
    designation: "Operations Manager",
    salesPIC: "2", // Sarah Johnson
    projectStatus: "Inactive",
    projectName: "Inventory Management Portal",
    projectType: "Web Application",
    createdAt: "2023-03-20T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z"
  },
  {
    id: "4",
    clientId: "3",
    contactName: "David Wong",
    contactNumber: "+65 9876 5432",
    contactEmail: "david.wong@sgretail.com",
    designation: "IT Director",
    salesPIC: "2", // Sarah Johnson
    projectStatus: "Active",
    projectName: "E-commerce Platform",
    projectType: "Web Development",
    createdAt: "2023-05-10T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z"
  }
];

// Helper functions to get related data
export const getStaffByDepartment = (department: string) => 
  mockStaff.filter(staff => staff.department === department && !staff.isDeleted);

export const getSalesStaff = () => 
  mockStaff.filter(staff => staff.department === "Sales Team" && !staff.isDeleted);

export const getClientPOCsByClient = (clientId: string) =>
  mockClientPOCs.filter(poc => poc.clientId === clientId);

export const getStaffById = (id: string) =>
  mockStaff.find(staff => staff.id === id);

export const getClientById = (id: string) =>
  mockClients.find(client => client.id === id);

export const getRoleById = (id: string) =>
  mockRoles.find(role => role.id === id);