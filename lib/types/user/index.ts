import { FileInfo } from "../upload"


export interface UserProfile {
  id: number;
  address: string;
  username: string;
  title: string;
  description: string;
  avatar: FileInfo;
  avatarUrl?: string;
}


