import React, { useState } from "react";

const SubNav = () => {
  const [state, setState] = useState(true);
  return (
    <>
      <div
        onClick={() => {
          setState(!state);
        }}
        className="flex justify-between items-center mt-2"
      >
        <div className="flex items-center">
          <div>
            <svg
              className="mb-0"
              width="15"
              height="15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.625 3.75A8.966 8.966 0 007.5 1.457a8.966 8.966 0 005.876 2.292A9.004 9.004 0 017.5 13.738 9.006 9.006 0 011.625 3.75zm8.655 2.78a.75.75 0 00-1.06-1.06L6.75 7.94l-.97-.97a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.06 0l3-3z"
                fill="#718096"
              />
            </svg>
          </div>
          <div className="ml-2">
            <h3 className="text-gray-800 font-sans font-medium text-base ">
              Insurance Plan
            </h3>
          </div>
        </div>
        <div className="mr-8">
          <div className={state ? "hidden" : ""}>
            <svg
              width="20"
              height="20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                fill="#343A44"
              />
            </svg>
          </div>
          <div className={state ? "" : "hidden"}>
            <svg
              width="20"
              height="20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                fill="#718096"
              />
            </svg>
          </div>
        </div>
      </div>
      <div
        id="col_2_child"
        className={
          (state ? "hidden " : "") +
          "flex flex-col mt-2 ml-6 text-gray-800 text-md font-medium"
        }
      >
        <a className="mt-1" href="#">
          Indivisual Plan
        </a>
        <a className="mt-1" href="#">
          Corporate Solution
        </a>
        <a className="mt-1" href="#">
          Micro Insurance
        </a>
        <a className="mt-1" href="#">
          Bancassurance
        </a>
      </div>
    </>
  );
};

export default SubNav;
