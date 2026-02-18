import React, { useEffect, useState } from "react";
import SubNav from "./SubNav";

const Navbar = () => {
  const [divShow, setDivShow] = useState(false);
  return (
    <>
      <div className="mt-8 flex justify-between">
        <span className="ml-8">
          <svg
            width="30"
            height="30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="15" cy="15" r="15" fill="#7CD4C9" />
          </svg>
        </span>
        <span
          onClick={() => {
            setDivShow(!divShow);
          }}
          className={(divShow ? "hidden " : "") + "mr-8"}
        >
          <svg
            width="30"
            height="30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 22.5h20M5 7.5h20H5zM5 15h20H5z"
              stroke="#343A44"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span
          onClick={() => {
            setDivShow(!divShow);
          }}
          className={(divShow ? "" : "hidden ") + "mr-8 mt-2"}
          // className="mr-8 mt-1 hidden"
        >
          <svg
            width="17"
            height="17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1l15 15M1 16L16 1 1 16z"
              stroke="#343A44"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <div className={"h-1 w-full mt-3 bg-gray-300"}></div>
      {/* <div className="ml-8 mt-6"> */}
      <div className={(divShow ? "" : "hidden ") + "ml-8 mt-6"}>
        <div className="flex justify-start items-center">
          <div className="logo mr-2">
            <svg
              className="mb-0"
              width="15"
              height="15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.03 1.72a.75.75 0 00-1.06 0L1.72 6.97a.75.75 0 001.06 1.06L3 7.81v4.94a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75v-1.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v1.5a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75V7.81l.22.22a.75.75 0 001.06-1.06L8.03 1.72z"
                fill="#000"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-gray-900 font-sans font-medium text-lg">
              Home
            </h3>
          </div>
        </div>
        <SubNav />
      </div>
    </>
  );
};

export default Navbar;
