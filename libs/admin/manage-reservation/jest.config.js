module.exports = {
  name: 'admin-manage-reservation',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/manage-reservation',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
