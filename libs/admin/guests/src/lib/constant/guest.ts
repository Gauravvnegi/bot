export const guestCols = [
  {
    field: 'fullName',
    header: 'Guest / Company',
    sortType: 'string',
    searchField: ['fullName', 'company'],
  },
  {
    field: 'email',
    header: 'Email Id',
    sortType: 'string',
    searchField: ['email'],
  },
  {
    field: `phoneNumber`,
    header: 'Phone No.',
    sortType: 'number',
    searchField: ['phoneNumber', 'countryCode'],
  },
  {
    field: 'totalSpend',
    header: 'Total Spend',
    sortType: 'number',
    isSearchDisabled: true,
  },
];
