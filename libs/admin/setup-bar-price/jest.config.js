module.exports = {
  name: 'admin-setup-bar-price',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/setup-bar-price',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
