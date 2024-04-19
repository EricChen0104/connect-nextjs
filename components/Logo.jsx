"use client";

import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import "next-auth/react";

const Logo = () => {
  const { data: session } = useSession();

  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };

    setUpProviders();
  }, []);

  return (
    <section className="z-50 absolute left-5 top-8 flex items-center justify-between w-[calc(100%-40px)] md:left-32 md:w-[calc(100%-175px)]">
      <div className=" text-3xl font-semibold ">Connect</div>
      <nav className="">
        {session?.user ? (
          <div className="flex gap-3">
            <button
              className="black_btn"
              type="button"
              onClick={() => {
                signOut();
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  className="black_btn"
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </nav>
    </section>
  );
};

export default Logo;
