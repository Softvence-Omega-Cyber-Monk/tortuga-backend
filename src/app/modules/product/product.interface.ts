// src/modules/product/product.interface.ts

export enum ProductCategory {
  BASE_SYSTEM = "BASE_SYSTEM",
  MOTHERBOARD = "MOTHERBOARD",
  CPU = "CPU",
  RAM = "RAM",
  STORAGE_DEVICE = "STORAGE_DEVICE",
  NETWORK_CONNECTIVITY = "NETWORK_CONNECTIVITY",
  GRAPHICS_CARD = "GRAPHICS_CARD",
  STORAGE_CONTROLLER = "STORAGE_CONTROLLER",
  OPERATING_SYSTEM = "OPERATING_SYSTEM",
}

// CPU Compatibility Attributes
export interface CPUAttributes {
  brand: string; // Intel, AMD
  family: string; // Xeon Scalable, EPYC, Core i9
  coreCount: number;
  tdpRating: number; // in Watts
}

// RAM Compatibility Attributes
export interface RAMAttributes {
  platformType: string; // DDR4, DDR5
  formFactor: string; // DIMM, SO-DIMM
  technology: string; // ECC, Non-ECC
  speed: number; // MHz
  capacity: number; // GB
}

// Storage Device Compatibility Attributes
export interface StorageDeviceAttributes {
  interfaceType: string; // NVMe, SATA, SAS
  formFactor: string; // M.2, 2.5", 3.5", U.2
  capacity: number; // GB
  tier: string; // NVMe, SSD, HDD
}

// Network Connectivity Compatibility Attributes
export interface NetworkConnectivityAttributes {
  formFactor: string; // PCIe, Onboard, OCP
  speed: string; // 1GbE, 10GbE, 25GbE, 40GbE, 100GbE
  type: string; // Ethernet, Infiniband
}

// Graphics Card Compatibility Attributes
export interface GraphicsCardAttributes {
  connectorType: string; // PCIe Gen3, PCIe Gen4, PCIe Gen5
  slotWidth: number; // 1-slot, 2-slot, 3-slot
  coolingType: string; // Active, Passive
  model: string; // H100, H200, B200, L40S, RTX 6000 ADA
  vram: number; // GB
}

// Storage Controller/RAID Card Compatibility Attributes
export interface StorageControllerAttributes {
  formFactor: string; // PCIe
  pcieInterface: string; // Gen3 x8, Gen4 x16
  supportedRAID: string[]; // RAID 0, 1, 5, 6, 10
}

// Union type for all attributes
export type ProductAttributes =
  | CPUAttributes
  | RAMAttributes
  | StorageDeviceAttributes
  | NetworkConnectivityAttributes
  | GraphicsCardAttributes
  | StorageControllerAttributes
  | Record<string, any>;

// Compatibility Rules Interface
export interface CompatibilityRule {
  category: ProductCategory;
  requiredAttributes: Partial<ProductAttributes>;
}

// Main Product Interface
export interface IProduct {
  _id?: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  imageUrl?: string;
  company: string;
  
  // Product-specific attributes based on category
  attributes: ProductAttributes;
  
  // Compatibility rules - which products this is compatible with
  compatibilityRules: CompatibilityRule[];

  keyFeatures: string[];
  galleryUrls?: string[];
  
  // Admin controls
  isActive: boolean;
  isEOL: boolean; // End of Life
  stock: number;
  sku: string;
  
  // Metadata
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// DTO for creating products
export interface CreateProductDTO {
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  attributes: ProductAttributes;
  keyFeatures?: string[];
  galleryUrls?: string[];
  compatibilityRules: CompatibilityRule[];
  isActive?: boolean;
  isEOL?: boolean;
  stock: number;
  sku: string;
}

// DTO for updating products
export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  imageUrl?: string;
}

// Response for compatible products query
export interface CompatibleProductsResponse {
  category: ProductCategory;
  products: IProduct[];
}