export const campaignConfig = {
  datatable: {
    title: 'Campaign',

    tabFilterItems: [
      {
        label: 'All',
        content: '',
        value: 'ALL',
        disabled: false,
        total: 0,
        chips: [
          {
            label: 'All',
            icon: '',
            value: 'ALL',
            total: 0,
            isSelected: true,
            type: 'default',
          },
          {
            label: 'Active',
            icon: '',
            value: 'ACTIVE',
            total: 0,
            isSelected: false,
            type: 'new',
          },
          {
            label: 'In-Active ',
            icon: '',
            value: 'INACTIVE',
            total: 0,
            isSelected: false,
            type: 'failed',
          },
          {
            label: 'Draft',
            icon: '',
            value: 'DRAFT',
            total: 0,
            isSelected: false,
            type: 'warning',
          },
          {
            label: 'Sent',
            icon: '',
            value: 'SENT',
            total: 0,
            isSelected: false,
            type: 'completed',
          },
          {
            label: 'Archive',
            icon: '',
            value: 'ARCHIVE',
            total: 0,
            isSelected: false,
            type: 'initiated',
          },
        ],
        lastPage: 0,
      },
    ],

    cols: [
      {
        field: 'name',
        header: 'Name',
        sortType: 'string',
        width: '20%',
      },
      {
        field: 'templateName',
        header: 'Template Name',
        sortType: 'string',
        width: '15%',
      },
      {
        field: 'stats',
        header: 'Stats',
        isSortDisabled: true,
        sortType: 'string',
        isSearchDisabled: true,
        width: '26%',
      },
      {
        field: 'status',
        header: 'Action',
        sortType: 'number',
        isSearchDisabled: true,
        width: '13%',
      },
    ],
    templateTypes: [
      { name: 'Saved Template', type: 'SAVEDTEMPLATE' },
      { name: 'Pre-defined Template', type: 'PREDESIGNTEMPLATE' },
    ],
  },
  listings: {
    data: [],
    totalRecords: 0,
  },
  subscribers: {
    data: [],
    totalRecords: 0,
  },

  chipValue: {
    all: 'All',
  },

  topicConfig: {
    limit: 50,
    active: 'ACTIVE',
  },

  rowsPerPage: {
    rows: 5,
  },

  templateCard: {
    limit: 3,
  },

  modes: ['backdrop', 'edit', 'view'],
  currentMode: 'backdrop',
  add: 'add',

  validator: {
    length: 200,
  },

  autosave: {
    time: 20000,
  },

  images: {
    info: { url: 'assets/svg/info.svg', alt: 'Info' },
    download: { url: 'assets/svg/Download.svg', alt: 'Download' },
    googleDoc: { url: 'assets/svg/google-docs.svg', alt: 'Google Doc' },
    card: { url: 'assets/svg/card.svg', alt: 'Card' },
    export: { url: 'assets/svg/Export.svg', alt: 'Export' },
    csv: { url: 'assets/svg/CSV.svg', alt: 'CSV' },
    filter: { url: 'assets/svg/Filter-Icon.svg', alt: 'Filter' },
    edit: { url: 'assets/svg/edit8278.svg', alt: 'edit' },
    view: { url: 'assets/svg/view8280.svg', alt: 'view' },
    delete: { url: 'assets/svg/delete-transparent.svg', alt: 'delete' },
    saved: { url: 'assets/svg/diskette.svg', alt: 'saved' },
    inbuilt: { url: 'assets/svg/web-design.svg', alt: 'inbuilt' },
    editTemplate: { url: 'assets/svg/design.svg', alt: 'edit Template' },
    write: { url: 'assets/svg/edit-layer92.svg', alt: ' write' },
    preview: { url: 'assets/svg/default_img.svg', alt: 'preview' },
    calendar: { url: 'assets/svg/calendar.svg', alt: 'calendar' },
    time: { url: 'assets/svg/time.svg', alt: 'time' },
    shared: { url: 'assets/svg/shared_template.svg', alt: 'shared' },
  },
  dropDownTabFilter: [
    {
      label: 'Subscribers Groups',
      value: 'SUBSCRIBERGROUP',
      chips: [],
    },
    {
      label: 'Listing',
      value: 'LISTING',
      chips: [],
    },
  ],
};
