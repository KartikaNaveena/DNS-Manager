import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Records = ({ domainId }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
        console.log(`Fetching records for domainId: ${domainId}`); // Add this line

      try {
        const response = await axios.get(`http://localhost:3000/route53/zones/${domainId}/records`);
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, [domainId]);

  return (
    <div>
      <h2>Records for Domain ID: {domainId}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Value</th>
            <th>TTL</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.Name}</td>
              <td>{record.Type}</td>
              <td>{record.ResourceRecords.map(r => r.Value).join(', ')}</td>
              <td>{record.TTL}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Records;
