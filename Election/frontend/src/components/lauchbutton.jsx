import React from 'react';

const LauchButton = () => {
   
  return (
    <div className='flex '> 
    <div className="fixed top-6 right-4">
      <div className="h-[50px] w-[300px] bg-white/30 p-4 rounded-md flex justify-center items-center shadow-lg">
        <a
          href="/addlauch"
          className="text-white tracking-wider text-xl font-extrabold hover:text-2xl transition-all"
        >
          LAUNCH ELECTION
        </a>
      </div>
    </div>
    <div className="fixed top-6 right-[350px]">
      <div className="h-[50px] w-[400px] bg-white/30 p-4 rounded-md flex justify-center items-center shadow-lg">
        <a
          href="/viewvoted"
          className="text-white tracking-wider text-xl font-extrabold hover:text-2xl transition-all"
        >
          VIEW VOTED ELECTIONS
        </a>
      </div>
    </div>
</div>
  );
};

export default LauchButton;
