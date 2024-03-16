import React, { useState, useEffect } from 'react';
import { ref as fRef, get, ref as mRef, orderByChild, equalTo, getChildren } from 'firebase/database';
import { database } from "../../firebase";
import './styles.css';
const Defaulters = () => {
    const [defaulters, setDefaulters] = useState([]);

    useEffect(() => {
        const fetchDefaulters = async () => {
            try {
                // Get all families
                const familiesSnapshot = await get(fRef(database, 'families'));
                const families = [];
                familiesSnapshot.forEach((familySnapshot) => {
                    const family = familySnapshot.val();
                    families.push({
                        aadhaarNo: familySnapshot.key,
                        ownerName: family.ownerName
                    });
                });

                // Get families who haven't made payments
                const paymentsSnapshot = await get(mRef(database, 'maintenancePayments'));
                const paidFamilies = [];
                paymentsSnapshot.forEach((paymentSnapshot) => {
                    const payment = paymentSnapshot.val();
                    paidFamilies.push(payment.aadhaarNo);
                });

                // Filter families who haven't made payments
                const defaulterFamilies = families.filter((family) => !paidFamilies.includes(family.aadhaarNo));
                setDefaulters(defaulterFamilies);
            } catch (error) {
                console.error('Error fetching defaulters:', error);
            }
        };

        fetchDefaulters();
    }, []);

    return (
        <div>
            <h1>Defaulters List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Owner Name</th>
                        <th>Aadhaar No</th>
                    </tr>
                </thead>
                <tbody>
                    {defaulters.map((defaulter, index) => (
                        <tr key={index}>
                            <td>{defaulter.ownerName}</td>
                            <td>{defaulter.aadhaarNo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Defaulters;
