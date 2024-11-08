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
    name: string;
    email: string;
    type: string
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
