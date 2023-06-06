module.exports = {
  name: 'admin-outlets',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/outlets',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
