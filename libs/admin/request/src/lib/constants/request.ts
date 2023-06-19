export const request = {
  priority: [
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
    { label: 'ASAP', value: 'ASAP' },
  ],
  status: [
    { label: 'To-Do', value: 'TODO' },
    // { label: 'To-Do', value: 'Immediate' },
    { label: 'Timeout', value: 'Timeout' },
    { label: 'Closed', value: 'Closed' },
  ],
  tabFilter: [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Pending',
      content: '',
      value: 'Pending',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'To-Do',
      content: '',
      value: 'TODO',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Closed',
      content: '',
      value: 'Closed',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Timed-Out',
      content: '',
      value: 'Timeout',
      disabled: false,
      total: 0,
      chips: [],
    },
  ],
  filter: ['ASAP', 'High', 'Medium'],
  sort: [
    { label: 'Latest', value: '', order: '' },
    { label: 'Room Ascending', value: 'roomNo', order: 'ASC' },
    { label: 'Room Descending', value: 'roomNo', order: 'DESC' },
    { label: 'Function Code', value: 'itemCode', order: 'ASC' },
  ],
  cmsServices: 'cms services',
  kiosk: 'KIOSK',
  images: {
    raiseRequest: {
      url: 'assets/svg/request-add-btn.svg',
      alt: 'add request',
    },
    filter: {
      url: 'assets/svg/Filter-Icon.svg',
      alt: 'filter',
    },
    search: {
      url: 'assets/svg/search.svg',
      alt: 'search',
    },
    room: {
      url: 'assets/svg/room.svg',
      alt: 'room',
    },
    user: {
      url: 'assets/svg/user-01.svg',
      alt: 'user',
    },
    shopping: {
      url: 'assets//images/shopping-list.png',
      alt: 'Item Code',
    },
    pyramid: { url: 'assets/images/pyramid.png', alt: 'pyramid' },
    hourglass: { url: 'assets/images/hourglass.png', alt: 'hourglass' },
    comment: { url: 'assets/svg/comments.svg', alt: 'comment' },
  },
};
