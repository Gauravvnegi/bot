module.exports = {
  name: 'admin-booking-engine',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/booking-engine',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
