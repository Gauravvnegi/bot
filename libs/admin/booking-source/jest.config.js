module.exports = {
  name: 'admin-booking-source',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/booking-source',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
