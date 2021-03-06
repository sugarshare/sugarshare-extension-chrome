import React from 'react';
import Auth, { AuthenticationError } from 'libs/auth';
import log from 'libs/log';

type Action =
  | { type: 'SIGN_IN'; payload: { email: string } }
  | { type: 'SIGN_OUT' }
  | { type: 'SESSION_EXPIRED' };

type Dispatch = (action: Action) => void;

type State = {
  user: string | null;
  isAuthenticated: boolean;
  isSessionExpired: boolean;
};

type AuthProviderProps = { children: React.ReactNode };

const AuthStateContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function authReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SIGN_IN': {
      const { email } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user: email,
      };
    }
    case 'SIGN_OUT': {
      return {
        isSessionExpired: false,
        isAuthenticated: false,
        user: null,
      };
    }
    case 'SESSION_EXPIRED': {
      return {
        ...state,
        isSessionExpired: false,
      };
    }
  }
}

const INIT_STATE = {
  isAuthenticated: false,
  user: null,
  isSessionExpired: false,
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = React.useReducer(authReducer, INIT_STATE);

  React.useEffect(() => {
    const auth = new Auth();
    auth
      .load()
      .then(() => {
        if (auth.isAuthenticated) {
          dispatch({ type: 'SIGN_IN', payload: { email: auth.email } });
        }

        if (auth.isSessionExpired()) {
          dispatch({ type: 'SESSION_EXPIRED' });
        }
      })
      .catch((error) => {
        if (error instanceof AuthenticationError && error.message.match(/Cannot find tokens in storage/i)) {
          // Skip as it means tokens have not been requested and stored yet
        } else {
          log.warn('Authentication Error', {}, error);
        }
      });
  }, []);

  // NOTE: you *might* need to memoize this value
  // check: http://kcd.im/optimize-context
  const value = { state, dispatch };
  return (
    <AuthStateContext.Provider value={value}>
      {children}
    </AuthStateContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
