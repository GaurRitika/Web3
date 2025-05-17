// frontend/src/components/MerchantCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

const MerchantCard = ({ merchant }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Card.Img
        src={merchant.logo || 'https://via.placeholder.com/200'}
        variant='top'
        style={{ height: '200px', objectFit: 'contain' }}
      />
      <Card.Body>
        <Card.Title as='div'>
          <strong>{merchant.name}</strong>
        </Card.Title>
        <Card.Text as='div'>
          <div className='my-2'>{merchant.description}</div>
        </Card.Text>
        <Card.Text as='h3'>
          Cashback: {merchant.cashbackRate}%
        </Card.Text>
        <Link to={`/merchants/${merchant._id}`}>
          <Button variant='primary' className='btn-block'>
            View Details
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default MerchantCard;
