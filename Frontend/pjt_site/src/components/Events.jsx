// import React, { useState, useEffect } from 'react';
// import event from '../assets/events.svg'
// import Navbar from './Navbar'
// import axios from 'axios';


// const Events = () => {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     // Fetch data from Django API when the component mounts
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/api/events/');
//         setEvents(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="bg-cover min-h-[642px] h-screen bg-cover bg-center bg-gradient-to-r from-purple-900 to-indigo-800 pb-20" style={{ backgroundImage: `URL(${event})`, backgroundRepeat: "no-repeat" }}>
//         <Navbar/>
//         <div className="w-[901px] text-white text-[120px] pl-[3rem] pt-[3rem] font-extrabold font-['League Spartan']">TRENDING EVENTS</div>
//         <div className="w-[991px] h-[0px] border-4 border-white ml-[3rem]"/>
//         <div className="overflow-y-auto h-[400px] mt-8">
//         {events.map((event) => (
//           <div key={event.Event_Title} className="flex items-center mb-4">
//           <img src={event.Image_Source} alt={event.Event_Title} className="w-20 h-20 object-cover rounded mr-4" />
//           <div>
//             <h2 className="text-white text-lg font-bold">{event.Event_Title}</h2>
//             <p className="text-white">{event.Event_Details}</p>
//             <p className="text-white">Location: {event.Location}</p>
//             <p className="text-white">Date: {event.start_date} to {event.end_date}</p>
//             <a href={event.Event_Link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Learn More</a>
//           </div>
//         </div>
//         ))}
//         </div>

//     </div>
//   )
// }

// export default Events

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import './style.css';
import bgevents from '../assets/pic2.jpg'
import { useAuth } from '../AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://127.0.0.1:8000/api/events/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <div className="outer-bg min-h-screen overflow-hidden">
      <div className="bg-cover bg-center bg-gradient-to-r from-purple-900 to-indigo-800 pb-20" style={{ backgroundImage: `URL(${bgevents})`, backgroundRepeat: "no-repeat" }}>
        <Navbar />
        <div className="w-[901px] text-white text-[120px] pl-[3rem] pt-[3rem] font-extrabold font-['League Spartan']">TRENDING EVENTS</div>
        <div className="w-[991px] h-[0px] border-2 border-white ml-[3rem]" />

        {/* Error Message */}
        {error && (
          <div className="mt-8 mx-12 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
            <button onClick={() => setError(null)} className="ml-4 font-bold">✕</button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-20 flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        )}

        <div className="mt-8 flex justify-center items-center flex-col overflow-hidden max-h-[70vh]">
          <div className="overflow-y-auto custom-scrollbar" style={{ textAlign: 'left' }}>
            {events.map((event) => {
              // console.log(event); // Log the event object to the console for debugging
              return (
                <div key={event.Event_Title} className="flex items-center mb-4 w-[80%]">
                  <img src={event.Image_Source} alt={event.Event_Title} className="w-40 h-50 object-cover rounded mr-4" />
                  <div>
                    <h2 className="text-white text-lg font-bold">{event.Event_Title}</h2>
                    <p className="text-white">{event.Event_Details}</p>
                    <p className="text-white">Location: {event.Location}</p>
                    <p className="text-white">Date: {event.start_date} to {event.end_date}</p>
                    <button
                      onClick={() => window.open(event.Event_Link, '_blank')}
                      className="text-black-500 hover:bg-black hover:text-white bg-white border-blue-500 px-4 py-2 rounded focus:outline-none focus:border-blue-700"
                    >
                      Book Now!
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
  
  
}

export default Events;
