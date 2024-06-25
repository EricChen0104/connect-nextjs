import React from "react";
import Image from "next/image";

const UserBox = ({ user }) => {
  return (
    <div className="hover:bg-slate-200 rounded-lg cursor-pointer">
      <div className="flex items-center gap-4 mb-2 px-2 py mt-2">
        <div className="relative h-10 w-10 mt-2">
          <Image src={user.image} fill className="rounded-full" />
        </div>
        <div className="flex flex-col text-sm">
          <p>{user.username}</p>
          <p className="text-slate-600 text-xs">{user.email}</p>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default UserBox;
