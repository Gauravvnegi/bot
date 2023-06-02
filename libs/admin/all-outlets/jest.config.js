module.exports = {
  name: 'admin-all-outlets',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/all-outlets',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
