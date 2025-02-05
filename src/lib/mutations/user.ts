import { useMutation } from '@tanstack/react-query';
import { createUserProfile } from '@/lib/actions/user';
import type { UserProfile } from '@/types/user';

interface CreateUserInput {
  kindeUserId: string;
  firstName: string;
  lastName: string;
}

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData: CreateUserInput) => {
      const { data, error } = await createUserProfile(userData);
      if (error) {
        throw new Error(error);
      }
      return data as UserProfile;
    },
  });
};
