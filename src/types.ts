export type View = 'home' | 'list' | 'signin' | 'signup';

export interface Product {
  id: number;
  created_at: string;
  user_id: string;
  first_name: string;
  last_name: string;
  height: number;
  weight: number;
  age: number;
}
