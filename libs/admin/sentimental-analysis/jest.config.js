module.exports = {
  name: 'admin-sentimental-analysis',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/sentimental-analysis',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
