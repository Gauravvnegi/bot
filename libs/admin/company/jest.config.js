module.exports = {
  name: 'admin-company',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/company',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
