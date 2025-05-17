// frontend/src/screens/AdminDashboardScreen.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  fetchMerchants,
  registerMerchant,
  updateMerchant,
  deleteMerchant,
} from '../slices/merchantSlice';

const AdminDashboardScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMerchantId, setCurrentMerchantId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    walletAddress: '',
    description: '',
    website: '',
    logo: '',
    cashbackRate: '',
  });
  
  const { userInfo } = useSelector((state) => state.user);
// frontend/src/screens/AdminDashboardScreen.js (continued)
const { merchants, loading, error, success } = useSelector((state) => state.merchant);

useEffect(() => {
  // Check if user is admin
  if (!userInfo || !userInfo.isAdmin) {
    navigate('/login');
  } else {
    dispatch(fetchMerchants());
  }
}, [dispatch, navigate, userInfo, success]);

const handleCloseModal = () => {
  setShowModal(false);
  setEditMode(false);
  setCurrentMerchantId(null);
  setFormData({
    name: '',
    walletAddress: '',
    description: '',
    website: '',
    logo: '',
    cashbackRate: '',
  });
};

const handleShowModal = (merchant = null) => {
  if (merchant) {
    setEditMode(true);
    setCurrentMerchantId(merchant._id);
    setFormData({
      name: merchant.name,
      walletAddress: merchant.walletAddress,
      description: merchant.description || '',
      website: merchant.website || '',
      logo: merchant.logo || '',
      cashbackRate: merchant.cashbackRate,
    });
  } else {
    setEditMode(false);
  }
  setShowModal(true);
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!formData.name || !formData.walletAddress || !formData.cashbackRate) {
    toast.error('Please fill all required fields');
    return;
  }
  
  if (editMode) {
    dispatch(updateMerchant({ id: currentMerchantId, merchantData: formData }))
      .unwrap()
      .then(() => {
        toast.success('Merchant updated successfully');
        handleCloseModal();
      })
      .catch((err) => {
        toast.error(err);
      });
  } else {
    dispatch(registerMerchant(formData))
      .unwrap()
      .then(() => {
        toast.success('Merchant registered successfully');
        handleCloseModal();
      })
      .catch((err) => {
        toast.error(err);
      });
  }
};

const handleDelete = (id) => {
  if (window.confirm('Are you sure you want to delete this merchant?')) {
    dispatch(deleteMerchant(id))
      .unwrap()
      .then(() => {
        toast.success('Merchant deleted successfully');
      })
      .catch((err) => {
        toast.error(err);
      });
  }
};

return (
  <>
    <Row className='align-items-center'>
      <Col>
        <h1>Merchants</h1>
      </Col>
      <Col className='text-end'>
        <Button className='my-3' onClick={() => handleShowModal()}>
          <FaPlus /> Add Merchant
        </Button>
      </Col>
    </Row>

    {loading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>{error}</Message>
    ) : (
      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>WALLET ADDRESS</th>
            <th>CASHBACK RATE</th>
            <th>REWARDS DISTRIBUTED</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {merchants.map((merchant) => (
            <tr key={merchant._id}>
              <td>{merchant._id}</td>
              <td>{merchant.name}</td>
              <td>{merchant.walletAddress}</td>
              <td>{merchant.cashbackRate}%</td>
              <td>${merchant.totalRewardsDistributed?.toFixed(2) || '0.00'}</td>
              <td>
                <Button
                  variant='light'
                  className='btn-sm'
                  onClick={() => handleShowModal(merchant)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant='danger'
                  className='btn-sm'
                  onClick={() => handleDelete(merchant._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}

    {/* Add/Edit Merchant Modal */}
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{editMode ? 'Edit Merchant' : 'Add Merchant'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='name' className='mb-3'>
            <Form.Label>Name*</Form.Label>
            <Form.Control
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId='walletAddress' className='mb-3'>
            <Form.Label>Wallet Address*</Form.Label>
            <Form.Control
              type='text'
              name='walletAddress'
              value={formData.walletAddress}
              onChange={handleChange}
              disabled={editMode}
              required
            />
          </Form.Group>

          <Form.Group controlId='description' className='mb-3'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              name='description'
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId='website' className='mb-3'>
            <Form.Label>Website</Form.Label>
            <Form.Control
              type='url'
              name='website'
              value={formData.website}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId='logo' className='mb-3'>
            <Form.Label>Logo URL</Form.Label>
            <Form.Control
              type='url'
              name='logo'
              value={formData.logo}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId='cashbackRate' className='mb-3'>
            <Form.Label>Cashback Rate (%)*</Form.Label>
            <Form.Control
              type='number'
              name='cashbackRate'
              value={formData.cashbackRate}
              onChange={handleChange}
              min='0'
              max='100'
              step='0.01'
              required
            />
          </Form.Group>

          <Button variant='primary' type='submit'>
            {editMode ? 'Update' : 'Add'} Merchant
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  </>
);
};

export default AdminDashboardScreen;

