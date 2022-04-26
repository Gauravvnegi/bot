module.exports = {
  name: 'admin-marketing',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/marketing',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
