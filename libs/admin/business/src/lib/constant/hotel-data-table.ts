export const BrandTableName = 'Property / Outlet';
export const HotelTableName = 'Outlet';

export const cols = [
  {
    field: 'name',
    header: 'Name / Type',
    sortType: 'string',
    searchField: ['name'],
    width: '29%',
  },
  {
    field: 'workingDays',
    header: 'Working days / Timings',
    sortType: 'string',
    searchField: [
      'dayOfOperationStart',
      'dayOfOperationEnd',
      'timeDayStart',
      'timeDayEnd',
    ],
    width: '23.75%',
    isSortDisabled: true,
  },
  {
    field: 'contact',
    header: 'Contact / Email',
    sortType: 'string',
    searchField: ['contact.number', 'contact.countryCode', 'emailId'],
    width: '23.75%',
    isSortDisabled: true,
  },
  {
    field: 'url',
    header: 'URL',
    sortType: 'string',
    width: '23.75%',
    isSearchDisabled: true,
    isSortDisabled: true,
  },
  {
    field: 'status',
    header: 'Actions',
    sortType: 'number',
    isSearchDisabled: true,

    width: '23.75%',
  },
];
