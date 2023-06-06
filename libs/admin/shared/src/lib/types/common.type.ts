import { tokensConfig } from '../constants/common';

export type NavRouteOption = {
  label: string;
  link: string;
  isDisabled?: boolean;
};

export type NavRouteOptions = NavRouteOption[];

export type PageRoutes = {
  route: string;
  navRoutes: NavRouteOptions;
  title: string;
};

export type TokenRecord = typeof tokensConfig;
export type TokensType = keyof typeof tokensConfig;
export type Tokens = typeof tokensConfig[TokensType];

export type StatusTypes =
  | 'active'
  | 'inactive'
  | 'temp-inactive'
  | 'draft'
  | 'success'
  | 'fulfilled'
  | 'unavailable'
  | 'temp-unavailable';
