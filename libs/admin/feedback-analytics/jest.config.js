module.exports = {
  name: 'admin-feedback-analytics',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/admin/feedback-analytics',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
