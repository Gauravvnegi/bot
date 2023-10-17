module.exports = {
  name: 'admin-manage-inventory',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/manage-inventory',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
