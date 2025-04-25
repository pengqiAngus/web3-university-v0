import { useEffect, useState } from "react";
import { FileInfo, UserProfile } from "@/lib/types/index";

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
    localStorage.setItem(`username_${address}`, newUsername);
    localStorage.setItem(`description_${address}`, newDescription);
    localStorage.setItem(`title_${address}`, newTitle);
  };

  useEffect(() => {
    const fetchProfile = async () => {
        if (!address) return;
        const token = localStorage.getItem('token');
        if (!token) return;

      const user = await fetch(`/api/user/profile`, {
        method: "POST",
        body: JSON.stringify({ address, token }),
      });
     const { avatar,avatarUrl, description, id, title, username }: UserProfile =
         await user.json();
        setAvatar(avatar);
        setAvatarUrl(avatarUrl || "");
        setDescription(description);
        setTitle(title);
        setUsername(username);
    };
    fetchProfile();
  }, [address]);

  return { username, title, description, avatar,avatarUrl, address, updateProfile };
};
