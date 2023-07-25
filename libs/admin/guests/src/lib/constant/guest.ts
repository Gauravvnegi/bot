export const guestCols = [
  {
    field: 'name',
    header: 'Name / Code',
    sortType: 'string',
    width: '25%',
    searchField: ['name', 'code'],
  },
  {
    field: 'email',
    header: 'Email Id',
    sortType: 'string',
    width: '20%',
    searchField: ['email'],
  },
  {
    field: `phoneNumber`,
    header: 'Phone No.',
    sortType: 'string',
    width: '20%',
    searchField: ['phoneNumber'],
  },
  {
    field: `dob`,
    header: 'Date Of Birth',
    sortType: 'string',
    width: '15%',
    searchField: ['dob'],
  },
  {
    field: `created`,
    header: 'Created',
    sortType: 'string',
    width: '15%',
    searchField: ['created'],
  },
];
