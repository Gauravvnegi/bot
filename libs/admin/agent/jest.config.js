module.exports = {
  name: 'admin-agent',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/agent',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
