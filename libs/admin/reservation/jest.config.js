module.exports = {
  name: 'admin-reservation',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/reservation',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
