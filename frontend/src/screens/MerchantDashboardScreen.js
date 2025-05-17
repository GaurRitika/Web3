// frontend/src/screens/MerchantDashboardScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaQrcode, FaHistory } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import TransactionList from '../components/TransactionList';
import { getMerchantProfile } from '../slices/merchantSlice';
import { processTransaction, fetchMerchantTransactions } from '../slices/transactionSlice';

const MerchantDashboardScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [userWalletAddress, setUserWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [qrValue, setQrValue] = useState('');
  
  const { merchantInfo, loading: merchantLoading } = useSelector((state) => state.merchant);
  const { transactions, loading: transactionLoading, error: transactionError } = useSelector(
    (state) => state.transaction
  );

  useEffect(() => {
    if (!merchantInfo) {
      navigate('/merchant/login');
    } else {
      dispatch(getMerchantProfile());
      dispatch(fetchMerchantTransactions());
    }
  }, [dispatch, navigate, merchantInfo]);

  useEffect(() => {
    if (userWalletAddress && amount && amount > 0) {
      const qrData = JSON.stringify({
        merchant: merchantInfo?.walletAddress,
        amount,
        timestamp: Date.now(),
      });
      setQrValue(qrData);
    } else {
      setQrValue('');
    }
  }, [userWalletAddress, amount, merchantInfo]);

  const handleProcessTransaction = (e) => {
    e.preventDefault();
    
    if (!userWalletAddress || !amount || amount <= 0) {
      toast.error('Please provide a valid wallet address and amount');
      return;
    }
    
    dispatch(processTransaction({ userWalletAddress, amount }))
      .unwrap()
      .then(() => {
        toast.success('Transaction processed successfully');
        setUserWalletAddress('');
        setAmount('');
        setQrValue('');
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <>
      <h1>Merchant Dashboard</h1>
      {merchantLoading ? (
        <Loader />
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card className='mb-4'>
                <Card.Body>
                  <Card.Title>Process Cashback</Card.Title>
                  <Form onSubmit={handleProcessTransaction}>
                    <Form.Group controlId='userWalletAddress' className='mb-3'>
                      <Form.Label>Customer Wallet Address</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='0x...'
                        value={userWalletAddress}
                        onChange={(e) => setUserWalletAddress(e.target.value)}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group controlId='amount' className='mb-3'>
                      <Form.Label>Purchase Amount ($)</Form.Label>
                      <Form.Control
                        type='number'
                        placeholder='100.00'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min='0.01'
                        step='0.01'
                        required
                      />
                    </Form.Group>
                    
                    <Button type='submit' variant='primary' className='w-100'>
                      Process Transaction
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
              
              {qrValue && (
                <Card className='mb-4'>
                  <Card.Body className='text-center'>
                    <Card.Title>
                      <FaQrcode className='me-2' /> Transaction QR Code
                    </Card.Title>
                    <div className='my-3'>
                      <QRCodeSVG value={qrValue} size={200} />
                    </div>
                    <small className='text-muted'>
                      Scan with the Crypto Cashback mobile app
                    </small>
                  </Card.Body>
                </Card>
              )}
            </Col>
            
            <Col md={8}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <FaHistory className='me-2' /> Recent Transactions
                  </Card.Title>
                  {transactionLoading ? (
                    <Loader />
                  ) : transactionError ? (
                    <Message variant='danger'>{transactionError}</Message>
                  ) : transactions?.length === 0 ? (
                    <Message>No transactions found</Message>
                  ) : (
                    <TransactionList transactions={transactions} />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default MerchantDashboardScreen;
