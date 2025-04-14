export interface PurchaseOrder {
  purchase_id: number;
  method: "MOMO" | "ZALOPAY" | "BANKING";
  amount: number;
  price: number;
  status: "PAID" | "UNPAID" | "CANCELED";
  created_at: Date;
  updated_at: Date;
  user: {
    user_id: number;
    username: string;
    email: string;
    avatar: {
      url: string;
    }
  }
}

export interface PurchaseOrderResponse {
  message: string;
  data: PurchaseOrder[];
}

export interface UserPurchaseOrdersResponse {
  message: string;
  data: PurchaseOrder[];
}