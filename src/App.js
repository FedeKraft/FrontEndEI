import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [status, setStatus] = useState(null);
    const [logs, setLogs] = useState([]);
    const [isAlarm1On, setIsAlarm1On] = useState(false);
    const [isAlarm2On, setIsAlarm2On] = useState(false);

    useEffect(() => {
        fetchStatus();
        fetchLogs();
        const ws = new WebSocket('ws://54.226.99.113:3001');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'status') {
                setStatus(data.data);
                setIsAlarm1On(data.data.alarm1);
                setIsAlarm2On(data.data.alarm2);
            }
        };

        return () => ws.close();
    }, []);

    const fetchStatus = async () => {
        try {
            const response = await axios.get('http://54.226.99.113:3001/status');
            setStatus(response.data);
            setIsAlarm1On(response.data.alarm1);
            setIsAlarm2On(response.data.alarm2);
        } catch (error) {
            console.error('Error fetching status', error);
        }
    };

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://54.226.99.113:3001/logs');
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs', error);
        }
    };

    const toggleAlarm1 = async () => {
        const newState = !isAlarm1On;
        try {
            await axios.post('http://54.226.99.113:3001/set_alarm', { alarm1: newState });
            setIsAlarm1On(newState);
        } catch (error) {
            console.error('Error setting alarm 1', error);
        }
    };

    const toggleAlarm2 = async () => {
        const newState = !isAlarm2On;
        try {
            await axios.post('http://54.226.99.113:3001/set_alarm', { alarm2: newState });
            setIsAlarm2On(newState);
        } catch (error) {
            console.error('Error setting alarm 2', error);
        }
    };

    return (
        <div>
            <h1>Alarm System</h1>
            <div>
                <h2>Alarm 1</h2>
                <p>Status: {isAlarm1On ? 'Active' : 'Inactive'}</p>
                <button onClick={toggleAlarm1}>
                    {isAlarm1On ? 'Deactivate' : 'Activate'}
                </button>
            </div>
            <div>
                <h2>Alarm 2</h2>
                <p>Status: {isAlarm2On ? 'Active' : 'Inactive'}</p>
                <button onClick={toggleAlarm2}>
                    {isAlarm2On ? 'Deactivate' : 'Activate'}
                </button>
            </div>
            <div>
                <h2>Logs</h2>
                <ul>
                    {Array.isArray(logs) ? (
                        logs.map((log, index) => (
                            <li key={index}>{log.message}</li>
                        ))
                    ) : (
                        <li>{logs.message}</li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default App;
