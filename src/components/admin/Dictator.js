import React, { useState } from "react";

export default function Dictator() {
  const [canEdit, setCanEdit] = useState(false);
  const [text, setText] = useState("fuad");

  function handleClick() {
    setCanEdit(!canEdit);
  }
  function handleChange(e) {
    setText(e.target.value);
  }
  function handletextChange() {
    setCanEdit(!canEdit);
  }

  return (
    <>
      <div className="bg-gray-100 mt-12">
        <div className="bg-opacity-100 h-16 mx-2 md:mx-4 flex items-center justify-between rounded shadow">
          <div>
            <div className="bg-red-200 w-10 h-10 rounded-full ml-2 md:w-12 md:h-12 md:ml-6" />
          </div>
          <div className="flex ml-1">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                Name:
              </h2>
              {!canEdit && (
                <h4 className="text-xs mt-1 sm:text-base text-gray-800">
                  Md.Muhtasim Fuad Nafiz
                </h4>
              )}
              {canEdit && (
                <input
                  // className="text-xs mt-1 sm:text-base text-gray-800 w-24 sm:w-32"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-500 w-24 sm:w-32 md:w-40"
                  onChange={handleChange}
                  type="text"
                  value={text}
                />
              )}
            </div>
            <div className="ml-2 md:ml-8">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                Position:
              </h2>
              {!canEdit && (
                <h4 className="text-xs mt-1 sm:text-base text-gray-800">
                  Regional Manager
                </h4>
              )}
              {canEdit && (
                <input
                  // className="text-xs mt-1 sm:text-base text-gray-800 w-24 sm:w-32"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-500 w-24 sm:w-32 md:w-40"
                  onChange={handleChange}
                  type="text"
                  value={text}
                />
              )}
            </div>
          </div>
          <div className="mr-2 md:mr-6 flex">
            <button
              onClick={handletextChange}
              className="h-10 w-10 md:w-24 rounded-full md:rounded-lg bg-red-200 flex items-center justify-evenly hover:bg-red-300"
            >
              <svg
                width={20}
                height={20}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 18.121h9M14.5 1.621a2.121 2.121 0 113 3L5 17.121l-4 1 1-4 12.5-12.5z"
                  stroke="#E53E3E"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h4 className="hidden md:block font-sans text-xl font-medium text-red-700">
                Edit
              </h4>
            </button>
            {canEdit && (
              <button
                onClick={handleClick}
                className="h-10 w-10 ml-1 rounded-full bg-red-200 flex items-center justify-evenly hover:bg-red-300"
              >
                <svg
                  width={20}
                  height={20}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 18.121h9M14.5 1.621a2.121 2.121 0 113 3L5 17.121l-4 1 1-4 12.5-12.5z"
                    stroke="#E53E3E"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
