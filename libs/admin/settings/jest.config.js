module.exports = {
  name: 'admin-settings',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/settings',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
