export interface Comment {
  id: number;
  postId: number;
  commentBy: string;
  tinyProfilePic: string;
  comment: string;
  creationdate: string;
  likescount: number;
  likeByMe: boolean;
}
