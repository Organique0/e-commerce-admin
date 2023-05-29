import { useSession, signIn, signOut } from "next-auth/react";
export default function Home() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className={"bg-blue-300 w-screen h-screen flex items-center"}>
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 rounded-lg px-4"
          >
            login with google
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      Signed in as {session.user.email}
      <button
        onClick={() => signOut("google")}
        className="bg-white p-2 rounded-lg px-4"
      >
        SignOut
      </button>
    </div>
  );
}
