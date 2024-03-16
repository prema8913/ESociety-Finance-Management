import React, { useState } from 'react';
import { ref as sRef, push } from 'firebase/database';

import { database } from "../../firebase";
import './styles.css';

const ExpenseComponent = () => {
    const [category, setCategory] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [amountPaid, setAmountPaid] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Get a reference to the 'expenses' node in the Firebase database
            const expensesRef = sRef(database, 'expenses');

            // Push new expense data to the database
            push(expensesRef, {
                paymentDate,
                paymentType,
                amountPaid: parseFloat(amountPaid)  // Convert amountPaid to a number
            });

            // Clear input fields after successful submission
            setPaymentType('');
            setPaymentDate('');
            setAmountPaid('');
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Expense Tracker</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Payment Date:</label>
                    <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Amount Paid:</label>
                    <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Payment Type:</label>
                    <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                        <option value="">Select Category</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Maintenance Costs">Maintenance Costs</option>
                        <option value="Salaries and Wages">Salaries and Wages</option>
                        <option value="Insurance Premiums">Insurance Premiums</option>
                        <option value="Taxes and Government Fees">Taxes and Government Fees</option>
                        <option value="Administrative Expenses">Administrative Expenses</option>
                        <option value="Capital Expenditure">Capital Expenditure</option>
                        <option value="Miscellaneous Expenses">Miscellaneous Expenses</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">Add Family</button>
            </form>
        </div>
    );
};

export default ExpenseComponent;
