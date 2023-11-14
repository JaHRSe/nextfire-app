import UserProfile from "@/components/UserProfile";
import PostFeed from "@/components/PostFeed";
import { getUserWithUsername } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  limit,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { firestore, postToJSON } from "@/lib/firebase";

export async function getServerSideProps({
  query: urlQuery,
}: {
  query: URLQuery;
}) {
  const { username } = urlQuery;
  const userDoc = await getUserWithUsername(username);

  if (!userDoc) {
    return {
      notFound: true,
    };
  }
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsRef = collection(userDoc.ref, "posts");
    const postsQuery = query(
      postsRef,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  }
  return {
    props: { user, posts },
  };
}

export default function Page({
  user,
  posts,
}: {
  user: NfUser;
  posts: string[];
}) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={false} />
    </main>
  );
}
