import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  return { user, token, isAuthenticated, role: user?.role };
};
