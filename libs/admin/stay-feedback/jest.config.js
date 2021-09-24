module.exports = {
  name: 'admin-stay-feedback',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/stay-feedback',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
