# Auth Service

This service manages user authentication, including signing users in and out, and restoring session data from device storage. It integrates with the @AppStore for user management and `DeviceStorage` service for persistent storage.

## Methods

### `signIn`

```tsx
signIn({ email, password }: Credentials): undefined
```

- **Description**: This method handles signing in a user. It calls to an API that retrieves the user's information and stores it in local storage.
- **Parameters**:
  - `email`: The user's email address.
  - `password`: The user's password (though it's not used in this mock implementation).
- **Returns**: `undefined`
- **Example**:

  ```tsx
  signIn({ email: 'john.doe@example.com', password: 'password' });
  ```

### `signOut`

```tsx
signOut(): undefined
```

- **Description**: This method signs out the user by removing their data from local storage and resetting the current user in the state.
- **Returns**: `undefined`
- **Example**:

  ```tsx
  signOut();
  ```

### `isSignedIn`

```tsx
isSignedIn: boolean;
```

- **Description**: A boolean flag that indicates whether a user is currently signed in.
- **Example**:

  ```tsx
  if (isSignedIn) {
    // User is signed in
  }
  ```

### `user`

```tsx
user: User | undefined;
```

- **Description**: Contains the currently signed-in user's data, or `undefined` if no user is signed in.
- **Example**:

  ```tsx
  if (user) {
    console.log(`Hello, ${user.firstName}`);
  }
  ```

## Usage

You can use the useAuth hook in any component to handle authentication. Below is an example:

```jsx
import React, { useEffect } from 'react';
import { useAuth } from '@AppServices/auth';

const LoginComponent = () => {
  const { signIn, signOut, user, isSignedIn } = useAuth({
    onError: (message) => console.error(message),
  });

  const handleLogin = () => {
    signIn({ email: 'john.doe@example.com', password: 'password' });
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <View>
      <Button onPress={handleLogin} label="Sign in" />
      <Button onPress={handleLogout} label="Sign out" />
      {isSignedIn && <Text>Welcome, {user?.firstName}</Text>}
    </View>
  );
};
```
