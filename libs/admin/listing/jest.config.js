module.exports = {
  name: 'admin-listing',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/listing',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
