import React from "react";
import Hero from "../components/hero"; // Importing the Hero component
import votel from "../assets/images/vote6.png";

const AddLauch = () => {
  return (
    <>
      {/* Including the Hero component */}
      <Hero />
      <div className="ml-[70px] flex">
        <div className="h-[50px] w-[400px]  mt-6 bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-md flex justify-center ml-[40px]">
          <a
            href="/addlauch"
            className="text-white tracking-wider text-2xl font-extrabold"
          >
            CONNECT TO METAMASK
          </a>
        </div>
        <div>
            <p></p>
        </div>
      </div>

      <div className="flex justify-between items-start px-10 mt-8 gap-x-8">
        {/* Form Section */}
        <form
          action=""
          className=" w-[600px] ml-[70px] bg-gray-200 p-6 shadow-md rounded-md"
        >
          <div className="mb-6">
            <label htmlFor="about" className="block text-[#1a5276] font-extrabold mb-2">
              ABOUT
            </label>
            <textarea
              name="about"
              id="about"
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the purpose of the voting..."
            ></textarea>
          </div>

          <div className="space-y-4">
            {/* Candidate 1 */}
            <div>
              <label htmlFor="candidate1" className="block text-[#1a5276] font-extrabold mb-2">
                Candidate 1
              </label>
              <input
                type="text"
                id="candidate1"
                name="candidate1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter candidate 1 name"
              />
            </div>

            {/* Candidate 2 */}
            <div>
              <label htmlFor="candidate2" className="block text-[#1a5276] font-extrabold mb-2">
                Candidate 2
              </label>
              <input
                type="text"
                id="candidate2"
                name="candidate2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter candidate 2 name"
              />
            </div>

            {/* Candidate 3 */}
            <div>
              <label htmlFor="candidate3" className="block text-[#1a5276] font-extrabold mb-2">
                Candidate 3
              </label>
              <input
                type="text"
                id="candidate3"
                name="candidate3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter candidate 3 name"
              />
            </div>
          </div>

          {/* Set Timer */}
          <div className="mt-6">
            <label htmlFor="timer" className="block text-[#1a5276] font-extrabold mb-2">
              Set Timer
            </label>
            <input
              type="datetime-local"
              id="timer"
              name="timer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              Set the end time for the voting process.
            </p>

            {/* Button Below Timer */}
            <button
              type="button"
              className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-[#1a5276] text-2xl text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline"
            >
             Lauch Voting
            </button>
          </div>
        </form>

        {/* Image Section */}
        <div className="flex-1 flex justify-center items-center">
          <img
            className="h-[500px] w-[650px] mt-[100px] rounded-lg"
            src={votel}
            alt="Voting"
          />
        </div>
      </div>
    </>
  );
};

export default AddLauch;
