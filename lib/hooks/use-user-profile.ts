import { useEffect, useState } from "react";
import { FileInfo, UserProfile } from "@/lib/types/index";
import { fetchApi } from "@/lib/api/fetch";

export const useUserProfile = (address: string | null | undefined) => {
  const [username, setUsername] = useState("Web3 User");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("I'm new to Web3 learning!");
  const [avatar, setAvatar] = useState<FileInfo>({
    id: "",
    size: 0,
    mimetype: "",
    title: "",
  });
  const [avatarUrl, setAvatarUrl] = useState("");
  const updateProfile = (
    newUsername: string,
    newDescription: string,
    newTitle: string,
    newAvatar?: FileInfo
  ) => {
    setUsername(newUsername);
    setDescription(newDescription);
    setTitle(newTitle);
    if (newAvatar) setAvatar(newAvatar);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!address) return;
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const user = await fetchApi<UserProfile>("user/profile", {
          method: "POST",
          body: JSON.stringify({ address, token }),
        });
        setAvatar(user.avatar);
        setAvatarUrl(user.avatarUrl || "");
        setDescription(user.description);
        setTitle(user.title);
        setUsername(user.username);
      } catch (e) {
        // 可加 toast 错误提示
      }
    };
    fetchProfile();
  }, [address]);

  return {
    username,
    title,
    description,
    avatar,
    avatarUrl,
    address,
    updateProfile,
  };
};
