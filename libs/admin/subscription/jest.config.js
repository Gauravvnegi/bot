module.exports = {
  name: 'admin-subscription',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/subscription',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
