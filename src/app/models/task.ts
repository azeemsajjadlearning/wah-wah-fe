export interface Task {
  id: number;
  title: string;
  completed?: boolean;
  due_date?: string | null;
  notes?: string | null;
  priority?: number | null;
  user_id: number;
  created_on?: string;
  updated_on?: string;
}
