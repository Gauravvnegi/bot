module.exports = {
  name: 'admin-notification',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/notification',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
