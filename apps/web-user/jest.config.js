module.exports = {
  name: 'web-user',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/web-user',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
