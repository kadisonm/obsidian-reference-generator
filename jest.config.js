/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest/presets/default-esm',
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
}