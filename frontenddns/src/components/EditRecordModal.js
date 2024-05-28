import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/EditRecordModal.css';

const EditRecordModal = ({ isOpen, onRequestClose, record, zoneId, onUpdateRecord }) => {
  const [type, setType] = useState(record.Type);
  const [name, setName] = useState(record.Name);
  const [value, setValue] = useState(record.ResourceRecords[0].Value);
  const [ttl, setTTL] = useState(record.TTL);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedRecord = {
      Type: type,
      Name: name,
      TTL: ttl,
      ResourceRecords: [{ Value: value }],
    };

    try {
      await axios.put(`http://localhost:3000/route53/zones//hostedzone/${zoneId}/records`, updatedRecord);
      onUpdateRecord(updatedRecord);
      onRequestClose();
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Edit Record">
      <h2>Edit DNS Record</h2>
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
        <button type="submit">Update Record</button>
      </form>
    </Modal>
  );
};

export default EditRecordModal;
