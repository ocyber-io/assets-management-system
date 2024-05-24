import { useEffect, useState } from "react";
import { UserInfo } from "../../Types";

export const useUserId = (userInfo?: UserInfo) => {
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    if (userInfo) {
      setUserId(userInfo.id);
    }
  }, [userInfo]);

  return userId;
};