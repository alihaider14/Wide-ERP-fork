export type TStockZonePrompt = {
  data: { _id?: string; name?: string };
  open: boolean;
};

export type TStockZone = {
  _id: string;
  name: string; 
  description?: string;
  createdAt: string;
  updatedAt: string;
  products: number;
  stock: string;
};