module.exports = {
  name: 'admin-whatsapp',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/whatsapp',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
