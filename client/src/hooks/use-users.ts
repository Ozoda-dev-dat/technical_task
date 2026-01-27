import { 
  useGetUsersQuery, 
  useGetUserQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation 
} from "@/store/services/users";
import { type CreateUserRequest, type UpdateUserRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useUsers() {
  return useGetUsersQuery();
}

export function useUser(id: number) {
  return useGetUserQuery(id, { skip: !id });
}

export function useUserMutations() {
  const { toast } = useToast();
  const [createMutation] = useCreateUserMutation();
  const [updateMutation] = useUpdateUserMutation();
  const [removeMutation] = useDeleteUserMutation();

  const create = {
    mutate: async (data: CreateUserRequest) => {
      try {
        await createMutation(data).unwrap();
        toast({ title: "Muvaffaqiyatli", description: "Foydalanuvchi yaratildi" });
      } catch (err: any) {
        toast({ variant: "destructive", title: "Xatolik", description: err.data?.message || err.message });
      }
    }
  };

  const update = {
    mutate: async ({ id, ...data }: { id: number } & UpdateUserRequest) => {
      try {
        await updateMutation({ id, ...data }).unwrap();
        toast({ title: "Muvaffaqiyatli", description: "Foydalanuvchi ma'lumotlari yangilandi" });
      } catch (err: any) {
        toast({ variant: "destructive", title: "Xatolik", description: err.data?.message || err.message });
      }
    }
  };

  const remove = {
    mutate: async (id: number) => {
      try {
        await removeMutation(id).unwrap();
        toast({ title: "Muvaffaqiyatli", description: "Foydalanuvchi o'chirib tashlandi" });
      } catch (err: any) {
        toast({ variant: "destructive", title: "Xatolik", description: err.data?.message || err.message });
      }
    }
  };

  return { create, update, remove };
}
