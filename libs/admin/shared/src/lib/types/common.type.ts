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
