import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [status, setStatus] = useState(null);
    const [logs, setLogs] = useState([]);
    const [isAlarm1On, setIsAlarm1On] = useState(false);
    const [isAlarm2On, setIsAlarm2On] = useState(false);
    const [isLaserOn, setIsLaserOn] = useState(false);
    const [isMovementOn, setIsMovementOn] = useState(false);

    useEffect(() => {
        fetchStatus();
        fetchLogs();
        const ws = new WebSocket('ws://52.91.198.178:3001');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'status') {
                setStatus(data.data);
                setIsAlarm1On(data.data.alarm1);
                setIsAlarm2On(data.data.alarm2);
                setIsLaserOn(data.data.laser);
                setIsMovementOn(data.data.movement);
            }
        };

        return () => ws.close();
    }, []);

    const fetchStatus = async () => {
        try {
            const response = await axios.get('http://52.91.198.178:3001/status');
            setStatus(response.data);
            setIsAlarm1On(response.data.alarm1);
            setIsAlarm2On(response.data.alarm2);
            setIsLaserOn(response.data.laser);
            setIsMovementOn(response.data.movement);
        } catch (error) {
            console.error('Error fetching status', error);
        }
    };

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://52.91.198.178:3001/logs');
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs', error);
        }
    };

    const toggleAlarm1 = async () => {
        const newState = !isAlarm1On;
        try {
            await axios.post('http://52.91.198.178:3001/set_alarm', { alarm1: newState });
            setIsAlarm1On(newState);
        } catch (error) {
            console.error('Error setting alarm 1', error);
        }
    };

    const toggleAlarm2 = async () => {
        const newState = !isAlarm2On;
        try {
            await axios.post('http://52.91.198.178:3001/set_alarm', { alarm2: newState });
            setIsAlarm2On(newState);
        } catch (error) {
            console.error('Error setting alarm 2', error);
        }
    };

    const toggleLaser = async () => {
        const newState = !isLaserOn;
        try {
            await axios.post('http://52.91.198.178:3001/set_alarm', { laser: newState });
            setIsLaserOn(newState);
        } catch (error) {
            console.error('Error setting laser', error);
        }
    };

    const toggleMovement = async () => {
        const newState = !isMovementOn;
        try {
            await axios.post('http://52.91.198.178:3001/set_alarm', { movement: newState });
            setIsMovementOn(newState);
        } catch (error) {
            console.error('Error setting movement', error);
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
                <h2>Laser Sensor</h2>
                <p>Status: {isLaserOn ? 'Active' : 'Inactive'}</p>
                <button onClick={toggleLaser}>
                    {isLaserOn ? 'Deactivate' : 'Activate'}
                </button>
            </div>
            <div>
                <h2>Movement Sensor</h2>
                <p>Status: {isMovementOn ? 'Active' : 'Inactive'}</p>
                <button onClick={toggleMovement}>
                    {isMovementOn ? 'Deactivate' : 'Activate'}
                </button>
            </div>
            <div>
                <h2>Logs</h2>
                <ul>
                    {Array.isArray(logs) ? (
                        logs.map((log, index) => (
                            <li key={index}>{log.timestamp} - {log.message}</li>
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
