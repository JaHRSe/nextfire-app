import AuthCheck from "@/components/AuthCheck";
import { useState } from "react";
import { useRouter } from "next/router";
import { collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { firestore, auth } from "@/lib/firebase";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import styles from "@/styles/Admin.module.css";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
//import ImageUploader from '@components/ImageUploader';

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const { slug } = router.query as string;
  const uid = auth.currentUser!.uid as string;
  const postRef = doc(firestore, "users", uid, "posts", slug);
  const [post] = useDocumentDataOnce(postRef);
  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>{post.slug}</p>
            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            ></PostForm>
          </section>
        </>
      )}
      {/* {post && (
        <>
          <section>
            {" "}
            q<h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm
              postRef={postRef}
              defaultValue={post}
              preview={preveiw}
            ></PostForm>
          </section>
        </>
      )} */}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues,
    mode: "onChange",
  });
  const updatePost = async ({ content, published }) => {
    // await postRef.update({
    //   content,
    //   published,
    //   updatedAt: serverTimestamp(),
    // });
    console.log("content", content);
    console.log("published", published);
    reset({ content, published });
    toast.success("published");
  };
  return (
    <form onSubmit={handleSubmit(updatePost)}>
      <div>
        <fieldset>
          <input
            className={styles.checkbox}
            type="checkbox"
            {...register("published")}
          />
          <label>Published</label>
        </fieldset>
        <button type="submit" className="btn.green">
          save Changes
        </button>
      </div>
    </form>
    // <form onSubmit={handleSubmit(updatePost)}>
    //   {preview && (
    //     <div className="card">
    //       <ReactMarkdown>{watch("content")}</ReactMarkdown>
    //     </div>
    //   )}
    //   <div className={preview ? styles.hidden : styles.controls}>
    //     <textarea name="content" ref={register}></textarea>
    //     <fieldset>
    //       <input
    //         className={styles.checkbox}
    //         name="published"
    //         type="checkbox"
    //         ref={register}
    //       />
    //     </fieldset>
    //     <button type="submit" className="btn.green">
    //       Save Changes
    //     </button>
    //   </div>
    // </form>
  );
}
