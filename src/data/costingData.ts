import { CostVersion, CostItem, Quotation } from "@/types/costing";

// Mock Cost Items for current version
export const mockCostItems: CostItem[] = [
  // Per manhour costs
  { id: "1", type: "per_manhour", description: "Unique Pages", cost: 150, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "2", type: "per_manhour", description: "Repetitive Pages", cost: 100, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "3", type: "per_manhour", description: "Short Pages", cost: 75, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "4", type: "per_manhour", description: "Design", cost: 120, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "5", type: "per_manhour", description: "Programming", cost: 140, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  
  // Fixed costs
  { id: "6", type: "fixed", description: "AI Chatbot", cost: 5000, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "7", type: "fixed", description: "PSG Package A", cost: 8000, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "8", type: "fixed", description: "PSG Package B", cost: 12000, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "9", type: "fixed", description: "PSG Package C", cost: 18000, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" }
];

// Mock Cost Versions
export const mockCostVersions: CostVersion[] = [
  {
    id: "1",
    version: "v1.0",
    costItems: mockCostItems,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "1", // John Smith
    isActive: true
  },
  {
    id: "2",
    version: "v0.9",
    costItems: [
      { id: "1", type: "per_manhour", description: "Unique Pages", cost: 140, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "2", type: "per_manhour", description: "Repetitive Pages", cost: 90, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "3", type: "per_manhour", description: "Short Pages", cost: 70, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "4", type: "per_manhour", description: "Design", cost: 110, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "5", type: "per_manhour", description: "Programming", cost: 130, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "6", type: "fixed", description: "AI Chatbot", cost: 4500, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "7", type: "fixed", description: "PSG Package A", cost: 7500, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "8", type: "fixed", description: "PSG Package B", cost: 11000, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "9", type: "fixed", description: "PSG Package C", cost: 16000, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" }
    ],
    createdAt: "2023-12-01T00:00:00Z",
    createdBy: "1",
    isActive: false
  }
];

// Mock Quotations
export const mockQuotations: Quotation[] = [
  {
    id: "1",
    clientId: "1", // Tech Innovations Pte Ltd
    clientPOCId: "1", // Michael Tan
    salesPIC: "2", // Sarah Johnson
    billingAddress: "1 Raffles Place, Singapore 048616",
    projectType: "Corporate Websites",
    totalCost: 15000,
    costVersionId: "1",
    version: 1,
    createdAt: "2024-01-06T00:00:00Z",
    updatedAt: "2024-01-06T00:00:00Z",
    projectData: {
      uniquePages: 10,
      repetitivePages: 20,
      shortPages: 5,
      addOns: [
        {
          id: "1",
          type: "internal",
          title: "Custom Contact Form",
          designHours: 8,
          programmingHours: 16
        }
      ],
      thirdPartyCosts: [
        {
          id: "1",
          vendor: "Payment Gateway Provider",
          cost: 500
        }
      ],
      maintenance: [
        {
          id: "1",
          description: "Monthly content updates",
          manHours: 4
        }
      ]
    }
  }
];

// Helper functions
export const getActiveCostVersion = () => 
  mockCostVersions.find(version => version.isActive);

export const getCostByDescription = (description: string) =>
  mockCostItems.find(item => item.description === description)?.cost || 0;

export const getQuotationsByClient = (clientId: string) =>
  mockQuotations.filter(quotation => quotation.clientId === clientId);