export type Recurrence = "none" | "weekly" | "monthly" | "yearly";

export type BillStatus = "upcoming" | "due_soon" | "overdue" | "paid";

export type Category = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string | null;
  is_default: boolean;
  created_at: string;
};

export type Bill = {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  amount: number;
  currency: string;
  due_date: string;
  recurrence: Recurrence;
  status: BillStatus;
  reminder_offset_days: number;
  notes: string | null;
  paid_at: string | null;
  parent_bill_id: string | null;
  created_at: string;
  updated_at: string;
};

export type BillWithCategory = Bill & {
  category: Category | null;
};
