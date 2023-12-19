export const card = {
  tabFilterItems: [
    {
      label: 'GTM',
      value: 'GTM',
      total: 0,
    },
    {
      label: 'All',
      value: 'ALL',
      total: 0,
    },
  ],
  list: {
    tabFilterItems: [
      {
        label: 'To-Do',
        value: 'TODO',
        total: 0,
      },
      {
        label: 'In-Progress',
        value: 'IN_PROGRESS',
        total: 0,
      },
      {
        label: 'Resolved',
        value: 'RESOLVED',
        total: 0,
      },
      {
        label: 'Timed-Out',
        value: 'TIMEOUT',
        total: 0,
      },

      {
        label: 'Positive Feedback',
        value: 'NOACTION',
        total: 0,
      },

      {
        label: 'All',
        value: 'ALL',
        total: 0,
      },
    ],
  },
  num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  feedbackState: {
    resolved: 'RESOLVED',
  },
  pagination: {
    offset: 0,
    limit: 20,
  },
  totalRecords: 0,
  sortList: [
    { label: 'Latest', value: 'created', order: 'DESC' },
    { label: 'Name A -> Z', value: 'name', order: 'ASC' },
    { label: 'Name Z -> A', value: 'name', order: 'DESC' },
  ],
  buttonConfig: [
    {
      button: true,
      label: 'Edit Details',
      icon: 'assets/svg/user.svg',
    },
    {
      button: true,
      label: 'Map Details',
      icon: 'assets/svg/user.svg',
    },
    {
      button: true,
      label: 'Raise Request',
      icon: 'assets/svg/requests.svg',
    },
  ],
};
