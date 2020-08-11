module.exports = {
  name: 'admin-shared',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/shared',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
