import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Layout } from '@/app/onboarding/_components/Layout';
import { OnboardingForm } from '@/app/onboarding/_components/OnboardingForm';
import { getUserProfile } from '@/lib/actions/user';

export const metadata = {
  title: 'Complete Your Profile - Onboarding',
};

const Onboarding = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect('/api/auth/login');
  }

  const existingUser = await getUserProfile(user.id);

  // Redirect if user exists in Supabase (already completed onboarding)
  if (existingUser) {
    redirect('/portal');
  }

  return (
    <Layout>
      <OnboardingForm kindeUserId={user.id} />
    </Layout>
  );
};

export default Onboarding;