import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUserProfile, getUserProfile, updateUserProfile } from '@/lib/actions/user';
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

export const useProfile = (kindeUserId: string) => {
  const queryClient = useQueryClient();

  const basicInfoQuery = useQuery({
    queryKey: ['basic_profile', kindeUserId],
    queryFn: () => getUserProfile(kindeUserId),
    enabled: !!kindeUserId,
  });

  const updateBasicInfoMutation = useMutation({
    mutationFn: (data: Omit<BasicUser, 'kinde_id' | 'kinde_email'>) =>
      updateUserProfile(kindeUserId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['basic_profile', kindeUserId] });
    },
  });

  return {
    basicInfo: basicInfoQuery.data,
    isLoading: basicInfoQuery.isLoading,
    error: basicInfoQuery.error,
    updateBasicInfo: updateBasicInfoMutation.mutate,
    isUpdating: updateBasicInfoMutation.isPending,
    updateError: updateBasicInfoMutation.error,
  };
};
