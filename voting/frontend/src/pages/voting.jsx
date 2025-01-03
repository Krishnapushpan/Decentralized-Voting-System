import React from "react";
import votel from "../assets/images/vote7.png";
import Hero from "../components/hero";

const Voting = () => {
  return (
    <div>
      <Hero />
      <div className="ml-[170px] flex">
        <div className="h-[50px] w-[400px] mt-6 bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-md flex justify-center ml-[40px]">
          <a
            href="/addlauch"
            className="text-white tracking-wider text-2xl font-extrabold"
          >
            CONNECT TO METAMASK
          </a>
        </div>
        <div >
          <p> </p>
        </div>
      </div>
      {/* main div starting */}
      <div className="flex justify-between items-start px-10 mt-4 gap-x-8">
        <div className=" ml-[100px] h-[400px] w-[465px]">
          {/* div for timer starting */}
          <div className="ml-[70px] flex">
            <div className="h-[50px] w-[700px] mt-6 bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-md flex justify-center">
              <p className="text-white tracking-wider text-2xl font-extrabold">
                Time Left : <b>00.00</b>
              </p>
            </div>
          </div>
          {/* div for timer ending */}
          <div className=" ml-[70px] mt-6 ">
            {/* Form view */}
            <form>
  <div className="overflow-x-auto w-[500px]">
    <table className="w-full text-left border-collapse border border-gray-300 shadow-lg rounded-md">
      <thead className=" bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <tr>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm font-semibold">Index No</th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm font-semibold">Candidate Name</th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm font-semibold">Current Status of Vote</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        <tr className="hover:bg-gray-100">
          <td className="px-6 py-4 text-sm text-center font-medium text-gray-700">1</td>
          <td className="px-6 py-4 text-sm text-center text-gray-700">Candidate 1</td>
          <td className="px-6 py-4 text-sm text-center text-gray-700">0</td>
        </tr>
        <tr className="hover:bg-gray-100">
          <td className="px-6 py-4 text-sm text-center font-medium text-gray-700">2</td>
          <td className="px-6 py-4 text-sm text-center text-gray-700">Candidate 2</td>
          <td className="px-6 py-4 text-sm text-center text-gray-700">0</td>
        </tr>
        <tr className="hover:bg-gray-100">
          <td className="px-6 py-4 text-sm text-center font-medium text-gray-700">3</td>
          <td className="px-6 py-4 text-sm text-center text-gray-700">Candidate 3</td>
          <td className="px-6 py-4 text-sm text-center text-gray-700">0</td>
        </tr>
      </tbody>
    </table>
  </div>
</form>
{/* Voting part starting */}
<div className="mt-8 p-6 w-[500px] bg-white shadow-lg rounded-lg border border-gray-200">
  <p className="text-gray-800 text-lg font-medium mb-4">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam consequuntur animi endis iste sequi id voluptate perspiciatis quia officia!
  </p>
  <div className="flex flex-col sm:flex-row items-center gap-4">
    <input
      type="text"
      className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
      placeholder="Enter index no "
    />
    <button
      className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-200 text-lg font-semibold"
    >
      Confirm Vote
    </button>
  </div>
</div>
{/* Voting part ending */}

          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img
            className="h-[600px] ml-[400px] w-[750px] rounded-lg"
            src={votel}
            alt="Voting"
          />
        </div>
      </div>
    </div>
  );
};

export default Voting;
