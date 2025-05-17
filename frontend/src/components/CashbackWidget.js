// frontend/src/components/CashbackWidget.js
import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getCashbackContract, parseEther } from '../utils/web3';

const CashbackWidget = ({ merchant }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { walletAddress, isConnected } = useSelector((state) => state.wallet);
  
  const handleCashbackRequest = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    try {
      setLoading(true);
      
      const cashbackContract = getCashbackContract();
      
      if (!cashbackContract) {
        throw new Error('Could not connect to the cashback contract');
      }
      
      // Calculate expected cashback
      const expectedCashback = (parseFloat(amount) * merchant.cashbackRate) / 100;
      
      // Mock transaction for demo purposes
      // In a real app, this would be triggered by the merchant after a purchase
      
      toast.success(`You would receive ${expectedCashback} CASH tokens as cashback for this purchase!`);
      setAmount('');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to process cashback request');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className='my-3'>
      <Card.Body>
        <Card.Title>Simulate Cashback</Card.Title>
        <Card.Text>
          See how much cashback you would earn when shopping with {merchant.name}.
        </Card.Text>
        <Form onSubmit={handleCashbackRequest}>
          <Form.Group controlId='amount'>
            <Form.Label>Purchase Amount ($)</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter purchase amount'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min='0'
              step='0.01'
              required
            />
          </Form.Group>
          <Form.Text className='text-muted'>
            Expected Cashback: ${((amount || 0) * merchant.cashbackRate / 100).toFixed(2)} ({merchant.cashbackRate}%)
          </Form.Text>
          <Button
            variant='primary'
            type='submit'
            className='mt-3'
            disabled={loading || !isConnected}
          >
            {loading ? 'Processing...' : 'Simulate Purchase'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CashbackWidget;
