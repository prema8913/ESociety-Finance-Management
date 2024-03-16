import React, { useEffect, useState } from "react";
import NewUser from '../components/NewUser';
import PaymentDetail from '../components/PaymentDetail';
import Checker from '../components/Checker';
import ActivityTracker from '../components/ActivityTracker';
import PaymentSummary from '../components/PaymentSummary';
import PaymentToMake from '../components/PaymentToMake';
import ExpenseComponent from '../components/ExpenseComponent';
import Defaulters from '../components/Defaulters';

import './Dashboard.css';
function Dashboard() {
    const [selectedMenuItem, setSelectedMenuItem] = useState('signupSignin');

    const renderComponent = () => {
        switch (selectedMenuItem) {
            case 'newUser':
                return <NewUser />;
            case 'PaymentDetail':
                return <PaymentDetail />;
            case 'PaymentToMake':
                return <PaymentToMake />;
            case 'Checker':
                return <Checker />;
            case 'Defaulters':
                return <Defaulters />;
            case 'ActivityTracker':
                return <ActivityTracker />;
            case 'ExpenseComponent':
                return <ExpenseComponent />;
            case 'PaymentSummary':
                return <PaymentSummary />;
            default:
                return null;
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <ul className="tabs">
                <li className={selectedMenuItem === 'newUser' ? 'active' : ''} onClick={() => setSelectedMenuItem('newUser')}>New User</li>
                <li className={selectedMenuItem === 'PaymentDetail' ? 'active' : ''} onClick={() => setSelectedMenuItem('PaymentDetail')}>Payment Detail</li>
                <li className={selectedMenuItem === 'PaymentToMake' ? 'active' : ''} onClick={() => setSelectedMenuItem('PaymentToMake')}>PaymentToMake</li>
                <li className={selectedMenuItem === 'Checker' ? 'active' : ''} onClick={() => setSelectedMenuItem('Checker')}>Checker</li>
                <li className={selectedMenuItem === 'Defaulters' ? 'active' : ''} onClick={() => setSelectedMenuItem('Defaulters')}>Defaulters</li>
                <li className={selectedMenuItem === 'ActivityTracker' ? 'active' : ''} onClick={() => setSelectedMenuItem('ActivityTracker')}>ActivityTracker</li>
                <li className={selectedMenuItem === 'ExpenseComponent' ? 'active' : ''} onClick={() => setSelectedMenuItem('ExpenseComponent')}>ExpenseComponent</li>
                <li className={selectedMenuItem === 'PaymentSummary' ? 'active' : ''} onClick={() => setSelectedMenuItem('PaymentSummary')}>PaymentSummary</li>

            </ul>

            {/* Render selected component */}
            {renderComponent()}
        </div>
    );
}

export default Dashboard;