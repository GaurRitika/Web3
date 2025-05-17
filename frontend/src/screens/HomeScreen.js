// frontend/src/screens/HomeScreen.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Container, Card } from 'react-bootstrap';
import { FaShoppingBag, FaWallet, FaMoneyBillWave } from 'react-icons/fa';

const HomeScreen = () => {
  return (
    <>
      <div className='text-center py-5 bg-light rounded mb-4'>
        <h1>Crypto Cashback & Rewards</h1>
        <p className='lead'>
          Shop with our partner merchants and earn cryptocurrency rewards instantly
        </p>
        <Link to='/merchants'>
          <Button variant='primary' size='lg'>
            Browse Merchants
          </Button>
        </Link>
      </div>

      <Row className='mb-4'>
        <Col md={4}>
          <Card className='h-100'>
            <Card.Body className='text-center'>
              <div className='mb-3'>
                <FaShoppingBag size={50} />
              </div>
              <Card.Title>Shop Anywhere</Card.Title>
              <Card.Text>
                Shop with our partner merchants online or in-store and earn crypto rewards.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='h-100'>
            <Card.Body className='text-center'>
              <div className='mb-3'>
                <FaWallet size={50} />
              </div>
              <Card.Title>Receive Instantly</Card.Title>
              <Card.Text>
                Cashback rewards are sent directly to your wallet via blockchain.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='h-100'>
            <Card.Body className='text-center'>
              <div className='mb-3'>
                <FaMoneyBillWave size={50} />
              </div>
              <Card.Title>Withdraw Anytime</Card.Title>
              <Card.Text>
                No minimum balance required. Withdraw your rewards whenever you want.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className='text-center py-4'>
        <h2>How It Works</h2>
        <p>
          Connect your wallet, shop with our partner merchants, and automatically receive
          crypto cashback rewards directly to your wallet.
        </p>
        <Link to='/register'>
          <Button variant='success' size='lg'>
            Get Started
          </Button>
        </Link>
      </div>
    </>
  );
};

export default HomeScreen;
