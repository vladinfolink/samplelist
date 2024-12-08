export interface Product {
  id: string;
  client_id: string;
  proposition_id?: string;
  agreement_id?: string;
  name: string;
  description?: string;
  type: "DEBIT" | "CREDIT";
  subtype: "Consumer" | "Business";
  status: "TERMINATED" | "ACTIVE" | "INACTIVE" | "SUSPENDED";
  is_global: boolean;
  version: number;
  created_at: {
    seconds: string;
    nanos: number;
  };
  created_by: string;
  updated_at?: {
    seconds: string;
    nanos: number;
  };
  updated_by?: string;
  active_start?: {
    seconds: string;
    nanos: number;
  };
  active_end?: {
    seconds: string;
    nanos: number;
  };
  network?: "Mastercard" | "Visa"; // Adding this for UI purposes
  badges?: Array<"M" | "K">; // Adding this for UI purposes
}

export const mockProducts: Product[] = Array(500)
  .fill(null)
  .map((_, index) => {
    const baseProducts = [
      {
        name: "Pliant Corp Credit",
        description: "Commercial credit card product",
        type: "DEBIT" as const,
        subtype: "Business" as const,
        network: "Mastercard" as const,
        badges: ["M", "K"] as Array<"M" | "K">,
      },
      {
        name: "Tita Debit",
        description: "Consumer prepaid debit card",
        type: "DEBIT" as const,
        subtype: "Consumer" as const,
        network: "Mastercard" as const,
        badges: ["K"] as Array<"M" | "K">,
      },
      {
        name: "Premier Card AUS",
        description: "Premium commercial credit card",
        type: "CREDIT" as const,
        subtype: "Business" as const,
        network: "Visa" as const,
        badges: ["K", "M"] as Array<"M" | "K">,
      },
      {
        name: "Velocity Debit",
        description: "Consumer debit card with rewards",
        type: "DEBIT" as const,
        subtype: "Consumer" as const,
        network: "Visa" as const,
        badges: ["K"] as Array<"M" | "K">,
      },
      {
        name: "Nexus Entrepreneurs US & CA",
        description: "Business debit card for entrepreneurs",
        type: "DEBIT" as const,
        subtype: "Business" as const,
        network: "Mastercard" as const,
        badges: undefined,
      },
    ];

    // Rest of the code remains the same
    const baseProduct = baseProducts[index % baseProducts.length];
    const number = Math.floor(index / baseProducts.length) + 1;
    const statuses = ["ACTIVE", "INACTIVE", "SUSPENDED", "TERMINATED"] as const;

    return {
      id: `0374f855-9593-43ea-bd3d-8a54429${index.toString().padStart(4, "0")}`,
      client_id: `0374f855-9593-43ea-bd3d-8a544299727c`,
      proposition_id: `0374f855-9593-43ea-bd3d-8a544299eaa`,
      agreement_id: `0374f855-9593-43ea-bd3d-8a544299bbb`,
      name: number === 1 ? baseProduct.name : `${baseProduct.name} ${number}`,
      description: baseProduct.description,
      type: baseProduct.type,
      subtype: baseProduct.subtype,
      status: statuses[index % statuses.length],
      is_global: true,
      version: Number((Math.random() * 3 + 1).toFixed(1)),
      created_at: {
        seconds: "1728900532",
        nanos: 128002000,
      },
      created_by: "John Doe",
      network: baseProduct.network,
      badges: baseProduct.badges,
    };
  });
