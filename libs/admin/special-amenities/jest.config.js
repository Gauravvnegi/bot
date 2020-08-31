module.exports = {
  name: 'admin-special-amenities',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/special-amenities',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
