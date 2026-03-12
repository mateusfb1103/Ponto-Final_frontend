import { Redirect } from 'expo-router';

export default function Index() {
  // Redireciona automaticamente para a nossa tela de login recém-criada
  return <Redirect href="/(auth)/login" />;
}