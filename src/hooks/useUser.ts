import { useAuth } from "./useAuth";

export const useUser = () => {
  const { user, loading } = useAuth();
  return { user, loading };
};
