import React from "react";

const LoadingChatBox = () => {
  return (
    <div className="w-[calc(100%-1rem)] my-4 py-2 rounded-lg cursor-pointer shadow-md ml-2 hover:bg-slate-200">
      <div className="flex items-center px-2 gap-4">
        <div className="h-10 w-12 rounded-full skeleton"></div>
        <div className="w-full">
          <p className="skeleton skeleton-text"></p>
          <p className="skeleton skeleton-text"></p>
          <p className="skeleton skeleton-text"></p>
        </div>
      </div>
    </div>
  );
};

export default LoadingChatBox;
