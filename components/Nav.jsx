"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { motion } from "framer-motion";

import { usePathname, useRouter } from "next/navigation";
import { animatePageOut } from "@utils/animation";

const Nav = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (href) => {
    if (pathname !== href) {
      animatePageOut(href, router);
    }
  };
  return (
    <nav className="absolute bg-gray-700 z-50 shadow-xl -translate-x-1/2 left-1/2 flex gap-10 bottom-5 w-[calc(100%-40px)] items-center justify-center py-2 rounded-xl md:w-16 md:translate-x-0 md:left-4 md:top-3 md:bottom-auto md:h-fit md:px-0 md:py-10 md:flex-col">
      <button
        onClick={() => {
          handleClick("/");
        }}
      >
        <motion.div
          className="relative w-7 h-7"
          whileTap={{ scale: 1.5, rotate: "15deg" }}
          transition={{
            duration: 0.125,
          }}
        >
          <Image src="/assets/icons/Home-button.png" layout="fill" />
        </motion.div>
      </button>
      <Link href="/searchUser" className="">
        <motion.div
          className="relative w-7 h-7"
          whileTap={{ scale: 1.5, rotate: "15deg" }}
          transition={{
            duration: 0.125,
          }}
        >
          <Image src="/assets/icons/Search-results.png" layout="fill" />
        </motion.div>
      </Link>
      {session?.user && (
        <Link href="/create-post" className="">
          <motion.div
            className="relative w-7 h-7"
            whileTap={{ scale: 1.5, rotate: "15deg" }}
            transition={{
              duration: 0.125,
            }}
          >
            <Image src="/assets/icons/Plus-icon.png" width={30} height={30} />
          </motion.div>
        </Link>
      )}
      <Link href="/" className="">
        <motion.div
          className="relative w-7 h-7"
          whileTap={{ scale: 1.5, rotate: "15deg" }}
          transition={{
            duration: 0.125,
          }}
        >
          <Image src="/assets/icons/Setting-icon.png" layout="fill" />
        </motion.div>
      </Link>
      {session?.user && (
        <Link href="/profile" className="">
          <motion.div
            className="relative w-7 h-7"
            whileTap={{ scale: 1.5, rotate: "15deg" }}
            transition={{
              duration: 0.125,
            }}
          >
            <Image
              src={session?.user.image}
              layout="fill"
              className="rounded-full border-white border-2"
            />
          </motion.div>
        </Link>
      )}
    </nav>
  );
};

export default Nav;
