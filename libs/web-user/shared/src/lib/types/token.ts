export interface IToken {
  token: string;
}

export interface ITokenInfo {
  templateId: string;
  expiry: number;
  journey: string;
  reservationId: string;
  entityId: string;
  selectedProducts: string;
}
