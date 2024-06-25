import React from "react";

import LoadingPostBox from "./LoadingPostBox";

const LoadingProfile = () => {
  return (
    <section className="h-[calc(100%-10rem)] md:h-[calc(100%-8rem)] absolute top-28 w-[calc(100%-20px)] left-2.5 flex flex-col gap-8 md:w-100 md:-translate-x-1/2 md:left-1/2">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full skeleton"></div>
        <p className="skeleton skeleton-text"></p>
      </div>
      <div>
        <p className="skeleton skeleton-text"></p>
        <p className="skeleton skeleton-text"></p>
        <p className="skeleton skeleton-text"></p>
        <p className="skeleton skeleton-text"></p>
        <p className="skeleton skeleton-text"></p>
      </div>
      <div className="flex justify-between items-center">
        <button className="px-5 py-2 bg-slate-800 text-transparent border-0 rounded-md text-xs skeleton">
          Send message
        </button>
        <button className="px-5 py-2 bg-slate-800 text-transparent border-0 rounded-md text-xs skeleton">
          Send message
        </button>
      </div>
      <hr />
      <div className="flex flex-col gap-5 h-[calc(100%-17rem)] overflow-auto">
        <LoadingPostBox />
        <LoadingPostBox />
        <LoadingPostBox />
        <LoadingPostBox />
      </div>
    </section>
  );
};

export default LoadingProfile;
