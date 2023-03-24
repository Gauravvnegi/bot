module.exports = {
  name: 'admin-manage-sites',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/manage-sites',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
