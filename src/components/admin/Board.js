import React from "react";

const Board = () => {
  return (
    <>
      <div className="grid gap-8 mt-8 ml-64 mr-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-rows-4">
        <div className="bg-indigo-100 h-64 rounded-2xl"></div>
        <div className="bg-indigo-100 h-64 rounded-2xl"></div>
        <div className="bg-indigo-100 h-64 rounded-2xl"></div>
        <div className="bg-indigo-100 h-64 rounded-2xl  grid place-content-center">
          <div>
            <button className="grid place-content-center border-4 border-teal-400 h-24 w-24 rounded-2xl">
              <svg
                width={50}
                height={43}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25 20v21M42.55 35a10.626 10.626 0 004.579-5.128 10.979 10.979 0 00.548-6.932 10.75 10.75 0 00-3.712-5.819 10.287 10.287 0 00-6.412-2.259H34.92a17.314 17.314 0 00-3.45-6.817 16.767 16.767 0 00-6.004-4.59 16.36 16.36 0 00-7.355-1.443 16.401 16.401 0 00-7.232 1.994 16.858 16.858 0 00-5.658 5.03 17.388 17.388 0 00-2.952 7.06 17.585 17.585 0 00.348 7.673 17.295 17.295 0 003.577 6.749"
                  stroke="#4FD1C5"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M33 31l-8-11-8 11"
                  stroke="#4FD1C5"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h2 className="text-center mt-4 text-xl font-sans font-bold">
              Upload
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
