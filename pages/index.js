import Layout from "@/components/layout";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  // Using the : is aliasing
  const { data: session } = useSession();
  // Equivalent to:
  // const session = useSession().data
  // const { status } = useSession();
  // Equivalent to:
  // const status = useSession().status;
  console.log({ session });
  return <Layout>
    <div className="text-blue-900 flex justify-between">
      <h2>
        Hello, <b>{session?.user?.name}</b>
      </h2>
      <div className="flex bg-gray-300 gap-1 text-black rounded-md overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6" />
        <span className="px-2">
          {session?.user?.name}
        </span>

      </div>
    </div>
  </Layout>
}
