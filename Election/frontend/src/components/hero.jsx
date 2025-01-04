import React from 'react'

const hero = () => {
  return (
    <div>
        <div className='flex h-[100px] w-full bg-black '>
           <div>
           <p className='text-white/50 text-3xl  p-6 tracking-wider '>DECENTRALIZED VOTING PLATFORM</p>
           </div>
           <div><p className='text-white/50 text-3xl  p-6 tracking-wider '>||</p></div>
          <div className='text-white/50 hover:text-white text-2xl  p-8 tracking-wider '><a href="/">HOME</a></div>
        </div>
    </div>
  )
}

export default hero