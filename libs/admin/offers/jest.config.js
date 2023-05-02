module.exports = {
  name: 'admin-offers',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/offers',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
