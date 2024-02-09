module.exports = {
  name: 'admin-kot',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/kot',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
