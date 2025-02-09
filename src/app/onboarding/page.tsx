import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { OnboardingForm } from '@/app/onboarding/components/OnboardingForm';
import { getUserProfile } from '@/lib/actions/user';

export const metadata = {
  title: 'Onboarding',
};

const Onboarding = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect('/api/auth/login');
  }

  // const existingUser = await getUserProfile(user.id);
  //
  // if (existingUser) {
  //   redirect('/portal');
  // }

  return <OnboardingForm kinde_id={user.id} kinde_email={user.email!} />;
};

export default Onboarding;
