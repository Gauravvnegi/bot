export const listingConfig = {
  datatable: {
    title: 'Listings',
    limit: 5,
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
        field: ``,
        header: 'Unsubscribed/ bounce#',
        isSort: false,
        sortType: 'string',
        dynamicWidth: false,
        isSearchDisabled: true,
      },
      {
        field: ``,
        header: 'Send/Schedule Campaign#',
        isSort: false,
        sortType: 'string',
        dynamicWidth: false,
        isSearchDisabled: true,
      },
      {
        field: '',
        header: 'Active',
        isSort: false,
        sortType: 'number',
        dynamicWidth: true,
        isSearchDisabled: true,
      },
    ],
  },
  list: {
    limit: 50,
    entityState: 'ACTIVE',
    chipValue: {
      all: 'ALL',
    },
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
