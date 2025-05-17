// frontend/src/screens/MerchantDetailScreen.js
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaGlobe, FaWallet } from 'react-icons/fa';
import Loader from '../components/Loader';
import Message from '../components/Message';
import CashbackWidget from '../components/CashbackWidget';
import { fetchMerchantDetails } from '../slices/merchantSlice';

const MerchantDetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { merchant, loading, error } = useSelector(
    (state) => state.merchant
  );

  useEffect(() => {
    dispatch(fetchMerchantDetails(id));
  }, [dispatch, id]);

  return (
    <>
      <Link to='/merchants' className='btn btn-light my-3'>
        <FaArrowLeft /> Go Back
      </Link>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : merchant ? (
        <Row>
          <Col md={6}>
            <Card>
              <Card.Img
                src={merchant.logo || 'https://via.placeholder.com/300'}
                alt={merchant.name}
                className='img-fluid'
              />
              <Card.Body>
                <Card.Title as='h3'>{merchant.name}</Card.Title>
                <Card.Text>{merchant.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{merchant.name}</h3>
              </ListGroup.Item>
              
              <ListGroup.Item>
                <strong>Cashback Rate:</strong> {merchant.cashbackRate}%
              </ListGroup.Item>
              
              {merchant.website && (
                <ListGroup.Item>
                  <FaGlobe /> <strong>Website:</strong>{' '}
                  <a
                    href={merchant.website}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {merchant.website}
                  </a>
                </ListGroup.Item>
              )}
              
              <ListGroup.Item>
                <FaWallet /> <strong>Wallet Address:</strong>{' '}
                {merchant.walletAddress}
              </ListGroup.Item>
            </ListGroup>
            
            <CashbackWidget merchant={merchant} />
          </Col>
        </Row>
      ) : (
        <Message>Merchant not found</Message>
      )}
    </>
  );
};

export default MerchantDetailScreen;
