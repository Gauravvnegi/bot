module.exports = {
  name: 'admin-housekeeping',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/housekeeping',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
