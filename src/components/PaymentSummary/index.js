import React, { useState, useEffect } from 'react';
import { ref as dbRef, get, query, orderByChild, startAt, endAt } from 'firebase/database';
import { database } from "../../firebase";
import './styles.css';

const PaymentSummary = () => {
    const [yearlyExpenses, setYearlyExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('totalExpense'); // 'totalExpense' or 'yearOverYearIncrease'
    const [frequentDelayedPayments, setFrequentDelayedPayments] = useState([]);
    const [showDelayedPayments, setShowDelayedPayments] = useState(false);
    const [selectedTab, setSelectedTab] = useState(null);
    const [inwardPaymentTotal, setInwardPaymentTotal] = useState(0); // State to store inward payment total

    useEffect(() => {
        const fetchInwardPaymentTotal = async () => {
            try {
                const paymentsRef = dbRef(database, 'maintenancePayments');
                const startDate = new Date('2024-01-01'); // Adjust start date as needed
                const endDate = new Date('2024-12-31'); // Adjust end date as needed
                const paymentsQuery = query(paymentsRef, orderByChild('paymentDate'), startAt(startDate.toISOString()), endAt(endDate.toISOString()));
                const paymentsSnapshot = await get(paymentsQuery);
                const paymentsData = paymentsSnapshot.val();

                let total = 0;
                for (const paymentKey in paymentsData) {
                    const payment = paymentsData[paymentKey];
                    total += parseInt(payment.amountPaid); // Add amountPaid to total
                }

                setInwardPaymentTotal(total);
            } catch (error) {
                console.error('Error fetching inward payments:', error);
            }
        };

        fetchInwardPaymentTotal();
    }, []);

    useEffect(() => {
        const fetchYearlyExpenses = async () => {
            try {
                // Get a reference to the 'expenses' node in the Firebase database
                const expensesRef = dbRef(database, 'expenses');

                // Fetch expenses data from Firebase
                const expensesSnapshot = await get(expensesRef);
                const expensesData = expensesSnapshot.val();

                // Calculate yearly expenses and YoY increase
                const yearlyExpensesData = [];
                const years = Object.keys(expensesData).map(expenseKey => {
                    const expense = expensesData[expenseKey];
                    return new Date(expense.paymentDate).getFullYear();
                });
                const uniqueYears = Array.from(new Set(years)); // Get unique years
                uniqueYears.sort((a, b) => a - b); // Sort years in ascending order

                for (let i = 0; i < uniqueYears.length; i++) {
                    const year = uniqueYears[i];
                    const totalExpense = Object.values(expensesData).reduce((acc, expense) => {
                        if (new Date(expense.paymentDate).getFullYear() === year) {
                            return acc + expense.amountPaid;
                        }
                        return acc;
                    }, 0);

                    const previousYearTotal = i > 0 ? yearlyExpensesData[i - 1].totalExpense : 0;
                    const yearOverYearIncrease = i > 0 ? totalExpense - previousYearTotal : 0;

                    yearlyExpensesData.push({
                        year,
                        totalExpense,
                        yearOverYearIncrease
                    });
                }

                // Filter the last 6 years
                const lastSixYearsExpenses = yearlyExpensesData.slice(-6);

                setYearlyExpenses(lastSixYearsExpenses);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        const fetchFrequentDelayedPayments = async () => {
            try {
                // Get a reference to the 'maintenancePayments' node in the Firebase database
                const paymentsRef = dbRef(database, 'maintenancePayments');

                // Fetch maintenance payments data from Firebase
                const paymentsSnapshot = await get(paymentsRef);
                const paymentsData = paymentsSnapshot.val();

                // Calculate frequency of delayed payments for each family
                const delayedPaymentsByFamily = {};
                for (const paymentKey in paymentsData) {
                    const payment = paymentsData[paymentKey];
                    if (payment.status === 'delayed') {
                        if (!delayedPaymentsByFamily[payment.ownerName]) {
                            delayedPaymentsByFamily[payment.ownerName] = 0;
                        }
                        delayedPaymentsByFamily[payment.ownerName]++;
                    }
                }

                // Filter families with frequent delayed payments
                const frequentDelayedFamilies = Object.entries(delayedPaymentsByFamily)
                    .filter(([family, frequency]) => frequency > 2) // Change this threshold as needed
                    .map(([family, frequency]) => family);

                setFrequentDelayedPayments(frequentDelayedFamilies);
            } catch (error) {
                console.error('Error fetching delayed payments:', error);
            }
        };

        fetchYearlyExpenses();
        fetchFrequentDelayedPayments();
    }, []);

    const handleToggleMode = (newMode) => {
        setMode(newMode);
        setSelectedTab(null);
        setShowDelayedPayments(false);
    };

    const handleToggleDelayedPayments = () => {
        setShowDelayedPayments(!showDelayedPayments);
        setSelectedTab(null);
    };

    const handleTabClick = (tabName) => {
        setSelectedTab(tabName);
    };

    return (
        <div>
            <h1>Reports</h1>
            <center><h3>To View the reports click on the respective options below</h3></center>
            <div>
                {/* Display the inward payment total as the first button */}
                <button onClick={() => handleToggleMode('inwardPayments')}>
                    Inward Payments
                </button>
                <button onClick={() => handleToggleMode('totalExpense')}>Total Expense</button>
                <button onClick={() => handleToggleMode('yearOverYearIncrease')}>YoY Increase</button>
                <button onClick={handleToggleDelayedPayments}>Delayed Payments</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {/* Include handling for inward payments */}
                    {mode === 'inwardPayments' ? (
                        <div>
                            <h2>Total Inward Payments</h2>
                            <p>{inwardPaymentTotal}</p>
                        </div>
                    ) : showDelayedPayments ? (
                        <div>
                            <h2>Families with Frequent Delayed Payments</h2>
                            <ul>
                                {frequentDelayedPayments.map((family, index) => (
                                    <li key={index}>{family}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <>
                            <div>
                                <h2>Yearly {mode === 'totalExpense' ? 'Expenses' : 'YoY Increase'}</h2>
                                <div className="tab-container">
                                    <button
                                        className={selectedTab === 'all' ? 'active' : ''}
                                        onClick={() => handleTabClick('all')}
                                    >
                                        All Years
                                    </button>
                                    {yearlyExpenses.map(({ year }) => (
                                        <button
                                            key={year}
                                            className={selectedTab === year.toString() ? 'active' : ''}
                                            onClick={() => handleTabClick(year.toString())}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <table className='payment-summary-table'>
                                <thead>
                                    <tr>
                                        <th>Year</th>
                                        <th>{mode === 'totalExpense' ? 'Total Expense' : 'YoY Increase'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {yearlyExpenses.map(({ year, totalExpense, yearOverYearIncrease }) => (
                                        <tr
                                            key={year}
                                            style={{ display: selectedTab === 'all' || selectedTab === year.toString() ? 'table-row' : 'none' }}
                                        >
                                            <td>{year}</td>
                                            <td>{mode === 'totalExpense' ? totalExpense : yearOverYearIncrease}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default PaymentSummary;