// frontend/src/components/TransactionList.js
import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';

const TransactionList = ({ transactions }) => {
  const getExplorerUrl = (hash) => {
    // Get network ID from environment
    const networkId = import.meta.env.VITE_NETWORK_ID || '11155111';
    
    if (networkId === '11155111') {
      return `https://sepolia.etherscan.io/tx/${hash}`;
    } else if (networkId === '137') {
      return `https://polygonscan.com/tx/${hash}`;
    } else if (networkId === '80001') {
      return `https://mumbai.polygonscan.com/tx/${hash}`;
    } else {
      return `https://etherscan.io/tx/${hash}`;
    }
  };
  return (
    <Table striped bordered hover responsive className='table-sm'>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Merchant</th>
          <th>Amount</th>
          <th>Cashback</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction._id}>
            <td>{transaction.transactionId}</td>
            <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
            <td>
              {transaction.merchant ? (
                <Link to={`/merchants/${transaction.merchant._id}`}>
                  {transaction.merchant.name}
                </Link>
              ) : (
                transaction.merchantWalletAddress
              )}
            </td>
            <td>${transaction.amount.toFixed(2)}</td>
            <td>${transaction.cashbackAmount.toFixed(2)}</td>
            <td>
              {transaction.status === 'completed' ? (
                <Badge bg='success'>Completed</Badge>
              ) : transaction.status === 'pending' ? (
                <Badge bg='warning'>Pending</Badge>
              ) : (
                <Badge bg='danger'>Failed</Badge>
              )}
            </td>
            <td>
              {transaction.blockchainTransactionHash && (
                <a
                  href={getExplorerUrl(transaction.blockchainTransactionHash)}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FaExternalLinkAlt /> View on Explorer
                </a>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TransactionList;
