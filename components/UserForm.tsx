import {
  useState,
  useContext,
  ChangeEvent,
  useEffect,
  useCallback,
  FormEvent,
} from "react";
import { userContext } from "@/lib/context";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import debounce from "lodash.debounce";
import { write } from "fs";

export default function UserForm() {
  const { user, username } = useContext(userContext);
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const checkUserName = useCallback(
    debounce(async (username: string) => {
      if (username.length > 3) {
        //const colRef = collection(firestore, "username");
        const colRef = collection(firestore, "usernames");
        const ref = doc(colRef, username);
        const docSnap = await getDoc(ref);
        setIsValid(!docSnap.exists());
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userDoc = doc(firestore, "users", user.uid);
    const usernameDoc = doc(firestore, "usernames", formValue);

    const batch = writeBatch(firestore);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  useEffect(() => {
    checkUserName(formValue);
  }, [formValue]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setIsLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setIsLoading(true);
      setIsValid(true);
    }
  };

  return (
    !username && (
      <section>
        <h3>Choose a Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>
        </form>
        <h3>Debug State</h3>
        <div>
          Username: {formValue}
          <br />
          Loading: {loading.toString()}
          <br />
          Username Valid: {isValid.toString()}
        </div>
      </section>
    )
  );
}
//@ts-ignore
function UsernameMessage({ username, isValid, loading }) {
  console.log("check called");
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
