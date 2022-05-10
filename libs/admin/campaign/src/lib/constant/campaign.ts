export const campaignConfig = {
  datatable: {
    tabFilterItems: [
      {
        label: 'All',
        content: '',
        value: 'ALL',
        disabled: false,
        total: 0,
        chips: [
          { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
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
            type: 'pending',
          },
          {
            label: 'Draft',
            icon: '',
            value: 'DRAFT',
            total: 0,
            isSelected: false,
            type: 'pending',
          },
          {
            label: 'Sent',
            icon: '',
            value: 'SENT',
            total: 0,
            isSelected: false,
            type: 'pending',
          },
          {
            label: 'Archive',
            icon: '',
            value: 'ARCHIVE',
            total: 0,
            isSelected: false,
            type: 'pending',
          },
        ],
        lastPage: 0,
      },
    ],

    cols: [
      {
        field: 'name',
        header: 'Name/Topic',
        isSort: true,
        sortType: 'string',
        dynamicWidth: true,
        width: '23%',
      },
      {
        field: 'templateName',
        header: 'Template Name',
        isSort: true,
        sortType: 'string',
        dynamicWidth: false,
        width: '18%',
      },
      {
        field: 'stats',
        header: 'Stats',
        isSort: true,
        sortType: 'string',
        dynamicWidth: true,
        width: '36%',
      },
      {
        field: 'active',
        header: 'Active',
        isSort: false,
        dynamicWidth: true,
        width: '10%',
      },
      {
        field: 'action',
        header: 'Action',
        isSort: true,
        sortType: 'string',
        dynamicWidth: true,
        width: '8%',
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
    delete: { url: 'assets/svg/delete8279.svg', alt: 'delete' },
    saved: { url: 'assets/svg/diskette.svg', alt: 'saved' },
    inbuilt: { url: 'assets/svg/web-design.svg', alt: 'inbuilt' },
    editTemplate: { url: 'assets/svg/design.svg', alt: 'edit Template' },
  },
};
