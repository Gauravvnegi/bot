export interface RatePlan {
    id: string;
    label: string;
    value: number;
  }
  
  export interface BarPrice {
    isBase: boolean;
    price: number;
    baseId: string;
    variablePrice: number;
    ratePlans: RatePlan[];
    childBelowFive: number;
    chileFiveToTwelve: number;
    adult: number;
    exceptions: any[]; // You might want to replace 'any' with a specific type
    id: string;
    label: string;
  }
  
  export interface RoomType {
    label: string;
    value: string;
  }
  
export interface BarPriceFormData {
    roomType: string[];
    barPrices: BarPrice[];
    roomTypes: RoomType[];
  }