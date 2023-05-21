export const cols = [
  {
    field: 'name',
    header: 'Name',
    sortType: 'string',
    searchField: ['name'],
    width: '23.75%',
  },
  {
    field: 'segment',
    header: 'Segment',
    sortType: 'string',
    searchField: ['propertyCategory.label'],
    width: '23.75%',
  },
  {
    field: 'address',
    header: 'Address',
    sortType: 'string',
    searchField: ['address.state'],
    width: '23.75%',
  },
  {
    field: 'email',
    header: 'Email',
    sortType: 'string',
    searchField: ['emailId'],
    width: '23.75%',
  },
  {
    field: 'contact',
    header: 'contact',
    sortType: 'string',
    searchField: ['contact?.number'],
    width: '23.75%',
  },
];
