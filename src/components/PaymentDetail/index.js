import React, { useState } from 'react';
import { ref as pRef, push, child, get } from 'firebase/database';

import { database } from "../../firebase";
import './styles.css';

const PaymentDetail = () => {
    const [aadhaarNo, setAadhaarNo] = useState('');
    const [amountPaid, setAmountPaid] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [paymentType, setPaymentType] = useState('Rent'); // Default to Rent
    const [isPendingApproval, setIsPendingApproval] = useState(false); // State to track approval status
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmitPayment = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!aadhaarNo || !amountPaid || !paymentDate || !ownerName) {
            setErrorMessage('All fields are required');
            return;
        }

        // Get the current date
        const currentDate = new Date();
        const currentDay = currentDate.getDate();

        // Check if payment is delayed and not paid between 5th to 10th
        const paymentDay = new Date(paymentDate).getDate();
        if (paymentDay > 10 && !(currentDay >= 5 && currentDay <= 10)) {
            // Collect fine for delayed payment
            const fine = 100; // Rupees 100 fine
            // Push payment data to Firebase database with status and fine
            push(pRef(database, 'maintenancePayments'), {
                aadhaarNo,
                amountPaid,
                paymentDate: new Date(paymentDate).toISOString(), // Convert to ISO string
                ownerName,
                paymentType,
                status: 'delayed', // Add a status field indicating delayed payment
                fine // Add the fine amount to the payment data
            }).then(() => {
                // Clear input fields after successful submission
                setAadhaarNo('');
                setAmountPaid('');
                setPaymentDate('');
                setOwnerName('');
                setPaymentType('Rent'); // Reset payment type to default
                setIsPendingApproval(false); // Reset approval status
                setErrorMessage('');
                alert(`Maintenance payment recorded. Fine of Rs. ${fine} should be paid for delayed payment.`);
            }).catch(error => {
                console.error('Error recording maintenance payment:', error);
                setIsPendingApproval(false); // Reset approval status in case of error
                setErrorMessage('Failed to record payment');
            });
        } else {
            // Set the status to pending approval
            setIsPendingApproval(true);

            // Push payment data to Firebase database with a pending status
            push(pRef(database, 'maintenancePayments'), {
                aadhaarNo,
                amountPaid,
                paymentDate: new Date(paymentDate).toISOString(), // Convert to ISO string
                ownerName,
                paymentType,
                status: 'pending' // Add a status field indicating pending approval
            }).then(() => {
                // Clear input fields after successful submission
                setAadhaarNo('');
                setAmountPaid('');
                setPaymentDate('');
                setOwnerName('');
                setPaymentType('Rent'); // Reset payment type to default
                setIsPendingApproval(false); // Reset approval status
                setErrorMessage('');
                alert('Maintenance payment recorded. Pending approval.');
            }).catch(error => {
                console.error('Error recording maintenance payment:', error);
                setIsPendingApproval(false); // Reset approval status in case of error
                setErrorMessage('Failed to record payment');
            });
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Maintenance Payment Tracker</h1>
            <form onSubmit={handleSubmitPayment}>
                <div className="form-group">
                    <label className="form-label">Owner Name:</label>
                    <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Aadhaar No:</label>
                    <input type="text" value={aadhaarNo} onChange={(e) => setAadhaarNo(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Amount Paid:</label>
                    <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Payment Date:</label>
                    <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Payment Type:</label>
                    <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className="form-input">
                        <option value="Rent">Rent</option>
                        <option value="Maintenance Fees">Maintenance Fees</option>
                        <option value="Utility Bills">Utility Bills</option>
                        <option value="Parking Fees">Parking Fees</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button type="submit" className="submit-button" disabled={isPendingApproval}>
                    {isPendingApproval ? 'Recording Payment...' : 'Record Payment'}
                </button>
            </form>
        </div>
    );
};

export default PaymentDetail;