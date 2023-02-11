export interface SignUpUser {
  email: string;
  password: string;
}

export interface SignInUser {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  user_id: string;
  name?: any;
  email: string;
  phone?: any;
  occupation?: any;
  photoURL?: any;
  dob?: any;
  gender?: 'male' | 'female' | 'other';
  country?: any;
  state?: any;
  city?: any;
  about?: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
