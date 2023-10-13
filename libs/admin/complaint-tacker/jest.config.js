module.exports = {
  name: 'admin-complaint-tacker',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/complaint-tacker',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
