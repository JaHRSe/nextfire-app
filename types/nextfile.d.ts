interface NfUser {
  photoURL: string;
  username: string;
  displayName: string;
}

interface URLQuery {
  username: string;
}

interface Post {
  content: string;
  username: string;
  slug: string;
  title: string;
  heartCount: number;
  createdAt: number;
}
