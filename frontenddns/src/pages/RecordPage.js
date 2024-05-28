import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AddRecordModal from '../components/AddRecordModal';
import BulkUploadModal from '../components/BulkUploadModal';
import EditRecordModal from '../components/EditRecordModal';
import SearchBar from '../components/SearchBar';
import '../styles/RecordsPage.css';

const RecordsPage = () => {
  const { zoneId } = useParams();
  const [records, setRecords] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [zoneId]);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/route53/zones//hostedzone/${zoneId}/records`);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleEditRecord = (record) => {
    setEditRecord(record); // Set the record to be edited
    const editRecord =record;
  };

  const handleDeleteRecord = async (record) => {
    try {
      await axios.delete(`http://localhost:3000/route53/zones/hostedzone/${zoneId}/records`, { data: record });
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    applyFilter(event.target.value, filterType);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    applyFilter(searchTerm, event.target.value);
  };

  const applyFilter = (search, type) => {
    let filtered;
  
    if (search || type) {
      filtered = records.filter(record => {
        const nameMatch = !search || record.Name.toLowerCase().includes(search.toLowerCase());
        const typeMatch = !type || record.Type === type;
        return nameMatch && typeMatch;
      });
    } else {
      // If both search and type are empty, show all records
      filtered = records;
    }
  
    setFilteredRecords(filtered);
  };
  
  

  return (
    <div className="records-page">
      <h2>Records for Zone: {zoneId}</h2>
      <SearchBar
        searchTerm={searchTerm}
        filterType={filterType}
        handleSearchChange={handleSearchChange}
        handleFilterChange={handleFilterChange}
      />
      <button onClick={() => setAddModalOpen(true)}>Add Single Record</button>
      <button onClick={() => setBulkUploadModalOpen(true)}>Add Bulk Records</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Value</th>
            <th>TTL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {filteredRecords.length > 0 ? (
    filteredRecords.map((record, index) => (
      <tr key={index}>
        <td>{record.Name}</td>
        <td>{record.Type}</td>
        <td>{record.ResourceRecords.map(r => r.Value).join(', ')}</td>
        <td>{record.TTL}</td>
        <td>
          <button onClick={() => handleEditRecord(record)}>Edit</button>
          <button onClick={() => handleDeleteRecord(record)}>Delete</button>
        </td>
      </tr>
    ))
  ) : (
    records.map((record, index) => (
      <tr key={index}>
        <td>{record.Name}</td>
        <td>{record.Type}</td>
        <td>{record.ResourceRecords.map(r => r.Value).join(', ')}</td>
        <td>{record.TTL}</td>
        <td>
          <button onClick={() => handleEditRecord(record)}>Edit</button>
          <button onClick={() => handleDeleteRecord(record)}>Delete</button>
        </td>
      </tr>
    ))
  )}
</tbody>

      </table>
      {isAddModalOpen && (
        <AddRecordModal
          isOpen={isAddModalOpen}
          onRequestClose={() => setAddModalOpen(false)}
          hostedZoneId={zoneId}
          fetchRecords={fetchRecords}
        />
      )}
      {isBulkUploadModalOpen && (
        <BulkUploadModal
          isOpen={isBulkUploadModalOpen}
          onRequestClose={() => setBulkUploadModalOpen(false)}
          hostedZoneId={zoneId}
          fetchRecords={fetchRecords}
        />
      )}
      
{editRecord && (
  <EditRecordModal
    isOpen={true}
    onRequestClose={() => setEditRecord(null)}
    record={editRecord}
    zoneId={zoneId}
    onUpdateRecord={fetchRecords}
  />
)}
    </div>
  );
};

export default RecordsPage;