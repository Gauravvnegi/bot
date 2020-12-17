module.exports = {
  name: 'admin-packages',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/packages',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
