import { LoginForm } from './LoginForm';

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolved = await searchParams;
  const rawNext = resolved?.next || '/';
  const nextPath = rawNext.startsWith('/') ? rawNext : '/';

  return <LoginForm nextPath={nextPath} />;
}
