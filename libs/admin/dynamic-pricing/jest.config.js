module.exports = {
  name: 'admin-dynamic-pricing',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/dynamic-pricing',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
