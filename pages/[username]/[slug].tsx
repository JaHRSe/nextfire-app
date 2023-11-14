import {
  firestore,
  getUserWithUsername,
  postToJSON,
  getUserUid,
} from "@/lib/firebase";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";

import { useDocumentData } from "react-firebase-hooks/firestore";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const uid = await getUserUid(username);
  const userDoc = await getUserWithUsername(username);
  let post;
  let path;
  if (userDoc) {
    const docRef = doc(firestore, "users", uid, "posts", slug);
    post = await getDoc(docRef);
    post = postToJSON(post);
    path = docRef.path;
  }
  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  console.log("here      ");
  const snapshot = await getDocs(query(collectionGroup(firestore, "posts")));
  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });
  return { paths, fallback: "blocking" };
}

export default function Post(props) {
  // const postRef = getDoc(props.path);
  // const [realTimePost] = useDocumentData(postRef);
  // const post = realTimePost | props.post;
  // return <main className={styles.container}></main>;
}
