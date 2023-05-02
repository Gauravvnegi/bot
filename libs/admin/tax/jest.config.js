module.exports = {
  name: 'admin-tax',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/tax',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
