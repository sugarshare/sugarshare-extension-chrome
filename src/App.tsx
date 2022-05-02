import LoginPage from 'pages/LoginPage';
import HomePage from 'pages/HomePage';
import { useAuth } from 'providers/AuthProvider';

export default function App() {
  const { state: authState } = useAuth();

  if (
    authState.user !== null &&
    authState.isAuthenticated &&
    authState.isSessionExpired === false
  ) {
    return <HomePage />;
  }

  return <LoginPage />;
}
