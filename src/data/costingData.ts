import { CostVersion, CostItem, Quotation } from "@/types/costing";

// Mock Cost Items for current version
export const mockCostItems: CostItem[] = [
  // Per manhour costs
  { id: "1", type: "per_manhour", description: "Unique Pages", costSGD: 150, costMYR: 480, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "2", type: "per_manhour", description: "Repetitive Pages", costSGD: 100, costMYR: 320, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "3", type: "per_manhour", description: "Short Pages", costSGD: 75, costMYR: 240, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "4", type: "per_manhour", description: "Design", costSGD: 120, costMYR: 385, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "5", type: "per_manhour", description: "Programming", costSGD: 140, costMYR: 450, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  
  // Fixed costs
  { id: "6", type: "fixed", description: "AI Chatbot", costSGD: 5000, costMYR: 16000, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "7", type: "fixed", description: "PSG Package A", costSGD: 8000, costMYR: 25600, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "8", type: "fixed", description: "PSG Package B", costSGD: 12000, costMYR: 38400, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "9", type: "fixed", description: "PSG Package C", costSGD: 18000, costMYR: 57600, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" }
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
      { id: "1", type: "per_manhour", description: "Unique Pages", costSGD: 140, costMYR: 450, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "2", type: "per_manhour", description: "Repetitive Pages", costSGD: 90, costMYR: 290, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "3", type: "per_manhour", description: "Short Pages", costSGD: 70, costMYR: 225, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "4", type: "per_manhour", description: "Design", costSGD: 110, costMYR: 355, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "5", type: "per_manhour", description: "Programming", costSGD: 130, costMYR: 420, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "6", type: "fixed", description: "AI Chatbot", costSGD: 4500, costMYR: 14400, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "7", type: "fixed", description: "PSG Package A", costSGD: 7500, costMYR: 24000, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "8", type: "fixed", description: "PSG Package B", costSGD: 11000, costMYR: 35200, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" },
      { id: "9", type: "fixed", description: "PSG Package C", costSGD: 16000, costMYR: 51200, createdAt: "2023-12-01T00:00:00Z", updatedAt: "2023-12-01T00:00:00Z" }
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
    projectName: "Corporate Website Redesign",
    projectType: "Corporate Websites",
    totalCost: 15000,
    currency: "SGD",
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

export const getCostByDescription = (description: string, currency: 'SGD' | 'MYR' = 'SGD') => {
  const item = mockCostItems.find(item => item.description === description);
  return currency === 'SGD' ? (item?.costSGD || 0) : (item?.costMYR || 0);
};

export const getQuotationsByClient = (clientId: string) =>
  mockQuotations.filter(quotation => quotation.clientId === clientId);