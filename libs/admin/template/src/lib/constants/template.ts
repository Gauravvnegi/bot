export const templateConfig = {
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
        ],
        lastPage: 0,
      },
    ],
    cols: [
      {
        field: 'name',
        header: 'Name',
        isSort: true,
        sortType: 'string',
        dynamicWidth: false,
      },
      {
        field: 'description',
        header: 'Description',
        isSort: true,
        sortType: 'string',
        dynamicWidth: false,
      },
      {
        field: 'active',
        header: 'Active',
        isSort: false,
        dynamicWidth: true,
      },
    ],
  },
  images: {
    info: { url: 'assets/svg/info.svg', alt: 'Info' },
    download: { url: 'assets/svg/Download.svg', alt: 'Download' },
    googleDoc: { url: 'assets/svg/google-docs.svg', alt: 'Google Doc' },
    card: { url: 'assets/svg/card.svg', alt: 'Card' },
    export: { url: 'assets/svg/Export.svg', alt: 'Export' },
    csv: { url: 'assets/svg/CSV.svg', alt: 'CSV' },
    filter: { url: 'assets/svg/Filter-Icon.svg', alt: 'Filter' },
  },
};