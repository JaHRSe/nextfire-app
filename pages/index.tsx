import { useState } from "react";
import { firestore, postToJSON, fromMillis } from "@/lib/firebase";
import {
  collectionGroup,
  query,
  where,
  getDocs,
  limit,
  orderBy,
  startAfter,
} from "firebase/firestore";
import PostFeed from "@/components/PostFeed";
import Loader from "@/components/Loader";

const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = query(
    collectionGroup(firestore, "posts"),
    where("published", "==", true),
    limit(LIMIT)
  );
  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  return {
    props: { posts },
  };
}

export default function Home(props: { posts: Post[] }) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;
    const newPostsQuery = query(
      collectionGroup(firestore, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );
    const newPosts = (await getDocs(newPostsQuery)).docs.map((doc) =>
      doc.data()
    ) as Post[];
    setLoading(false);
    setPosts(newPosts);
    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} admin={false} />
      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load More</button>
      )}
      <Loader show={loading} />
      {postsEnd && "You have reached the end!"}
    </main>
  );
}
