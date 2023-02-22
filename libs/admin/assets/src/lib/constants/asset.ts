export const assetConfig = {
  datatable: {
    title: 'Asset',
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
            type: 'pending',
          },
        ],
        lastPage: 0,
      },
      {
        label: 'Image',
        content: '',
        value: 'IMAGE',
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
            type: 'pending',
          },
        ],
        lastPage: 0,
      },
      {
        label: 'Video',
        content: '',
        value: 'VIDEO',
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
        sortType: 'number',
        dynamicWidth: false,
      },
      {
        field: 'description',
        header: 'Description',
        isSort: true,
        sortType: 'number',
        dynamicWidth: false,
      },
      {
        field: 'type',
        header: 'Type',
        isSort: true,
        sortType: 'string',
        dynamicWidth: false,
      },
      {
        field: 'url',
        header: 'URL',
        isSort: true,
        sortType: 'string',
        dynamicWidth: false,
      },
      {
        field: 'active',
        header: 'Active',
        isSort: false,
        sortType: 'number',
        dynamicWidth: true,
        isSearchDisabled: true,
      },
    ],
  },
  fileUploadData: {
    fileSize: 3145728,
    fileType: ['png', 'jpg', 'jpeg', 'gif', 'eps'],
  },
  type: {
    video: 'Video',
    image: 'Image',
  },
  size: {
    image: ['png', 'jpg', 'jpeg', 'gif', 'eps'],
    video: ['mp4', 'MPEG', 'MOV', 'AVI', 'MKV'],
  },
  images: {
    info: { url: 'assets/svg/info.svg', alt: 'Info' },
    download: { url: 'assets/svg/Download.svg', alt: 'Download' },
    googleDoc: { url: 'assets/svg/google-docs.svg', alt: 'Google Doc' },
    card: { url: 'assets/svg/card.svg', alt: 'Card' },
    export: { url: 'assets/svg/Export.svg', alt: 'Export' },
    csv: { url: 'assets/svg/CSV.svg', alt: 'CSV' },
    filter: { url: 'assets/svg/Filter-Icon.svg', alt: 'Filter' },
    copy: { url: 'assets/svg/copy.svg', alt: 'copy' },
  },
};
