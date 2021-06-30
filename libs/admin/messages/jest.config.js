module.exports = {
  name: 'admin-messages',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/messages',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
