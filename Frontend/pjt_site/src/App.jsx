// import React from 'react'
// import Homepage from './components/Homepage'
// const App = () => {
//   return (
//     <div>
//       <Homepage/> 
//     </div>
//   )
// }

// export default App

// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import Signup from './components/signup';
import Login from './components/login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;