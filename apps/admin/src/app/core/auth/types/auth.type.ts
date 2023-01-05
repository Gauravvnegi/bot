export type LoginParam = {
  email: string;
  password: string;
};

export type ForgotPasswordParam = {
  email: string;
};

export type ChangePasswordParam = {
  token: string;
  password: string;
};

export type RefreshTokenParam = {
  'x-access-refresh-token': string;
  'x-userId': string;
};

export type ManagingOption = {
  id: number;
  label: string;
  url: string;
};
