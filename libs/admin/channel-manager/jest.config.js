module.exports = {
  name: 'admin-channel-manager',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/channel-manager',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
