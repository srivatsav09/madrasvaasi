// // Signup.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; 

// const Signup = () => {
//     const navigate = useNavigate();
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
    
//     const handleSignup = async () => {
//         try {
//             // Make an API call to your Django backend for signup
//             const response = await axios.post('http://127.0.0.1:8000/api/signup', {
//                 username: username,
//                 password: password,
//             });
//             console.log("your token: ",response.data);  // Log the response data for debugging
//             if (response.status === 201) {
//                 console.log('Signup successful!');
//                 // Redirect the user to the homepage
//                 navigate('/');
//               } else {
//                 console.log('Signup failed. Server returned:', response.status, response.data);
//                 // Handle the case where login failed
//               }
//       // Handle the response data or redirect the user as needed
//     } catch (error) {
//       console.error('Error making API call:', error);
//       // Handle the error as needed
//     }
//   };
// return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="bg-black p-8 rounded shadow-md w-full max-w-md">
//         <h1 className="text-gray-400 text-2xl font-bold mb-4">Signup</h1>
//         <form>
//           <div className="mb-4">
//             <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="username">
//               Username:
//             </label>
//             <input
//               className="border rounded w-full py-2 px-3"
//               type="text"
//               id="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter your username"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
//               Password:
//             </label>
//             <input
//               className="border rounded w-full py-2 px-3"
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//             />
//           </div>
//           <button
//             className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
//             type="button"
//             onClick={handleSignup}
//           >
//             Signup
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the useAuth hook from your AuthContext

const Signup = () => {
    const navigate = useNavigate();
    const { setToken } = useAuth(); // Get the setToken function from your AuthContext
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSignup = async () => {
        try {
            // Make an API call to your Django backend for signup
            const response = await axios.post('http://127.0.0.1:8000/api/signup', {
                username: username,
                password: password,
            });
            console.log("your token: ",response.data);  // Log the response data for debugging
            if (response.status === 201) {
                console.log('Signup successful!');
                // Set the access token in the context
                setToken(response.data.access);
                // Redirect the user to the homepage
                navigate('/');
            } else {
                console.log('Signup failed. Server returned:', response.status, response.data);
                // Handle the case where signup failed
            }
            // Handle the response data or redirect the user as needed
        } catch (error) {
            console.error('Error making API call:', error);
            // Handle the error as needed
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-black p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-gray-400 text-2xl font-bold mb-4">Signup</h1>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="username">
                            Username:
                        </label>
                        <input
                            className="border rounded w-full py-2 px-3"
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
                            Password:
                        </label>
                        <input
                            className="border rounded w-full py-2 px-3"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                        type="button"
                        onClick={handleSignup}
                    >
                        Signup
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
