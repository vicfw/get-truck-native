import { User } from "../../../globalTypes";

export interface AuthUserResponse {
  token: string;
  data: { user: User };
  status: string;
}

export interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface LoginUserBody {
  email: string;
  password: string;
}

export interface UpdateUserResponse {
  status: string;
  user: User;
}

export interface UpdateUserBody {
  name?: string | undefined;
  email?: string | undefined;
  photo?: string | undefined;
  notificationToken?: string | undefined;
}

export interface ForgotPasswordEmailResponse {
  status: string;
  message: string;
}

export interface ForgotPasswordEmailBody {
  email: string;
}

export interface ForgotPasswordValidationResponse {
  status: string;
  message: string;
}

export interface ForgotPasswordValidationBody {
  code: string;
}
export interface ForgotPasswordResetResponse {
  status: string;
  message: string;
}

export interface ForgotPasswordResetBody {
  token: string;
  password: string;
  confirmPassword: string;
}
