export type NavRouteOptions = {
  label: string;
  link: string;
  isDisabled?: boolean;
}[];

export type PageRoutes = {
  route: string;
  navRoutes: NavRouteOptions;
  title: string;
};
