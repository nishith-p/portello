import { useMutation } from '@tanstack/react-query';
import { createUserProfile } from '@/lib/actions/user';
import type { BasicUser } from '@/types/user';

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData: BasicUser) => {
      const { data, error } = await createUserProfile(userData);
      if (error) {
        throw new Error(error);
      }
      return data as BasicUser;
    },
  });
};
