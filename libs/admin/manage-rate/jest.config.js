module.exports = {
  name: 'admin-manage-rate',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/manage-rate',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
