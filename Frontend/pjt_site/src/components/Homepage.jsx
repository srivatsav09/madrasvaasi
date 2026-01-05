import React from 'react'
import bgland from '../assets/bg.svg'
import Navbar from './Navbar'
const Homepage = () => {
  return (
    <div className="bg-cover min-h-[642px] h-screen bg-cover bg-center bg-[#01041C] pb-20" style={{backgroundImage: `URL(${bgland})`,backgroundRepeat:"no-repeat"}}>
        <div className=''>
            <Navbar/>
        </div>
        <div className='pl-16'>
            <div className="pt-20 w-[1022px] leading-[8rem] text-white text-[120px] font-extrabold font-['League Spartan']">DISCOVER CHENNAI</div>
            <div className="pl-5 text-white text-[32px] font-light font-['Inter']">Echoing the City's Untold Stories</div>
        </div>    
        <div className="text-white w-fit font-bold font-['Inter'] text-left relative ml-[5rem] mt-10 scale-[100%] hover:scale-[110%] hover:transition-all">
          <a className = "bg-black w-fit text-2xl p-[0.7rem] rounded-[6rem]" href="/history">
            HISTORY
          </a>
        </div>
        <div className="text-black text-[16px] w-fit font-bold font-['Inter'] text-left relative ml-[5.2rem]">
          <div className = "mt-4">
            Click to know more about
          </div>
          <div className = "leading-[15px]">
            Chennai's history
          </div>
        </div>
    </div>
  )
}

export default Homepage