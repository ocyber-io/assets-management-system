import { useEffect, useState } from "react";
import { UserInfo } from "../../Types";
import { jwtDecode } from "jwt-decode";

interface UserHookResult {
  userInfo?: UserInfo;
  userInitials: string;
  userId?: string;
}

export const useUser = (): UserHookResult => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  const [userInitials, setUserInitials] = useState("SM");
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{
          id: string;
          firstname: string;
          lastname: string;
          email: string;
          profilePicture: string;
          googleId: string;
        }>(token);
        if (decoded) {
          setUserInfo(decoded);
          setUserId(decoded.id);
          const initials = `${decoded.firstname[0]}${decoded.lastname[0]}`;
          setUserInitials(initials.toUpperCase());
        }
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, []);

  return { userInfo, userInitials, userId };
};
