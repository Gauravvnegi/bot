module.exports = {
  name: 'admin-create-with',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/create-with',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};