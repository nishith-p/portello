import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { OnboardingForm } from '@/app/onboarding/components/OnboardingForm';

export const metadata = {
  title: 'Onboarding',
};

export default async function Onboarding() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect('/api/auth/login');
  }

  return <OnboardingForm kinde_id={user.id} kinde_email={user.email ?? ''} />;
}
