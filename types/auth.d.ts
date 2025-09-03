export type SignInState = {
  success: boolean;
  error: string | null;
};

export type AuthState = {
  success: boolean;
  error: string; // always a string, never null
  unverified?: boolean;
};
