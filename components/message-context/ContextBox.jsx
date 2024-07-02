"use client";

import React, { useRef, useEffect, useState } from "react";

const ContextBox = ({
  isToggle,
  setToggle,
  togglePosition,
  contextReply,
  setReplyText,
  handleDeleteText,
  toggleUser,
  setText,
  setEditText,
}) => {
  //   alert("right click");
  const wrapperRef = useRef(null);
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setToggle(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return toggleUser ? (
    <div
      className={`absolute ${
        isToggle ? "block" : "hidden"
      } h-30 w-32 bg-white shadow-xl rounded-lg border border-black p-2 z-50`}
      ref={wrapperRef}
      style={{
        left: `calc(${togglePosition[0]}px - 10rem)`,
        top: togglePosition[1],
      }}
    >
      <div className="flex flex-col gap-1 text-sm text-slate-600">
        <p
          className="context-text"
          onClick={() => {
            setReplyText(contextReply);
            setToggle(false);
          }}
        >
          reply
        </p>
        <hr />
        <p
          className="context-text blue_gradient"
          onClick={() => {
            setText(contextReply);
            setEditText(contextReply);
            setToggle(false);
          }}
        >
          edit
        </p>
        <p className="red_gradient context-text" onClick={handleDeleteText}>
          delete
        </p>
      </div>
    </div>
  ) : (
    <div
      className={`absolute ${
        isToggle ? "block" : "hidden"
      } h-30 w-32 bg-white shadow-xl rounded-lg border border-black p-2 z-50`}
      ref={wrapperRef}
      style={{
        left: togglePosition[0],
        top: togglePosition[1],
      }}
    >
      <div className="flex flex-col gap-1 text-sm text-slate-600">
        <p
          className="context-text"
          onClick={() => {
            setReplyText(contextReply);
            setToggle(false);
          }}
        >
          reply
        </p>
        <hr />
        <p className="context-text">share</p>
      </div>
    </div>
  );
};

export default ContextBox;
