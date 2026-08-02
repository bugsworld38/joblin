import { LoginView } from '@/features/auth/LoginView';
import { useAuth } from '@/features/auth/useAuth';
import { QueueView } from '@/features/queue/QueueView';

export function App() {
  const { accessToken, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return accessToken ? <QueueView /> : <LoginView />;
}
