module.exports = {
  name: 'admin-guest-dashboard',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/guest-dashboard',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
