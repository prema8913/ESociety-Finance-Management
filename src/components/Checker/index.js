import React, { useState, useEffect } from 'react';
import { ref as rRef, get, update } from 'firebase/database';
import './styles.css';
import { database } from "../../firebase";

const Checker = () => {
    const [pendingPayments, setPendingPayments] = useState([]);

    useEffect(() => {
        const fetchPendingPayments = async () => {
            try {
                const snapshot = await get(rRef(database, 'maintenancePayments'));
                const payments = [];
                snapshot.forEach((childSnapshot) => {
                    const payment = childSnapshot.val();
                    const currentDate = new Date();
                    const paymentDate = new Date(payment.paymentDate);
                    const daysDifference = Math.floor((currentDate - paymentDate) / (1000 * 60 * 60 * 24));

                    if (payment.status === 'pending' || daysDifference > 0) {
                        if (daysDifference > 0) {
                            payment.status = 'delayed';
                            payment.fineAmount = 100;
                        } else {
                            payment.status = 'pending';
                            payment.fineAmount = 0;
                        }

                        payment.id = childSnapshot.key;
                        payments.push(payment);
                    }
                });
                setPendingPayments(payments);
            } catch (error) {
                console.error('Error fetching pending payments:', error);
            }
        };

        fetchPendingPayments();
    }, []);

    const handleApprove = async (id) => {
        try {
            await update(rRef(database, `maintenancePayments/${id}`), { status: 'approved' });
            // Remove the approved payment from the list
            setPendingPayments(pendingPayments.filter(payment => payment.id !== id));
            alert('Payment approved successfully!');
        } catch (error) {
            console.error('Error approving payment:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            await update(rRef(database, `maintenancePayments/${id}`), { status: 'rejected' });
            // Remove the rejected payment from the list
            setPendingPayments(pendingPayments.filter(payment => payment.id !== id));
            alert('Payment rejected successfully!');
        } catch (error) {
            console.error('Error rejecting payment:', error);
        }
    };

    return (
        <div>
            <h1>Pending Payments</h1>
            <table>
                <thead>
                    <tr>
                        <th>Owner Name</th>
                        <th>Aadhaar No</th>
                        <th>Amount Paid</th>
                        <th>Fine Amount</th>
                        <th>Payment Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingPayments.map(payment => (
                        <tr key={payment.id}>
                            <td>{payment.ownerName}</td>
                            <td>{payment.aadhaarNo}</td>
                            <td>{payment.amountPaid}</td>
                            <td>{payment.fineAmount}</td>
                            <td>{payment.paymentDate}</td>
                            <td>{payment.status}</td>
                            <td>
                                <button onClick={() => handleApprove(payment.id)}>Approve</button>
                                <button onClick={() => handleReject(payment.id)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Checker;
