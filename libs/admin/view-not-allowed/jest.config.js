module.exports = {
  name: 'admin-view-not-allowed',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/view-not-allowed',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
