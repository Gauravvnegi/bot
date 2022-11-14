module.exports = {
  name: 'admin-conversation-analytics',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/conversation-analytics',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
