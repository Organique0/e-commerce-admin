import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="tex-blue-900 flex justify-between">
        <h2 className="mt-0">
          hello,
          <b> {session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-200 text-black gap-1 overflow-hidden h-full">
          <img src={session?.user?.image} alt="" className="w-6 h-6" />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
