export interface Task {
  _id: string;
  title: string;
  notes: string;
  completed: boolean;
  dueDate: string | null;
  priority: 0 | 1 | 2;
}
