import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

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
        const ws = new WebSocket('ws://54.87.145.221:3001');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'status') {
                setStatus(data.data);
                setIsAlarm1On(data.data.alarm1);
                setIsAlarm2On(data.data.alarm2);
                setIsLaserOn(data.data.laser);
                setIsMovementOn(data.data.movement);
            } else if (data.type === 'logs') {
                setLogs((prevLogs) => [...prevLogs, data.data]);
            }
        };

        return () => ws.close();
    }, []);

    const fetchStatus = async () => {
        try {
            const response = await axios.get('http://54.87.145.221:3001/status');
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
            const response = await axios.get('http://54.87.145.221:3001/logs');
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs', error);
        }
    };

    const toggleAlarm1 = async () => {
        const newState = !isAlarm1On;
        try {
            await axios.post('http://54.87.145.221:3001/set_alarm', { alarm1: newState });
            setIsAlarm1On(newState);
            addLog(`Alarm 1 ${newState ? 'activated' : 'deactivated'}`);
        } catch (error) {
            console.error('Error setting alarm 1', error);
        }
    };

    const toggleAlarm2 = async () => {
        const newState = !isAlarm2On;
        try {
            await axios.post('http://54.87.145.221:3001/set_alarm', { alarm2: newState });
            setIsAlarm2On(newState);
            addLog(`Alarm 2 ${newState ? 'activated' : 'deactivated'}`);
        } catch (error) {
            console.error('Error setting alarm 2', error);
        }
    };

    const toggleLaser = async () => {
        const newState = !isLaserOn;
        try {
            await axios.post('http://54.87.145.221:3001/set_alarm', { laser: newState });
            setIsLaserOn(newState);
            addLog(`Laser sensor ${newState ? 'activated' : 'deactivated'}`);
        } catch (error) {
            console.error('Error setting laser', error);
        }
    };

    const toggleMovement = async () => {
        const newState = !isMovementOn;
        try {
            await axios.post('http://54.87.145.221:3001/set_alarm', { movement: newState });
            setIsMovementOn(newState);
            addLog(`Movement sensor ${newState ? 'activated' : 'deactivated'}`);
        } catch (error) {
            console.error('Error setting movement', error);
        }
    };

    const addLog = (message) => {
        setLogs((prevLogs) => [...prevLogs, { message, timestamp: new Date().toISOString() }]);
    };

    return (
        <div className="container">
            <h1>Alarma Palooza</h1>
            <div className="section">
                <h2>Alarm 1</h2>
                <p>Status: {isAlarm1On ? 'Active' : 'Inactive'}</p>
                <button className="button" onClick={toggleAlarm1}>
                    {isAlarm1On ? 'Deactivate' : 'Activate'}
                </button>
            </div>
            <div className="section">
                <h2>Alarm 2</h2>
                <p>Status: {isAlarm2On ? 'Active' : 'Inactive'}</p>
                <button className="button" onClick={toggleAlarm2}>
                    {isAlarm2On ? 'Deactivate' : 'Activate'}
                </button>
            </div>
            <div className="section">
                <h2>Laser Sensor</h2>
                <p>Status: {isLaserOn ? 'Active' : 'Inactive'}</p>
                <button className="button" onClick={toggleLaser}>
                    {isLaserOn ? 'Deactivate' : 'Activate'}
                </button>
            </div>
            <div className="section">
                <h2>Movement Sensor</h2>
                <p>Status: {isMovementOn ? 'Active' : 'Inactive'}</p>
                <button className="button" onClick={toggleMovement}>
                    {isMovementOn ? 'Deactivate' : 'Activate'}
                </button>
            </div>
            <div className="section">
                <h2>Logs</h2>
                <ul className="logs">
                    {logs.map((log, index) => (
                        <li key={index}>{`${new Date(log.timestamp).toLocaleString()}: ${log.message}`}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
