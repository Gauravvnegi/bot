module.exports = {
  name: 'admin-unsubscribed',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/unsubscribed',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
