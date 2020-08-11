module.exports = {
  name: 'web-user-template-renderer',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/web-user/template-renderer',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
