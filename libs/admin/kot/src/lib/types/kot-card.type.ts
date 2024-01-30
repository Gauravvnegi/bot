export type MenuItem = {
  name: string;
  instructions: string;
  isExpandedInstruction: boolean;
  quantity: number;
};

export type Config = {
  id: string;
  name: string;
  time: string;
  orderNo: number;
  kotNo: number;
  kotType: string;
  menuItem: MenuItem[];
  instructions: string;
};
