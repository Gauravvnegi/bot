module.exports = {
  name: 'admin-campaign',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/campaign',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
