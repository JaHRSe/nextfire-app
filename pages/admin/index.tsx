import MetaTags from "@/components/Metatags";
import AuthCheck from "@/components/AuthCheck";
import styles from "@/styles/Admin.module.css";
import PostFeed from "@/components/PostFeed";
import { userContext } from "@/lib/context";
import { firestore, auth } from "@/lib/firebase";
import { query, serverTimestamp, orderBy } from "firebase/firestore";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { kebabCase } from "lodash";
import toast from "react-hot-toast";
import { collection, setDoc, doc } from "firebase/firestore";

export default function AdminPostPage({}) {
  return (
    <AuthCheck>
      <main>
        <MetaTags title="adminpage" />
        Admin Page
        <PostList />
        <CreateNewPost />
      </main>
    </AuthCheck>
  );
}

function PostList() {
  console.log(auth);
  const ref = collection(firestore, "users", auth.currentUser.uid, "posts");
  const q = query(ref, orderBy("createdAt"));
  const [querySnapshot] = useCollection(q);
  const posts = querySnapshot?.docs.map((doc) => doc.data());
  return (
    <>
      <h1>Manage your posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(userContext);
  const [title, setTitle] = useState("");
  const slug = encodeURI(kebabCase(title));
  const isvalid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid;
    const ref = collection(firestore, "users", uid!, "posts");

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };
    await setDoc(doc(ref, slug), data);
    toast.success("Post Created!");
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Article Title"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong>
        {slug}
      </p>
      <button type="submit" disabled={!isvalid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
