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
        sortType: 'string',
        searchField: ['name', 'topicName'],
      },
      {
        field: 'description',
        header: 'Description',
        sortType: 'string',
      },
      {
        field: ``,
        header: 'Unsubscribed/ bounce#',
        isSortDisabled: true,
        sortType: 'string',
        isSearchDisabled: true,
      },
      {
        field: ``,
        header: 'Send/Schedule Campaign#',
        isSortDisabled: true,
        sortType: 'string',
        isSearchDisabled: true,
      },
      {
        field: '',
        header: 'Active',
        isSortDisabled: true,
        sortType: 'number',
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
