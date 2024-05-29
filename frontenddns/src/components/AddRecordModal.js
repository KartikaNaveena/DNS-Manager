import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/AddRecordModal.css';

const AddRecordModal = ({ isOpen, onRequestClose, hostedZoneId, fetchRecords, setError, setSuccess }) => {
  const [type, setType] = useState('A');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [ttl, setTTL] = useState(300);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const record = {
      Type: type,
      Name: name,
      TTL: ttl,
      ResourceRecords: [{ Value: value }],
    };

    try {
      await axios.post(`http://localhost:3000/route53/zones/hostedzone/${hostedZoneId}/records`, record);
      fetchRecords();
      onRequestClose();
      setSuccess(true); // Set success notification
      setError(null); // Clear any previous error
    } catch (error) {
      console.error('Error adding record:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Set error message from server response
      } else {
        setError('Failed to add record'); // Set generic error message
      }
      setSuccess(false); // Clear any previous success
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Add Record">
      <h2>Add DNS Record</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="A">A</option>
            <option value="AAAA">AAAA</option>
            <option value="CNAME">CNAME</option>
            <option value="MX">MX</option>
            <option value="NS">NS</option>
            <option value="PTR">PTR</option>
            <option value="SOA">SOA</option>
            <option value="SRV">SRV</option>
            <option value="TXT">TXT</option>
          </select>
        </label>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Value:
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <label>
          TTL:
          <input type="number" value={ttl} onChange={(e) => setTTL(e.target.value)} />
        </label>
        <button type="submit">Add Record</button>
      </form>
    </Modal>
  );
};

export default AddRecordModal;
