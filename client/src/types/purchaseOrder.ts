export interface PurchaseOrderResponse {
  message: string;
  data: {
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
  }[]
}