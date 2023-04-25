export const contactConfig = {
  datatable: {
    title: 'Manage Contacts',
    cols: [
      {
        field: 'email',
        header: 'Email',

        sortType: 'string',

        width: '17.5%',
      },
      {
        field: 'salutation',
        header: 'Salutation',

        sortType: 'string',

        width: '15%',
      },
      {
        field: 'firstName',
        header: 'First Name',

        sortType: 'string',

        width: '15%',
      },
      {
        field: 'lastName',
        header: 'Last Name',

        sortType: 'string',

        width: '15%',
      },
      {
        field: 'companyName',
        header: 'Company Name',

        sortType: 'string',

        width: '17.5%',
      },
      {
        field: 'mobile',
        header: 'Mobile',

        sortType: 'number',

        width: '20%',
      },
    ],
    dialogWidth: '550',
    salutationList: [
      { name: 'Mr.', value: 'Mr.' },
      { name: 'Mrs.', value: 'Mrs.' },
      { name: 'Miss', value: 'Miss' },
    ],
    fileUploadData: {
      fileSize: 3145728,
      fileType: ['csv'],
    },
  },
};
