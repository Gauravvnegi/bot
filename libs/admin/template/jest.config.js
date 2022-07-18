module.exports = {
  name: 'admin-template',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/template',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
