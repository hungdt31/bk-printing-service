export interface LoginResponse {
  data: {
    customerInfo: {
      id: number;
      name: string;
      email: string;
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
