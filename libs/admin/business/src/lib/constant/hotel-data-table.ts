export const BrandTableName = 'Property / Outlet';
export const HotelTableName = 'Outlet';

export const cols = [
  {
    field: 'name',
    header: 'Name / Type',
    sortType: 'string',
    searchField: ['name'],
    width: '27%',
  },
  {
    field: 'workingDays',
    header: 'Working days / Timings',
    sortType: 'string',
    searchField: ['propertyCategory.label'],
    width: '23.75%',
  },
  {
    field: 'contact',
    header: 'Contact / Email',
    sortType: 'string',
    searchField: ['contact', 'emailId'],
    width: '23.75%',
  },
  {
    field: 'url',
    header: 'URL',
    sortType: 'string',
    searchField: ['emailId'],
    width: '23.75%',
  },
  {
    field: 'status',
    header: 'Actions',
    isSortDisabled: true,
    isSearchDisabled: true,

    width: '23.75%',
  },
];
