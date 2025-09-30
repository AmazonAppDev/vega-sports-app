# KeplerSportApp Testing Documentation

This document provides an overview of the testing strategy and tools used in the KeplerSportApp project.

## React Native Testing Library (RNTL)

We use React Native Testing Library (RNTL) for testing our React Native components. RNTL is a lightweight solution for testing React Native components that encourages better testing practices by focusing on user interactions rather than implementation details.

Key features of RNTL:
- Simulates user interactions
- Provides utility functions for querying and interacting with components
- Encourages writing accessible tests

To write tests using RNTL, import the necessary functions from '@testing-library/react-native' and use them to render components, query elements, and simulate user interactions.

Example:

import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from './MyComponent';

test('MyComponent renders correctly', () => {
  const { getByText } = render(<MyComponent />);
  const element = getByText('Hello, World!');
  expect(element).toBeTruthy();
});

## Using `it.each` for Parameterized Tests

When you need to run the same test multiple times with different inputs, `it.each` is a powerful tool to reduce code duplication and improve test readability. It allows you to define a test once and run it with multiple sets of data.

Here's an example of how to use `it.each` with an input array, based on the codebase:
```typescript
import { ensureIsBoolean } from './utils';

describe('ensureIsBoolean', () => {
  it.each([
    ['true', true],
    ['1', true],
    ['false', false],
  ])('should correctly parse %s to %s', (input, expected) => {
    expect(ensureIsBoolean(input)).toBe(expected);
  });
});
```

For a practical example of using `it.each` in our codebase, you can refer to the [AppConfig-utils.test.ts](../services/appConfig/__tests__/AppConfig-utils.test.ts) file. This test file demonstrates how we use parameterized tests to validate our utility functions with multiple inputs.


## Test Coverage

We use Jest's built-in coverage tool to measure and monitor our test coverage. Test coverage is automatically generated for each test run and displayed in the console output. If you want to see a detailed coverage report, you can run the following command:

```bash
open .tmp/coverage/lcov-report/index.html
```

Settings for test coverage can be found in the `jest.config.js` file. Any changes to this file should be reviewed by the team to ensure that we maintain a high level of test coverage.

## Guidelines for Writing Tests

1. Write tests for all new features and bug fixes.
2. Aim for high test coverage, but prioritize meaningful tests over 100% coverage.
3. Use descriptive test names that explain the expected behavior.
4. Keep tests isolated and avoid dependencies between tests.
5. Use mock data and functions when testing components that rely on external services or complex state management.

## Continuous Integration

We use GitHub Actions for continuous integration. Our CI pipeline runs all tests and generates a coverage report for each pull request. Make sure all tests pass and there are no significant decreases in coverage before merging your changes.

To check the status of your tests and coverage, visit the "Actions" tab in our GitHub repository.
