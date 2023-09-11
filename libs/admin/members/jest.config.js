module.exports = {
  name: 'admin-members',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/members',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
