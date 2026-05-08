export type SkinType = "Dry" | "Oily" | "Combination" | "Sensitive" | "All";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  skin_type: SkinType | string;
  image_url: string;
  created_at?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  payment_method: "cod" | "manual_transfer";
  payment_proof_url: string | null;
  status: string;
  created_at: string;
}
