import React, { useState, useEffect } from 'react';
import { ref as dbRef, push, onValue, set } from 'firebase/database';
import { database } from '../../firebase'; // Import your Firebase configuration
import './styles.css';

const ActivityTracker = () => {
    const [activities, setActivities] = useState([]);
    const [activityName, setActivityName] = useState('');
    const [activityDescription, setActivityDescription] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [aadhaarNo, setAadhaarNo] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    useEffect(() => {
        // Fetch activities from Firebase when component mounts
        const activitiesRef = dbRef(database, 'activities');
        onValue(activitiesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setActivities(Object.values(data));
            } else {
                setActivities([]);
            }
        });

        // Unsubscribe from Firebase when component unmounts
        return () => {
            // This method does not exist, so we don't need to unsubscribe
        };
    }, []); // We don't need to clean up, so no dependencies are necessary

    const handleAddActivity = () => {
        // Check if all fields are provided
        if (!activityName || !activityDescription || !ownerName || !aadhaarNo || !mobileNumber) {
            alert('Please provide all fields.');
            return;
        }

        // Push the new activity to Firebase
        const newActivityRef = push(dbRef(database, 'activities'));
        const newActivityKey = newActivityRef.key;
        const newActivity = {
            id: newActivityKey,
            name: activityName,
            description: activityDescription,
            ownerName: ownerName,
            aadhaarNo: aadhaarNo,
            mobileNumber: mobileNumber,
            timestamp: new Date().toISOString() // Capture timestamp
        };
        setActivityName('');
        setActivityDescription('');
        setOwnerName('');
        setAadhaarNo('');
        setMobileNumber('');

        // Using 'set' to add the new activity to the database
        set(newActivityRef, newActivity)
            .then(() => console.log('Activity added to Firebase'))
            .catch((error) => console.error('Error adding activity to Firebase:', error));
    };

    return (
        <div className="activity-tracker">
            <h1>Activity Tracker</h1>
            <div>
                <label>Activity Name:</label>
                <input type="text" value={activityName} onChange={(e) => setActivityName(e.target.value)} />
            </div>
            <div>
                <label>Activity Description:</label>
                <textarea value={activityDescription} onChange={(e) => setActivityDescription(e.target.value)} />
            </div>
            <div>
                <label>Owner Name:</label>
                <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
            </div>
            <div>
                <label>Aadhaar Number:</label>
                <input type="text" value={aadhaarNo} onChange={(e) => setAadhaarNo(e.target.value)} />
            </div>
            <div>
                <label>Mobile Number:</label>
                <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
            </div>
            <button onClick={handleAddActivity}>Add Activity</button>
            <div>
                <h2>Activities</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Activity Name</th>
                            <th>Description</th>
                            <th>Owner Name</th>
                            <th>Aadhaar Number</th>
                            <th>Mobile Number</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((activity) => (
                            <tr key={activity.id}>
                                <td>{activity.name}</td>
                                <td>{activity.description}</td>
                                <td>{activity.ownerName}</td>
                                <td>{activity.aadhaarNo}</td>
                                <td>{activity.mobileNumber}</td>
                                <td>{activity.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivityTracker;
