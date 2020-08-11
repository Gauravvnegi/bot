module.exports = {
  name: 'web-user-shared',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/web-user/shared',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
