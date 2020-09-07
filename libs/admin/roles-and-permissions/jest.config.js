module.exports = {
  name: 'admin-roles-and-permissions',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/roles-and-permissions',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
