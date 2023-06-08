import { filtersChips } from '@hospitality-bot/admin/library';
import { Cols, Filter } from '@hospitality-bot/admin/shared';

export enum MenuTabValue {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  SNACKS = 'SNACKS',
  DINNER = 'DINNER',
}

export enum TabValue {
  ALL = 'ALL',
  RESTAURANT = 'RESTAURANT',
  BAR = 'BAR',
  BANQUET = 'BANQUET',
  CONFERENCE_ROOM = 'CONFERENCE_ROOM',
}

export enum TableValue {
  allOutlets = 'ALL_OUTLETS',
  menu = 'MENU',
  menuList = 'MENU_LIST',
  foodItems = 'FOOD_ITEMS'
}

export const filters: Filter<TabValue, string>[] = [
  {
    label: 'All',
    content: '',
    value: TabValue.ALL,
    disabled: false,
    total: 0,
  },
  {
    label: 'Restaurant',
    content: '',
    value: TabValue.RESTAURANT,
    disabled: false,
    total: 0,
  },
  {
    label: 'Bar',
    content: '',
    value: TabValue.BAR,
    disabled: false,
    total: 0,
  },
  {
    label: 'Banquet',
    content: '',
    value: TabValue.BANQUET,
    disabled: false,
    total: 0,
  },
  {
    label: 'Conference Room',
    content: '',
    value: TabValue.CONFERENCE_ROOM,
    disabled: false,
    total: 0,
  },
];

export const cols: Record<TableValue, Cols[]> = {
  [TableValue.allOutlets]: [
    {
      field: 'name',
      header: 'Outlet Name',
      sortType: 'string',
      width: '22%',
    },
    {
      field: 'type',
      header: 'Type',
      sortType: 'string',
      width: '22%',
    },
    {
      field: 'sales',
      header: 'Total Sales',
      sortType: 'number',
      width: '15%',
    },
    {
      field: 'area',
      header: 'Area',
      sortType: 'number',
      width: '15%',
    },
    {
      field: 'status',
      header: 'Action/Status',
      sortType: 'string',
      width: '20%',
      isSearchDisabled: true,
    },
  ],

  [TableValue.menu]: [
    {
      field: 'code',
      header: 'Code',
      sortType: 'string',
    },
    {
      field: 'name',
      header: 'Name/Description',
      sortType: 'string',
    },
    {
      field: 'type',
      header: 'Type',
      sortType: 'string',
    },
    {
      field: 'hsnCode',
      header: 'HSN Code',
      sortType: 'number',
    },
    {
      field: 'category',
      header: 'Category',
      sortType: 'string',
      isSearchDisabled: true,
    },
    {
      field: 'kitchenDept',
      header: 'Kitchen Dep',
      sortType: 'string',
    },
    {
      field: 'dineIn',
      header: 'Dine in / Delivery',
      sortType: 'string',
    },
    {
      field: 'preparationTime',
      header: 'Preparation Time',
      sortType: 'number',
    },
    {
      field: 'unit',
      header: 'Qty/Unit',
      sortType: 'number',
    },
  ],

  [TableValue.menuList]: [
    {
      field: 'code',
      header: 'Code',
      sortType: 'number',
    },
    {
      field: 'name',
      header: 'Name/Code',
      sortType: 'string',
    },
    {
      field: 'type',
      header: 'Type',
      sortType: 'string',
    },
    {
      field: 'hsnCode',
      header: 'HSN Code',
      sortType: 'number',
    },
    {
      field: 'category',
      header: 'Category',
      sortType: 'string',
    },
    {
      field: 'preparationTime',
      header: 'PreparationTime',
      sortType: 'number',
    },
    {
      field: 'unit',
      header: 'Qty/Unit',
      sortType: 'number',
    },
    {
      field: 'status',
      header: 'Action/Status',
      sortType: 'string',
      isSearchDisabled: true,
    },
  ],

  [TableValue.foodItems]: [
    {
      field: 'foodCategory',
      header: 'Food Category',
      sortType: 'string',
    },
    {
      field: 'type',
      header: 'Type',
      sortType: 'number',
    },
    {
      field: 'action',
      header:'Action',
      width: '10%',
      isHidden: true,
    }
  ],
};

export const chips = filtersChips.map((item) => ({ ...item }));

export const title = 'All Outlets';

export const menuList = [
  {
    code: 334,
    name: 'Sandwich',
    type: 'Veg',
    hsnCode: 2442,
    category: 'Kitchen',
    price: 'INR 500/Dine-in',
    preparationTime: '5 minutes',
    unit: '100 grams',
    status: 'ACTIVE',
  },
  {
    code: 334,
    name: 'Sandwich',
    type: 'Veg',
    hsnCode: 2442,
    category: 'Kitchen',
    price: 'INR 500/Dine-in',
    preparationTime: '5 minutes',
    unit: '100 grams',
    status: 'ACTIVE',
  },
  {
    code: 334,
    name: 'Sandwich',
    type: 'Veg',
    hsnCode: 2442,
    category: 'Kitchen',
    price: 'INR 500/Dine-in',
    preparationTime: '5 minutes',
    unit: '100 grams',
    status: 'ACTIVE',
  },
  {
    code: 334,
    name: 'Sandwich',
    type: 'Veg',
    hsnCode: 2442,
    category: 'Kitchen',
    price: 'INR 500/Dine-in',
    preparationTime: '5 minutes',
    unit: '100 grams',
    status: 'ACTIVE',
  },
  {
    code: 334,
    name: 'Sandwich',
    type: 'Veg',
    hsnCode: 2442,
    category: 'Kitchen',
    price: 'INR 500/Dine-in',
    preparationTime: '5 minutes',
    unit: '100 grams',
    status: 'ACTIVE',
  },
];
