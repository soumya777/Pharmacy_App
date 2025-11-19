export interface Medicine {
  id: string;
  fullName: string;
  notes: string;
  price: number;
  quantity: number;
  category: string;
  brand?: string;
  expiryDate: string;
}

export interface AddMedicineDto {
  fullName: string;
  notes: string;
  price: number;
  quantity: number;
  category: string;
  brand?: string;
  expiryDate: string;
}