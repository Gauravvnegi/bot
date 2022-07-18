export const contactConfig = {
  datatable: {
    title:'Manage Contacts',
    cols: [
      {
        field: 'email',
        header: 'Email',
        isSort: true,
        sortType: 'string',
        dynamicWidth: true,
        width: '30%',
      },
      {
        field: 'salutation',
        header: 'Salutation',
        isSort: true,
        sortType: 'string',
        dynamicWidth: true,
        width: '100px',
      },
      {
        field: 'firstName',
        header: 'First Name',
        isSort: true,
        sortType: 'string',
        dynamicWidth: false,
        width: '',
      },
      {
        field: 'lastName',
        header: 'Last Name',
        isSort: true,
        sortType: 'string',
        dynamicWidth: false,
        width: '',
      },
      {
        field: 'companyName',
        header: 'Company Name',
        isSort: true,
        sortType: 'string',
        dynamicWidth: false,
        width: '',
      },
      {
        field: 'mobile',
        header: 'Mobile',
        isSort: true,
        sortType: 'number',
        dynamicWidth: true,
        width: '170px',
      },
    ],
    dialogWidth:'550',
    salutationList : [
      { name: 'Mr.', value: 'Mr.' },
      { name: 'Mrs.', value: 'Mrs.' },
      { name: 'Miss', value: 'Miss' },
    ],
    fileUploadData : {
      fileSize: 3145728,
      fileType: ['csv'],
    },
  },
};
