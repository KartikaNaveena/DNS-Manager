import React, { useState } from 'react';
import DnsRecordTable from './components/DNSRecordsTable';
import './App.css';

function App() {
  const [dnsRecords] = useState([
    { domain: 'example.com', type: 'A', value: '192.168.1.1' },
    { domain: 'example.com', type: 'CNAME', value: 'example.com' },
    { domain: 'example.com', type: 'MX', value: 'mail.example.com' },
    { domain: 'example.com', type: 'NS', value: 'ns1.example.com' },
    { domain: 'example.com', type: 'TXT', value: 'v=spf1 include:_spf.example.com ~all' },
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>DNS Dashboard</h1>
      </header>
      <main>
        <DnsRecordTable records={dnsRecords} />
      </main>
    </div>
  );
}

export default App;
