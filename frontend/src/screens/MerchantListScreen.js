// frontend/src/screens/MerchantListScreen.js
import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import MerchantCard from '../components/MerchantCard';
import { fetchMerchants } from '../slices/merchantSlice';

const MerchantListScreen = () => {
  const dispatch = useDispatch();
  
  const { merchants, loading, error } = useSelector((state) => state.merchant);

  useEffect(() => {
    dispatch(fetchMerchants());
  }, [dispatch]);

  return (
    <>
      <h1>Partner Merchants</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          {merchants.map((merchant) => (
            <Col key={merchant._id} sm={12} md={6} lg={4} xl={3}>
              <MerchantCard merchant={merchant} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default MerchantListScreen;
