module.exports = {
  name: 'table-management',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/table-management',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
