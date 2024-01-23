export type MenuForm = {
  orderInformation: OrderInformation;
};

export type OrderInformation = {
  search: string;
  tableNumber: string[];
  staff: string;
  guest: string;
  numberOfPersons: string;
  menu: string[];
};
