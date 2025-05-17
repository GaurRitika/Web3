// // frontend/src/App.js
// import React from 'react';
// import { Route, Routes } from 'react-router-dom';
// import { Container } from 'react-bootstrap';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // Components
// import Header from './components/Header';
// import Footer from './components/Footer';

// // Screens
// import HomeScreen from './screens/HomeScreen';
// import LoginScreen from './screens/LoginScreen';
// import RegisterScreen from './screens/RegisterScreen';
// import ProfileScreen from './screens/ProfileScreen';
// import DashboardScreen from './screens/DashboardScreen';
// import MerchantListScreen from './screens/MerchantListScreen';
// import MerchantDetailScreen from './screens/MerchantDetailScreen';
// import MerchantDashboardScreen from './screens/MerchantDashboardScreen';
// import AdminDashboardScreen from './screens/AdminDashboardScreen';

// const App = () => {
//   return (
//     <>
//       <Header />
//       <main className='py-3'>
//         <Container>
//           <Routes>
//             <Route path='/' element={<HomeScreen />} />
//             <Route path='/login' element={<LoginScreen />} />
//             <Route path='/register' element={<RegisterScreen />} />
//             <Route path='/profile' element={<ProfileScreen />} />
//             <Route path='/dashboard' element={<DashboardScreen />} />
//             <Route path='/merchants' element={<MerchantListScreen />} />
//             <Route path='/merchants/:id' element={<MerchantDetailScreen />} />
//             <Route path='/merchant/dashboard' element={<MerchantDashboardScreen />} />
//             <Route path='/admin/dashboard' element={<AdminDashboardScreen />} />
//           </Routes>
//         </Container>
//       </main>
//       <Footer />
//       <ToastContainer />
//     </>
//   );
// };

// export default App;


// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Screens
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import DashboardScreen from './screens/DashboardScreen';
import MerchantListScreen from './screens/MerchantListScreen';
import MerchantDetailScreen from './screens/MerchantDetailScreen';
import MerchantDashboardScreen from './screens/MerchantDashboardScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';

const App = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/merchants" element={<MerchantListScreen />} />
            <Route path="/merchants/:id" element={<MerchantDetailScreen />} />
            <Route path="/merchant/dashboard" element={<MerchantDashboardScreen />} />
            <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;