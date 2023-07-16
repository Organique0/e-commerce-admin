import { useSession } from "next-auth/react";

export default function HomeHeader() {
  const { data: session } = useSession();
  return (
    <div className="tex-blue-900 flex justify-between">
      <h2 className="mt-0">
        <div className="flex gap-2 items-center">
          <img
            src={session?.user?.image}
            alt=""
            className="w-6 h-6 sm:hidden"
          />
          <div>
            hello,
            <b> {session?.user?.name}</b>
          </div>
        </div>
      </h2>
      <div className="hidden bg-gray-200 text-black gap-1 overflow-hidden h-full sm:flex">
        <img src={session?.user?.image} alt="" className="w-6 h-6" />
        <span className="px-2">{session?.user?.name}</span>
      </div>
    </div>
  );
}
