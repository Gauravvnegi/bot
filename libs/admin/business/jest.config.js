module.exports = {
  name: 'admin-business',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/business',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
