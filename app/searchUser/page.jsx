"use client";

import { useState } from "react";

import UserBox from "@components/UserBox";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SearchUser = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { data: session } = useSession();

  const handleSearch = async (e) => {
    setLoading(true);
    const response = await fetch(`/api/users/search`, {
      method: "POST",
      body: JSON.stringify({
        userId: e,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.foundUsers);
      setUserList(data.foundUsers);

      setLoading(false);
    }
  };

  const handleToViewProfile = (user) => {
    if (session?.user.id === user._id) router.push("/profile");
    else router.push(`/other-profile?id=${user._id}`);
  };

  return (
    <div className="app">
      <div className="innerApp">
        <div className="w-full">
          <input
            type="text"
            className="w-full bg-slate-200 py-1 px-3 rounded-md focus: outline-none mb-2"
            placeholder="search..."
            onChange={(e) => handleSearch(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            {!loading && (
              <div>
                {userList.length > 0 ? (
                  <div>
                    {userList?.map((user, index) => (
                      <div
                        onClick={() => {
                          handleToViewProfile(user);
                        }}
                      >
                        <UserBox user={user} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm mt-2 font-bold">No such user...</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
