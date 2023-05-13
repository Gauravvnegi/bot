export const feedback = {
  types: {
    stay: 'STAYFEEDBACK',
    transactional: 'TRANSACTIONALFEEDBACK',
    both: 'ALL',
  },
  images: {
    whatsapp: {
      url: 'assets/svg/whatsapp-circle.svg',
      alt: 'whatspp',
    },
    email: { url: 'assets/svg/email-circle.svg', alt: 'mail' },
    manual: {
      url: 'assets/svg/manual-circle.svg',
      alt: 'manualmessage',
    },
    distribution: {
      url: 'assets/svg/feedback-distribution.svg',
      alt: 'distribution',
    },
    globalNPS: {
      url: 'assets/svg/global_nps.svg',
      alt: 'global_nps',
    },
    nps: {
      url: 'assets/svg/net-promoter.svg',
      alt: 'Net promoter score',
    },
    nps_departments: {
      url: 'assets/svg/nps_departments.svg',
      alt: 'nps_departments',
    },
    nps_services: {
      url: 'assets/svg/nps-services.svg',
      alt: 'nps-services',
    },
    exportCSV: {
      url: 'assets/svg/CSV.svg',
      alt: 'CSV',
    },
    export: {
      url: 'assets/svg/Export.svg',
      alt: 'Export',
    },
    top_low_nps: {
      url: 'assets/svg/speedometer.svg',
      alt: 'speedometer',
    },
    gtm_across_services: {
      url: 'assets/svg/gtm_services.svg',
      alt: 'GTM',
    },
    location: {
      url: 'assets/svg/location.svg',
      alt: 'Location',
    },
    happy: {
      url: 'assets/svg/happy.svg',
      alt: 'Happy',
    },
    sceptic: {
      url: 'assets/svg/sceptic.svg',
      alt: 'Sceptic',
    },
    sad: {
      url: 'assets/svg/sad.svg',
      alt: 'Sad',
    },
    info: { url: 'assets/svg/info.svg', alt: 'Info' },
    datatable: {
      download: {
        url: 'assets/svg/Download.svg',
        alt: 'Download',
      },
      google_docs: {
        url: 'assets/svg/google-docs.svg',
        alt: 'google docs',
      },
      card: {
        url: 'assets/svg/card.svg',
        alt: 'Card',
      },
      vip_guest: {
        url: 'assets/images/VIP.png',
        alt: 'VIP',
      },
      mark_as_read: {
        url: 'assets/svg/mark-read.svg',
        alt: 'Mark as read',
      },
      mark_as_unread: {
        url: 'assets/svg/mark-unread.svg',
        alt: 'Mark as unread',
      },
      pdf: {
        url: 'assets/svg/pdf.svg',
        alt: 'PDF',
      },
      document: {
        url: 'assets/svg/Document.svg',
        alt: 'document',
      },
      payment: {
        url: 'assets/svg/Payment.svg',
        alt: 'Payment',
      },
      feedback: {
        url: 'assets/svg/Feedback.svg',
        alt: 'Feedback',
      },
      new_journey: {
        url: 'assets/svg/New-Journey.svg',
        alt: 'New journey',
      },
      precheckin: {
        url: 'assets/svg/precheckin.svg',
        alt: 'precheckin',
      },
      checkin: {
        url: 'assets/svg/checkin.svg',
        alt: 'precheckin',
      },
      checkout: {
        url: 'assets/svg/checkout.svg',
        alt: 'precheckin',
      },
    },
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
  chartType: {
    bar: {
      name: 'Bar',
      value: 'bar',
      url: 'assets/svg/bar-graph.svg',
      backgroundColor: '#1AB99F',
    },
    line: {
      name: 'Line',
      value: 'line',
      url: 'assets/svg/line-graph.svg',
      backgroundColor: '#DEFFF3',
    },
    sentiment: {
      name: 'Sentiment',
      value: 'sentiment',
      url: 'assets/svg/reload.svg',
      backgroundColor: '#DEFFF3',
    },
  },
  tableTypes: {
    table: {
      name: 'table',
      value: 'table',
      url: 'assets/svg/tablet.svg',
      backgroundColor: '#1AB99F',
    },
    card: {
      name: 'card',
      value: 'card',
      url: 'assets/svg/table_card.svg',
      backgroundColor: '#DEFFF3',
    },
  },
  colorConfig: {
    distribution: {
      VERYPOOR: '#CC052B',
      POOR: '#EF1D45',
      ADEQUATE: '#FF8F00',
      GOOD: '#4BA0F5',
      VERYGOOD: '#224BD5',
      OUTSTANDING: '#508919',
    },
    globalNPS: {
      neutral: '#ff8f00',
      positive: '#508919',
      negative: '#cc052b',
    },
  },
  labels: {
    globalNPS: {
      neutral: 'Neutral',
      positive: 'Positive',
      negative: 'Negative',
    },
  },
  canvas: {
    department: {
      lineWidth: 15,
      x: 62,
      y: 62,
      radius: 55,
    },
  },
  defaultColor: '#f2f2f2',
  negativeColor: '#EF1D45',
  neutralColor: '#4BA0F5',
  positiveColor: '#1AB99F',
  percentValues: [100, 80, 60, 40, 20, 0, -20, -40, -60, -80, -100],
  minPercent: -100,
  maxPercent: 100,
  table: {
    name: 'Guest - Feedback',
  },
  chips: {
    feedbackDatatable: [
      {
        label: 'All',
        icon: '',
        value: 'ALL',
        isSelected: true,
        type: 'default',
      },
      {
        label: 'High Potential ',
        icon: '',
        value: 'HIGHPOTENTIAL',
        total: 0,
        isSelected: false,
        type: 'failed',
      },
      {
        label: 'High Risk ',
        icon: '',
        value: 'HIGHRISK',
        total: 0,
        isSelected: false,
        type: 'completed',
      },
      {
        label: 'To Do ',
        icon: '',
        value: 'TODO',
        total: 0,
        isSelected: false,
        type: 'initiated',
      },
      {
        label: 'In-Progress ',
        icon: '',
        value: 'INPROGRESS',
        total: 0,
        isSelected: false,
        type: 'completed',
      },
      {
        label: 'Resolved ',
        icon: '',
        value: 'RESOLVED',
        total: 0,
        isSelected: false,
        type: 'failed',
      },
      {
        label: 'No Action ',
        icon: '',
        value: 'NOACTION',
        total: 0,
        isSelected: false,
        type: 'pending',
      },
    ],
  },
  cols: {
    rategraphDatatable: {
      transactional: [
        {
          field: 'bookingDetails.tableOrRoomNumber',
          header: 'Table No. / Outlet',
          sortType: 'string',
          searchField: ['bookingDetails.tableOrRoomNumber', 'outlet'],
        },
        {
          field: 'guest.getFullName()',
          header: 'Name / Phone No./ Email',
          sortType: 'string',
          width: '20%',
          searchField: ['guest.getFullName', 'guest.getPhoneNumber', 'guest.getEmail'],
        },
        {
          field: 'getServiceTypeAndTime()',
          header: 'Service / Feedback',
          isSortDisabled: true,
          sortType: 'string',
          width: '20%',
          isSearchDisabled: true,
        },
        {
          field: `getCreatedDate()`,
          header: 'Date / Time',
          sortType: 'date',
          isSearchDisabled: true,
        },
        {
          field: 'guestData.overAllNps',
          header: 'Overall NPS',
          sortType: 'number',
          isSearchDisabled: true,
        },
        {
          field: 'guestData.churnProbalilty',
          header: 'Churn Prob / Prediction',
          isSortDisabled: true,
          sortType: 'string',
          isSearchDisabled: true,
        },
        {
          field: '',
          header: 'Shared on / Received on',
          isSortDisabled: true,
          sortType: 'string',
          isSearchDisabled: true,
        },
        {
          field: 'actions',
          header: 'Actions',
          width: '15%',
          isSearchDisabled: true,
        },
      ],
      stay: [
        {
          field: 'tableOrRoomNumber',
          header: 'Room No',
          sortType: 'string',
        },
        {
          field: '',
          header: 'Service / Feedback',
          isSortDisabled: true,
          sortType: 'string',
          isSearchDisabled: true,
        },
        {
          field: 'guest.getFullName()',
          header: 'Name / Phone No. / Email',
          sortType: 'string',
          width: '20%',
          searchField: [
            'guest.getFullName',
            'guest.getPhoneNumber',
            'guest.emailId',
          ],
        },
        {
          field: `guest.getCreatedDate()`,
          header: 'Date / Time / Guests',
          sortType: 'date',
          isSearchDisabled: true,
        },
        {
          field: 'guestData.overAllNps',
          header: 'Overall NPS',
          sortType: 'number',
          isSearchDisabled: true,
        },
        {
          field: 'guestData.churnProbalilty',
          header: 'Churn Prob / Prediction',
          isSortDisabled: true,
          sortType: 'string',
          isSearchDisabled: true,
        },
        {
          field: '',
          header: 'Shared on / Received on',
          isSortDisabled: true,
          sortType: 'string',
          isSearchDisabled: true,
        },
        {
          field: 'actions',
          header: 'Actions',
          width: '15%',
          isSearchDisabled: true,
        },
      ],
    },
    feedbackDatatable: {
      transactional: [
        {
          field: 'bookingDetails.tableOrRoomNumber',
          header: 'Table No. / Outlet',
          sortType: 'string',
          searchField: ['bookingDetails.tableOrRoomNumber', 'outlet'],
        },
        {
          field: 'guest.getFullName()',
          header: 'Name / Phone No. / Email',
          sortType: 'string',
          width: '20%',
          searchField: ['string','number'],
        },
        {
          field: 'getServiceTypeAndTime()',
          header: 'Service / Feedback',
          isSortDisabled: true,
          sortType: 'string',
          isSearchDisabled: true,
        },
        {
          field: `getCreatedDate()`,
          header: 'Date/ Time',
          sortType: 'date',
          isSearchDisabled: true,
        },
        {
          field: 'guestData.overAllNps',
          header: 'Overall NPS',
          sortType: 'number',
          isSearchDisabled: true,
        },
        {
          field: 'guestData.churnProbalilty',
          header: 'Churn Prob/ Prediction',
          isSortDisabled: true,
          sortType: 'string',
          isSearchDisabled: true,
        },
        {
          field: 'actions',
          header: 'Actions',
          width: '15%',
          isSearchDisabled: true,
        },
      ],
      stay: [
        {
          field: 'tableOrRoomNumber',
          header: 'Room No',
          sortType: 'string',
        },
        {
          field: '',
          header: 'Service / Feedback',
          isSortDisabled: true,
          sortType: 'string',
          width: '20%',
          isSearchDisabled: true,
        },
        {
          field: 'guest.fullName',
          header: 'Name / Phone No./ Email',
          sortType: 'string',
          width: '20%',
          searchField: [
            'guest.getFullName',
            'guest.getPhoneNumber',
            'guest.emailId',
          ],
        },
        {
          field: `guest.getCreatedDate()`,
          header: 'Date / Time/ Guests',
          sortType: 'date',
          isSearchDisabled: true,
        },
        {
          field: 'guestData.overAllNps',
          header: 'Overall NPS',
          sortType: 'number',
          isSearchDisabled: true,
        },
        {
          field: 'guestData.churnProbalilty',
          header: 'Churn Prob/ Prediction',
          isSortDisabled: true,
          sortType: 'string',
          isSearchDisabled: true,
        },
        {
          field: 'actions',
          header: 'Actions',
          width: '15%',
          isSearchDisabled: true,
        },
      ],
    },
  },
  tabFilterItems: {
    topLowNPS: {
      stay: [
        {
          label: 'Department',
          icon: '',
          value: 'DEPARTMENT',
          isSelected: true,
        },
        {
          label: 'Service',
          icon: '',
          value: 'SERVICE',
          isSelected: false,
        },
      ],
      transactional: [
        {
          label: 'Department',
          icon: '',
          value: 'DEPARTMENT',
          isSelected: true,
        },
        {
          label: 'Service',
          icon: '',
          value: 'SERVICE',
          isSelected: false,
        },
      ],
    },
    datatable: {
      stay: [
        {
          label: 'Stay Experience ',
          content: '',
          value: 'STAYFEEDBACK',
          disabled: false,
          total: 0,
          chips: [
            {
              label: 'GTM ',
              icon: '',
              value: 'GTM',
              total: 0,
              isSelected: true,
              type: 'initiated',
            },
            {
              label: 'All',
              icon: '',
              value: 'ALL',
              total: 0,
              isSelected: false,
              type: 'completed',
            },
          ],
          lastPage: 0,
        },
      ],
      transactional: [
        {
          label: 'Transactional ',
          content: '',
          value: 'TRANSACTIONALFEEDBACK',
          disabled: false,
          total: 0,
          chips: [
            {
              label: 'GTM ',
              icon: '',
              value: 'GTM',
              total: 0,
              isSelected: true,
              type: 'initiated',
            },
            {
              label: 'All',
              icon: '',
              value: 'ALL',
              total: 0,
              isSelected: false,
              type: 'completed',
            },
          ],
          lastPage: 0,
        },
      ],
      both: [
        {
          label: 'Transactional ',
          content: '',
          value: 'TRANSACTIONALFEEDBACK',
          disabled: false,
          total: 0,
          chips: [
            {
              label: 'GTM ',
              icon: '',
              value: 'GTM',
              total: 0,
              isSelected: true,
              type: 'initiated',
            },
            {
              label: 'All',
              icon: '',
              value: 'ALL',
              total: 0,
              isSelected: false,
              type: 'completed',
            },
          ],
          lastPage: 0,
        },
        {
          label: 'Stay Experience ',
          content: '',
          value: 'STAYFEEDBACK',
          disabled: false,
          total: 0,
          chips: [
            {
              label: 'GTM ',
              icon: '',
              value: 'GTM',
              total: 0,
              isSelected: true,
              type: 'initiated',
            },
            {
              label: 'All',
              icon: '',
              value: 'ALL',
              total: 0,
              isSelected: false,
              type: 'completed',
            },
          ],
          lastPage: 0,
        },
      ],
    },
  },
  chartTypes: {
    pos: [
      {
        name: 'POSLine',
        value: 'compare',
        url: 'assets/svg/net-promoter-score-bar.svg',
        selectedUrl: 'assets/svg/comparison-selected.svg',
        backgroundColor: '#DEFFF3',
      },
      {
        name: 'POSBar',
        value: 'bar',
        url: 'assets/svg/bar-graph.svg',
        selectedUrl: 'assets/svg/bar-graph.svg',
        backgroundColor: '#1AB99F',
      },
    ],
  },
  tableName: {
    receivedBreakdown: 'Task Breakdown',
    distribution: 'Feedback Distribution',
    responseRate: 'Response Rate',
  },
  keyLabels: {
    topLow: [
      { label: '<40', colorCode: '#ef1d45' },
      { label: '40-80', colorCode: '#ff8f00' },
      { label: '>80', colorCode: '#508919' },
    ],
  },
};
