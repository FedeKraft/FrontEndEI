import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [status, setStatus] = useState(null); // Inicializa status como null
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ws = new WebSocket('ws://54.226.99.113:3001');

        ws.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'status') {
                setStatus(message.data);
            } else if (message.type === 'logs') {
                setLogs(prevLogs => [...prevLogs, message.data]);
            }
        };

        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3001/status');
                setStatus(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching status', error);
                setLoading(false);
            }
        };

        const fetchLogs = async () => {
            try {
                const response = await axios.get('http://54.226.99.113:3001/status');
                setLogs(response.data);
            } catch (error) {
                console.error('Error fetching logs', error);
            }
        };

        fetchStatus();
        fetchLogs();
    }, []);

    const setAlarm = async (alarm, state) => {
        try {
            const updatedStatus = { ...status, [alarm]: state };
            await axios.post('http://54.226.99.113:3001/set_alarm', updatedStatus);
            setStatus(updatedStatus);
        } catch (error) {
            console.error(`Error setting ${alarm} state`, error);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Alarm System</h1>
            {status ? (
                <>
                    <div>
                        <h2>Alarm 1</h2>
                        <p>Status: {status.alarm1 ? 'Active' : 'Inactive'}</p>
                        <button onClick={() => setAlarm('alarm1', !status.alarm1)}>
                            {status.alarm1 ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                    <div>
                        <h2>Alarm 2</h2>
                        <p>Status: {status.alarm2 ? 'Active' : 'Inactive'}</p>
                        <button onClick={() => setAlarm('alarm2', !status.alarm2)}>
                            {status.alarm2 ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                </>
            ) : <p>No status data available</p>}
            <div>
                <h2>Logs</h2>
                <ul>
                    {logs.map((log, index) => (
                        <li key={index}>{log.message} at {new Date(log.timestamp).toLocaleString()}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;
