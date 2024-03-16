import React, { useState } from 'react';
import { ref as sRef, push, child, get } from 'firebase/database';

import { database } from "../../firebase";
import './styles.css';

const NewUser = () => {
    const [ownerName, setOwnerName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [aadhaarNo, setAadhaarNo] = useState('');
    const [numMembers, setNumMembers] = useState('');
    const [residentAddress, setResidentAddress] = useState('');
    const [permanentAddress, setPermanentAddress] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if Aadhaar number already exists
        const aadhaarRef = child(sRef(database), 'families/' + aadhaarNo);
        const snapshot = await get(aadhaarRef);

        if (snapshot.exists()) {
            alert('Aadhaar number already exists!');
            return;
        }

        // Push family data to Firebase Realtime Database with Aadhaar number as the key
        push(aadhaarRef, {
            ownerName,
            mobileNumber,
            email,
            numMembers,
            residentAddress,
            permanentAddress
        }).then(() => {
            // Clear input fields after successful submission
            setOwnerName('');
            setMobileNumber('');
            setEmail('');
            setAadhaarNo('');
            setNumMembers('');
            setResidentAddress('');
            setPermanentAddress('');
        }).catch(error => {
            console.error('Error adding family:', error);
        });
    };

    return (
        <div className="dashboard-container">
            <h1>Families Management Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Owner Name:</label>
                    <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Mobile Number:</label>
                    <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Aadhaar No:</label>
                    <input type="text" value={aadhaarNo} onChange={(e) => setAadhaarNo(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Number of Members in Family:</label>
                    <input type="number" value={numMembers} onChange={(e) => setNumMembers(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Resident Address:</label>
                    <input type="text" value={residentAddress} onChange={(e) => setResidentAddress(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Permanent Address:</label>
                    <input type="text" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} className="form-input" required />
                </div>
                <button type="submit" className="submit-button">Add Family</button>
            </form>
        </div>
    );
};

export default NewUser;