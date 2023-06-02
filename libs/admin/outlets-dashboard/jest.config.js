module.exports = {
  name: 'admin-outlets-dashboard',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/outlets-dashboard',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
