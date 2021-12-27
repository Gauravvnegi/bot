export const feedback = {
  chips: {
    feedbackDatatable: [
      { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
      {
        label: 'High Potential ',
        icon: '',
        value: 'HIGHPOTENTIAL',
        total: 0,
        isSelected: false,
        type: 'initiated',
      },
      {
        label: 'High Risk ',
        icon: '',
        value: 'HIGHRISK',
        total: 0,
        isSelected: false,
        type: 'initiated',
      },
      {
        label: 'Read ',
        icon: '',
        value: 'READ',
        total: 0,
        isSelected: false,
        type: 'initiated',
      },
      {
        label: 'Unread ',
        icon: '',
        value: 'UNREAD',
        total: 0,
        isSelected: false,
        type: 'initiated',
      },
      {
        label: 'Actioned ',
        icon: '',
        value: 'ACTIONED',
        total: 0,
        isSelected: false,
        type: 'initiated',
      },
    ],
  },
  cols: {
    feedbackDatatable: [
      {
        field: 'outlet',
        header: 'Outlet',
        isSort: true,
        sortType: 'string',
      },
      {
        field: 'guest.getFullName()',
        header: 'Name/Phone No.',
        isSort: true,
        sortType: 'string',
      },
      {
        field: 'getServiceTypeAndTime()',
        header: 'Service/ Feedback',
        isSort: true,
        sortType: 'string',
      },
      {
        field: `getCreatedDate()`,
        header: 'Visit Date/ curr. Living In',
        isSort: true,
        sortType: 'date',
      },
      {
        field: 'comments',
        header: 'Comment',
        isSort: true,
        sortType: 'string',
      },
      { field: 'stageAndourney', header: 'Actions' },
    ],
  },
  table: {
    name: 'Guest - Feedback',
  },
  tabFilterItems: {
    topLowNPS: [
      {
        label: 'Department',
        icon: '',
        value: 'DEPARTMENT',
        total: 0,
        isSelected: true,
      },
      {
        label: 'Experience',
        icon: '',
        value: 'EXPERIENCE',
        total: 0,
        isSelected: false,
      },
    ],
  },
  chartTypes: {
    pos: [
      {
        name: 'POSLine',
        value: 'compare',
        url: 'assets/svg/net-promoter-score-bar.svg',
        backgroundColor: '#DEFFF3',
      },
      {
        name: 'POSBar',
        value: 'bar',
        url: 'assets/svg/bar-graph.svg',
        backgroundColor: '#1AB99F',
      },
    ],
  },
  images: {
    notes: {
      user: {
        url: 'assets/svg/user-01.svg',
        alt: 'user',
      },
      calendar: {
        url: 'assets/svg/calendar.svg',
        alt: 'calendar',
      },
      clock: {
        url: 'assets/svg/clock.svg',
        alt: 'clock',
      },
    },
  },
  percentValues: [100, 80, 60, 40, 20, 0, -20, -40, -60, -80, -100],
};
