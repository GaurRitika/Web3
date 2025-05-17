// // frontend/src/components/Header.js
// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { LinkContainer } from 'react-router-bootstrap';
// import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
// import { FaWallet, FaUser, FaSignOutAlt } from 'react-icons/fa';
// import { connectWallet } from '../slices/walletSlice';
// import { logout } from '../slices/userSlice';

// const Header = () => {
//   const dispatch = useDispatch();
  
//   const { userInfo } = useSelector((state) => state.user);
//   const { walletAddress, isConnected } = useSelector((state) => state.wallet);
  
//   const handleConnectWallet = () => {
//     dispatch(connectWallet());
//   };
  
//   const handleLogout = () => {
//     dispatch(logout());
//   };
  
//   const truncateAddress = (address) => {
//     if (!address) return '';
//     return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
//   };
  
//   return (
//     <header>
//       <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
//         <Container>
//           <LinkContainer to='/'>
//             <Navbar.Brand>Crypto Cashback</Navbar.Brand>
//           </LinkContainer>
//           <Navbar.Toggle aria-controls='basic-navbar-nav' />
//           <Navbar.Collapse id='basic-navbar-nav'>
//             <Nav className='ms-auto'>
//               <LinkContainer to='/merchants'>
//                 <Nav.Link>Merchants</Nav.Link>
//               </LinkContainer>
              
//               {userInfo ? (
//                 <>
//                   <LinkContainer to='/dashboard'>
//                     <Nav.Link>Dashboard</Nav.Link>
//                   </LinkContainer>
//                   <NavDropdown title={userInfo.email || truncateAddress(userInfo.walletAddress)} id='username'>
//                     <LinkContainer to='/profile'>
//                       <NavDropdown.Item>
//                         <FaUser /> Profile
//                       </NavDropdown.Item>
//                     </LinkContainer>
//                     <NavDropdown.Item onClick={handleLogout}>
//                       <FaSignOutAlt /> Logout
//                     </NavDropdown.Item>
//                   </NavDropdown>
//                 </>
//               ) : (
//                 <>
//                   <LinkContainer to='/login'>
//                     <Nav.Link>
//                       <FaUser /> Sign In
//                     </Nav.Link>
//                   </LinkContainer>
                  
//                   <LinkContainer to='/register'>
//                     <Nav.Link>Register</Nav.Link>
//                   </LinkContainer>
//                 </>
//               )}
              
//               {!isConnected ? (
//                 <Button variant='outline-success' onClick={handleConnectWallet}>
//                   <FaWallet /> Connect Wallet
//                 </Button>
//               ) : (
//                 <Button variant='outline-success' disabled>
//                   <FaWallet /> {truncateAddress(walletAddress)}
//                 </Button>
//               )}
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>
//     </header>
//   );
// };

// export default Header;



// frontend/src/components/Header.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { FaWallet, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { connectWallet } from '../slices/walletSlice';
import { logout } from '../slices/userSlice';
import { useNavigate, Link } from 'react-router-dom'; // Import Link instead

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userInfo } = useSelector((state) => state.user);
  const { walletAddress, isConnected } = useSelector((state) => state.wallet);
  
  const handleConnectWallet = () => {
    dispatch(connectWallet());
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          {/* Replace LinkContainer with Nav.Link wrapped in Link */}
          <Navbar.Brand as={Link} to="/">
            Crypto Cashback
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <Nav.Link as={Link} to="/merchants">
                Merchants
              </Nav.Link>
              
              {userInfo ? (
                <>
                  <Nav.Link as={Link} to="/dashboard">
                    Dashboard
                  </Nav.Link>
                  <NavDropdown title={userInfo.email || truncateAddress(userInfo.walletAddress)} id='username'>
                    <NavDropdown.Item as={Link} to="/profile">
                      <FaUser /> Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">
                    <FaUser /> Sign In
                  </Nav.Link>
                  
                  <Nav.Link as={Link} to="/register">
                    Register
                  </Nav.Link>
                </>
              )}
              
              {!isConnected ? (
                <Button variant='outline-success' onClick={handleConnectWallet}>
                  <FaWallet /> Connect Wallet
                </Button>
              ) : (
                <Button variant='outline-success' disabled>
                  <FaWallet /> {truncateAddress(walletAddress)}
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;