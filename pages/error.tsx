import { Button } from "@/components/ui/button";
import Link from "next/link";

const Error = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-8 bg-zinc-900 px-8">
      <div className="text-center text-3xl text-white">
        Oops! Something went wrong.
      </div>
      <Link href="/login">
        <Button className="rounded-full border border-white px-6 text-xs text-white transition hover:bg-white hover:text-black">
          BACK TO LOGIN PAGE
        </Button>
      </Link>
    </div>
  );
};

export default Error;
