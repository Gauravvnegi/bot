export const templateConfig = {
  datatable: {
    title: 'Template',
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
    assetsTabFilterItems: [
      { src: 'assets/svg/photo.svg', value: 'IMAGE', page: 0, total: 0 },
      { src: 'assets/svg/film.svg', value: 'VIDEO', page: 0, total: 0 },
    ],
    cols: [
      {
        field: 'name',
        header: 'Name',
        sortType: 'string',
        width: '35%',
      },
      {
        field: 'description',
        header: 'Description',
        sortType: 'string',
        width: '35%',
      },
      {
        field: 'active',
        header: 'Active',
        sortType: 'number',
        isSearchDisabled: true,
        width: '30%',
      },
    ],
    chips: [
      {
        label: 'All',
        icon: '',
        value: 'ALL',
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
  },

  topicConfig: {
    limit: 50,
    active: 'ACTIVE',
  },

  rowsPerPage: {
    datatableLimit: 5,
    limit: 10,
  },

  selectedTopic: {
    all: 'All',
  },

  importAsset: {
    limit: 10,
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
    import: { url: 'assets/svg/import.svg', alt: 'import' },
  },
};

export type TemplateFormData = {
  name: string;
  topicId: string;
  description: string;
  status: boolean;
  templateType: string;
  htmlTemplate: string;
  isShared: string;
};
