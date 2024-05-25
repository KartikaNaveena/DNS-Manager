import React from 'react';
import './DNSRecordTable.css';

const DnsRecordTable = ({ records }) => {
  return (
    <div className="dns-table-container">
      <h2>DNS Records</h2>
      <table className="dns-table">
        <thead>
          <tr>
            <th>Domain</th>
            <th>Type</th>
            <th>Record</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.domain}</td>
              <td>{record.type}</td>
              <td>{record.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DnsRecordTable;
