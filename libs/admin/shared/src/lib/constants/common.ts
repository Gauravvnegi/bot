export function t<V extends string, T extends { [key in string]: V }>(o: T): T {
  return o;
}

export const tokensConfig = t({
  accessToken: 'x-access-token',
  refreshToken: 'x-access-refresh-token',
  userId: 'x-userId',
  siteId: 'x-siteId',
  brandId: 'x-brandId',
  entityId: 'x-entityId',
  selectedProduct: 'selectedProduct',
  userAgent: 'custom-user-agent',
});
