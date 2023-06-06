import { filtersChips } from '@hospitality-bot/admin/library';
import { Cols, Filter } from '@hospitality-bot/admin/shared';

export enum TableValue {
  ALL = 'ALL',
  RESTAURANT = 'RESTAURANT',
  BAR = 'BAR',
  BANQUET = 'BANQUET',
  CONFERENCE_ROOM = 'CONFERENCE_ROOM',
}

export enum MenuTableValue {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  SNACKS = 'SNACKS',
  DINNER = 'DINNER'
}

export const filters: Filter<TableValue, string>[] = [
  {
    label: 'All',
    content: '',
    value: TableValue.ALL,
    disabled: false,
    total: 0,
  },
  {
    label: 'Restaurant',
    content: '',
    value: TableValue.RESTAURANT,
    disabled: false,
    total: 0,
  },
  {
    label: 'Bar',
    content: '',
    value: TableValue.BAR,
    disabled: false,
    total: 0,
  },
  {
    label: 'Banquet',
    content: '',
    value: TableValue.BANQUET,
    disabled: false,
    total: 0,
  },
  {
    label: 'Conference Room',
    content: '',
    value: TableValue.CONFERENCE_ROOM,
    disabled: false,
    total: 0,
  },
];

export const cols: Cols[] = [
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
];

export const menuCols: Cols[] = [
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
]

export const menuListCols: Cols[] = [
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
];


export const chips = filtersChips.map((item) => ({ ...item }));

export const title = 'All Outlets';

export const records = [
  {
    id: '3a2beede-c18f-4912-b9b1-54d1a53ebf9e',
    outletName: 'Outlet 1',
    type: 'Restaurant',
    totalSales: '20000',
    area: '200 Sq.Ft',
    status: 'ACTIVE',
  },
  {
    id: '3a2beede-c18f-4912-b9b1-54d1a53ebf9e',
    outletName: 'Outlet 2',
    type: 'Restaurant',
    totalSales: '30000',
    area: '300 Sq.Ft',
    status: 'ACTIVE',
  },
  {
    id: '3a2beede-c18f-4912-b9b1-54d1a53ebf9e',
    outletName: 'Outlet 3',
    type: 'Restaurant',
    totalSales: '40000',
    area: '400 Sq.Ft',
    status: 'ACTIVE',
  },
  {
    id: '3a2beede-c18f-4912-b9b1-54d1a53ebf9e',
    outletName: 'Outlet 4',
    type: 'Restaurant',
    totalSales: '50000',
    area: '500 Sq.Ft',
    status: 'ACTIVE',
  },
  {
    id: '3a2beede-c18f-4912-b9b1-54d1a53ebf9e',
    outletName: 'Outlet 5',
    type: 'Restaurant',
    totalSales: '60000',
    area: '600 Sq.Ft',
    status: 'ACTIVE',
  }
];

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
    status: 'ACTIVE'
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
    status: 'ACTIVE'
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
    status: 'ACTIVE'
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
    status: 'ACTIVE'
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
    status: 'ACTIVE'
  },
]
