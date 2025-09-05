// Cost Management Types
export interface CostItem {
  id: string;
  type: 'per_manhour' | 'fixed';
  description: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
}

export interface CostVersion {
  id: string;
  version: string;
  costItems: CostItem[];
  createdAt: string;
  createdBy: string;
  isActive: boolean;
}

// Project Types
export type ProjectType = 
  | 'AI Chatbot Project'
  | 'PSG Project - Package A'
  | 'PSG Project - Package B'
  | 'PSG Project - Package C'
  | 'E-commerce Websites Project'
  | 'Digital Marketing Project'
  | 'Graphic Designs Project'
  | 'Corporate Websites'
  | 'Custom Solutions Project';

// Base Quotation Types
export interface BaseQuotation {
  id: string;
  clientId: string;
  clientPOCId: string;
  salesPIC: string;
  billingAddress: string;
  projectType: ProjectType;
  totalCost: number;
  costVersionId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

// Project-specific data structures
export interface DescriptionManHour {
  id: string;
  description: string;
  manHours: number;
}

export interface AddOn {
  id: string;
  type: 'internal' | 'external';
  title: string;
  // For external add-ons
  price?: number;
  vendorName?: string;
  vendorCost?: number;
  // For internal add-ons
  designHours?: number;
  programmingHours?: number;
}

export interface ThirdPartyCost {
  id: string;
  vendor: string;
  cost: number;
}

export interface MaintenanceItem {
  id: string;
  description: string;
  manHours: number;
}

export interface ModuleItem {
  id: string;
  module: string;
  manHours: number;
}

export interface APIIntegration {
  id: string;
  description: string;
  manHours: number;
}

// Project-specific quotation data
export interface AIChatsotProjectData {}

export interface PSGProjectData {
  packageType: 'A' | 'B' | 'C';
  numberOfPages: number;
  manHours: number;
}

export interface EcommerceProjectData {
  numberOfPages: number;
  manHours: number;
}

export interface DigitalMarketingProjectData {
  items: DescriptionManHour[];
}

export interface GraphicDesignsProjectData {
  items: DescriptionManHour[];
}

export interface CorporateWebsitesData {
  uniquePages: number;
  repetitivePages: number;
  shortPages: number;
  addOns: AddOn[];
  thirdPartyCosts: ThirdPartyCost[];
  maintenance: MaintenanceItem[];
}

export interface CustomSolutionsProjectData {
  modules: ModuleItem[];
  addOns: AddOn[];
  thirdPartyCosts: ThirdPartyCost[];
  apiIntegrations: APIIntegration[];
  maintenance: MaintenanceItem[];
}

// Union type for project data
export type ProjectData = 
  | AIChatsotProjectData
  | PSGProjectData
  | EcommerceProjectData
  | DigitalMarketingProjectData
  | GraphicDesignsProjectData
  | CorporateWebsitesData
  | CustomSolutionsProjectData;

// Complete quotation interface
export interface Quotation extends BaseQuotation {
  projectData: ProjectData;
}

export interface QuotationVersion {
  id: string;
  quotationId: string;
  version: number;
  quotation: Quotation;
  createdAt: string;
  createdBy: string;
}