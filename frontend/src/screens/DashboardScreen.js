// frontend/src/screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaWallet, FaHistory, FaExchangeAlt } from 'react-icons/fa';
import Loader from '../components/Loader';
import Message from '../components/Message';
import TransactionList from '../components/TransactionList';
import { getUserProfile } from '../slices/userSlice';
import { fetchUserTransactions } from '../slices/transactionSlice';
import { getCashbackContract, formatEther } from '../utils/web3';

const DashboardScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  
  const { userInfo, loading: userLoading } = useSelector((state) => state.user);
  const { transactions, loading: transactionLoading, error: transactionError } = useSelector(
    (state) => state.transaction
  );
  const { isConnected } = useSelector((state) => state.wallet);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(getUserProfile());
      dispatch(fetchUserTransactions());
    }
  }, [dispatch, navigate, userInfo]);

  const handleWithdraw = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount to withdraw');
      return;
    }
    
    if (parseFloat(withdrawAmount) > parseFloat(userInfo.availableCashback)) {
      toast.error('Withdrawal amount exceeds available cashback');
      return;
    }
    
    try {
      setWithdrawLoading(true);
      
      const cashbackContract = getCashbackContract();
      
      if (!cashbackContract) {
        throw new Error('Could not connect to the cashback contract');
      }
      
      const tx = await cashbackContract.withdrawCashback(
        ethers.utils.parseEther(withdrawAmount)
      );
      
      await tx.wait();
      
      toast.success('Cashback withdrawn successfully!');
      setWithdrawAmount('');
      dispatch(getUserProfile());
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to withdraw cashback');
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <>
      <h1>Dashboard</h1>
      {userLoading ? (
        <Loader />
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card className='mb-4'>
                <Card.Body>
                  <Card.Title>
                    <FaWallet className='me-2' /> Wallet
                  </Card.Title>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <strong>Address:</strong>{' '}
                      {userInfo?.walletAddress}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Total Earned:</strong> ${userInfo?.totalCashbackEarned?.toFixed(2)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Available Cashback:</strong> ${userInfo?.availableCashback?.toFixed(2)}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
              
              <Card className='mb-4'>
                <Card.Body>
                  <Card.Title>
                    <FaExchangeAlt className='me-2' /> Withdraw Cashback
                  </Card.Title>
                  <Card.Text>
                    Available: ${userInfo?.availableCashback?.toFixed(2)}
                  </Card.Text>
                  <div className='d-flex'>
                    <input
                      type='number'
                      className='form-control me-2'
                      placeholder='Amount'
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min='0'
                      max={userInfo?.availableCashback}
                      step='0.01'
                    />
                    <Button
                      variant='success'
                      onClick={handleWithdraw}
                      disabled={withdrawLoading || !isConnected}
                    >
                      {withdrawLoading ? 'Processing...' : 'Withdraw'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
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

export default DashboardScreen;
