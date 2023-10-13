module.exports = {
  name: 'admin-reports',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/reports',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
