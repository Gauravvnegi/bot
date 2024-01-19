export const guestCols = [
  {
    field: 'name',
    header: 'Name / Code',
    sortType: 'string',
    width: '25%',
    searchField: ['name', 'code'],
  },
  {
    field: 'guestType',
    header: 'Type',
    sortType: 'string',
    width: '20%',
  },
  {
    field: 'email',
    header: 'Email Id',
    sortType: 'string',
    width: '20%',
  },
  {
    field: `mobileNumber`,
    header: 'Phone No.',
    sortType: 'string',
    width: '20%',
  },
  {
    field: `dob`,
    header: 'Date Of Birth',
    sortType: 'string',
    width: '15%',
    searchField: ['dobString'],
  },
  {
    field: `created`,
    header: 'Created',
    sortType: 'string',
    width: '15%',
    searchField: ['createdString'],
  },
];
