module.exports = {
  name: 'admin-revenue-manager',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/revenue-manager',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
