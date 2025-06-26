export interface SignUpUser {
  name: string;
  email: string;
  password: string;
}

export interface SignInUser {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  occupation: string | null;
  photo_url: string | null;
  dob: string | null;
  gender: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  about: string | null;
  is_verified: boolean;
  created_on: string;
  updated_on: string;
}
