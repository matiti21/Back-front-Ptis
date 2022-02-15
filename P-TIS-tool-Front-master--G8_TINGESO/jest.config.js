module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  },
  collectCoverage: true,
	collectCoverageFrom: ['src/**/*.{js,vue}', '!**/node_modules/**'],
	coverageDirectory: './coverage',
	coverageReporters: ['html', 'text', 'text-summary', 'lcov']
}
