import React from "react";

import Image from "next/image";

const LoadingPostBox = () => {
  return (
    <div className="border border-black flex flex-col rounded-md shadow-lg bg-transparent">
      <div className="flex gap-2 w-full p-2 items-center justify-start border-b border-black rounded-md shadow-md cursor-pointer">
        <div className="h-6 w-6 rounded-full skeleton"></div>
        <div>
          <p className="skeleton skeleton-text"></p>
          <p className="skeleton skeleton-text"></p>
        </div>
      </div>

      <div className="flex flex-col gap-2 m-2 my-4">
        <div>
          <p className="skeleton skeleton-text"></p>
          <p className="skeleton skeleton-text"></p>
          <p className="skeleton skeleton-text"></p>
          <p className="skeleton skeleton-text"></p>
          <p className="skeleton skeleton-text"></p>
        </div>

        <p className="skeleton skeleton-text"></p>
      </div>

      <div className="">
        <div className="flex justify-between items-center">
          <div className="m-2 flex gap-5">
            <div className="flex gap-1 items-center">
              <div className="h-4 w-4 relative">
                <Image
                  src="/assets/icons/Like-icon.png"
                  layout="fill"
                  className="cursor-pointer"
                />
              </div>

              <p className="text-xs"></p>
            </div>
            <div className="flex gap-1 items-center cursor-pointer">
              <Image
                src="/assets/icons/Comment-icon.png"
                width={18}
                height={18}
              />
              <p className="text-xs"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPostBox;
