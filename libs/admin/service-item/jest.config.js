module.exports = {
  name: 'admin-service-item',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/service-item',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
