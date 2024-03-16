import React from 'react';
import './styles.css';
const PaymentToMake = () => {
    // Define monthly payments
    const monthlyPayments = [
        { name: 'Securities', amount: 5000 },
        { name: 'Salary for Vendors', amount: 2000 },
        { name: 'Maintenance', amount: 2000 },
        { name: 'Taxes', amount: 7500 },
        { name: 'Administrative Charges', amount: 1000 },
        { name: 'Rent', amount: 6000 }
    ];

    // Calculate total monthly payment
    const totalMonthlyPayment = monthlyPayments.reduce((total, payment) => total + payment.amount, 0);

    return (
        <div>
            <h2>Monthly Payments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Payment Type</th>
                        <th>Amount (INR)</th>
                    </tr>
                </thead>
                <tbody>
                    {monthlyPayments.map((payment, index) => (
                        <tr key={index}>
                            <td>{payment.name}</td>
                            <td>{payment.amount}</td>
                        </tr>
                    ))}
                    <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>{totalMonthlyPayment}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default PaymentToMake;
