module.exports = {
  name: 'admin-analytics',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/analytics',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
