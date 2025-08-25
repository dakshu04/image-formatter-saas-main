import Link from "next/link";

export default function Home() {
  return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <Link className="bg-blue-700 rounded-xl p-2" href="/sign-in">
          Sign In
        </Link>
        <Link className=" bg-blue-700 rounded-xl p-2" href="/sign-up">
          Sign Up
        </Link>
      </div>      
  );
}
