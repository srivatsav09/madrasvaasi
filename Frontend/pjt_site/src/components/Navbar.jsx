import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import m from '../assets/m.svg';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

  return (
    <div className='w-full'>
        <nav className="flex text-white text-xl font-bold font-['Inter'] justify-between items-center px-8 pt-8 max-w-[1400px] mx-auto">
          {/* Left side - Navigation Links */}
          <div className="flex space-x-6">
            <Link to="/" className="hover:text-gray-300 transition">
                HOME
            </Link>
            <Link to="/forum" className="hover:text-gray-300 transition">
                FORUM
            </Link>
            <Link to="/events" className="hover:text-gray-300 transition">
                EVENTS
            </Link>
            <Link to="/tourism" className="hover:text-gray-300 transition">
                TOURISM
            </Link>
            <Link to="/helpline" className="hover:text-gray-300 transition">
                HELPLINE
            </Link>
            <Link to="/about" className="hover:text-gray-300 transition">
                ABOUT
            </Link>
          </div>

          {/* Right side - Profile Menu */}
          <div className="relative">
            <div className="cursor-pointer" onClick={toggleDropdown}>
              <button className="focus:outline-none">
                <img src={m} alt="Profile" className="w-8 h-8" />
              </button>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded shadow-md w-32 z-50">
                <ul className="py-1">
                  <li>
                    <Link to="/signup" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={closeDropdown}>Signup</Link>
                  </li>
                  <li>
                    <Link to="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={closeDropdown}>Login</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
  )
}

export default Navbar