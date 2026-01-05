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
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Homepage from './components/Homepage';
// import Signup from './components/signup';
// import Login from './components/login';
// import Events from './components/Events';
// import Forum from './components/Forum';
// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/" element={<Homepage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forum" element={<Forum />} />
//         <Route path="/events" element={<Events />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Homepage from './components/Homepage';
import Signup from './components/signup';
import Login from './components/login';
import Events from './components/Events';
import Forum from './components/Forum';
import PrivateRoute from './PrivateRoute'
import Tourism from './components/Tourism';
import Helpline from './components/Helpline';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path='/helpline' element={<Helpline/>}/>
          <Route element={<PrivateRoute/>}>
            
            <Route path='/forum' element={<Forum/>}/>
            <Route path='/events' element={<Events/>}/>
          </Route>
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
