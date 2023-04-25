export const topicConfig = {
  datatable: {
    title: 'Topic',
    limit: 5,
    chipValue: {
      all: 'ALL',
    },
    tabFilterItems: [
      {
        label: 'All',
        content: '',
        value: 'ALL',
        disabled: false,
        isSelected: false,
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
        ],
        lastPage: 0,
      },
    ],
    cols: [
      {
        field: 'name',
        header: 'Name',
        sortType: 'string',
      },
      {
        field: 'description',
        header: 'Description',
        sortType: 'string',
      },
      {
        field: 'active',
        header: 'Active',
        isSortDisabled: true,

        isSearchDisabled: true,
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
