module.exports = {
  name: 'admin-transactional-feedback',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/transactional-feedback',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};