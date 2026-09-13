export interface Post {
  id?: number | string;
  postId: number;
  userName: string;
  tinyProfilePic: string;
  profilePic: string;
  images: string[];
  description: string;
  tag: string;
  likes: number;
  likeByMe: boolean;
  shareCount: number;
  commentCount: number;
  postCreationOrModificationDate: string;
  isMine: boolean;
}
