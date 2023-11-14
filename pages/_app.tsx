import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GetServerSideProps } from "next";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { userContext } from "@/lib/context";
import { useUserData } from "@/lib/hooks";

export default function App({ Component, pageProps }: AppProps) {
  const { user, username } = useUserData();
  return (
    <userContext.Provider value={{ user, username }}>
      <Navbar></Navbar>
      <Component {...pageProps} />;
      <Toaster />
    </userContext.Provider>
  );
}
