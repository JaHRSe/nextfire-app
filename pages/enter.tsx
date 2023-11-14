import { googleAuthProvider, auth, firestore } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useContext } from "react";
import { userContext } from "@/lib/context";
import UserForm from "@/components/UserForm";

const EnterPage: React.FC = () => {
  const { user, username } = useContext(userContext);
  return (
    <main>
      {user ? !username ? <UserForm /> : <SignOutButton /> : <SignInButton />}
    </main>
  );
};

export default EnterPage;

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };
  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"/google.png"} />
      Sign In with Google
    </button>
  );
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UserNameForm() {}
