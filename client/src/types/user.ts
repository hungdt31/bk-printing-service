export interface LoginResponse {
  data: {
    customerInfo: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export interface ProfileResponse {
  profile: {
    id: number;
    username: string;
    email: string;
    role: string;
    balance: number;
    dob: Date;
    phone: string;
    created_at: Date;
  };
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface SignUpResponse {
  data: {
    id: number;
    name: string;
    email: string;
  };
  message: string;
}

export interface UpdateProfileResponse {
  data: {
    id: number;
    username: string;
    email: string;
    phone: string;
    dob: Date;
    role: string;
    balance: number;
  };
  message: string;
}
