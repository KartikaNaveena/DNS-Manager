import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/DomainPage.css';

const DomainPage = () => {
  const [domains, setDomains] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await axios.get('http://localhost:3000/route53/zones');
      setDomains(response.data);
    } catch (error) {
      console.error('Error fetching domains:', error);
    }
  };

  return (
    <div className="domain-page">
      <h2>Domains</h2>
      <table>
        <thead>
          <tr>
            <th>Domain Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {domains.map(domain => (
            <tr key={domain.Id}>
              <td>{domain.Name}</td>
              <td>
                <button onClick={() =>navigate(`/records/${domain.Id}`)}>View Records</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DomainPage;
