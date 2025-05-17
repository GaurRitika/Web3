// frontend/src/screens/LoginScreen.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { connectWallet, signMessage } from '../slices/walletSlice';
import { getUserNonce, loginWithWallet, clearError } from '../slices/userSlice';

const LoginScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { walletAddress, isConnected, signature, loading: walletLoading } = useSelector(
    (state) => state.wallet
  );
  
  const { userInfo, loading: userLoading, error, nonce } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isConnected && walletAddress && !nonce) {
      dispatch(getUserNonce(walletAddress));
    }
  }, [dispatch, isConnected, walletAddress, nonce]);

  useEffect(() => {
    if (signature && walletAddress) {
      dispatch(loginWithWallet({ walletAddress, signature }));
    }
  }, [dispatch, signature, walletAddress]);

  const handleConnectWallet = async () => {
    await dispatch(connectWallet());
  };

  const handleSignMessage = () => {
    if (nonce) {
      const message = `Sign this message to authenticate with nonce: ${nonce}`;
      dispatch(signMessage({ message, address: walletAddress }));
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {(userLoading || walletLoading) && <Loader />}

      <div className='mb-4'>
        <h4>Connect with Web3 Wallet</h4>
        {!isConnected ? (
          <Button variant='primary' onClick={handleConnectWallet}>
            Connect Wallet
          </Button>
        ) : !signature ? (
          <>
            <p>Wallet connected: {walletAddress}</p>
            <Button variant='success' onClick={handleSignMessage}>
              Sign Message to Login
            </Button>
          </>
        ) : (
          <p>Signing in...</p>
        )}
      </div>

      <Row className='py-3'>
        <Col>
          New user?{' '}
          <Link to='/register'>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
