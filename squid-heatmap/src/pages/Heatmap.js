import React, { useState } from 'react';

// Internal styles
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '100%',
        margin: '0 auto',
        backgroundColor: '#f0f0f0',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
    },
    controls: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    selectContainer: {
        flex: '1',
        marginRight: '10px',
    },
    label: {
        marginBottom: '5px',
        display: 'block',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    select: {
        width: '100%',
        padding: '10px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginTop: '20px',
    },
    result: {
        marginTop: '20px',
    },
    mapHeader: {
        marginBottom: '10px',
    },
    mapContainer: {
        height: '710px',
        border: 'none',
    },
    loadingScreen: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        color: '#fff',
        fontSize: '24px',
        flexDirection: 'column', // For vertical alignment of squid and text
    },
    squid: {
        width: '100px',
        height: '100px',
        background: 'url(assets/octopus.gif) no-repeat center center',
        backgroundSize: 'contain',
    }
};

const Heatmap = () => {
    const [selectedYear, setSelectedYear] = useState(2023);
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [heatmapHtml, setHeatmapHtml] = useState(null);
    const [mapVisible, setMapVisible] = useState(true); // State to control visibility of default map
    const [loading, setLoading] = useState(false); // Loading state

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handlePredict = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ year: selectedYear, month: selectedMonth }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch heatmap data');
            }

            const data = await response.json();
            console.log('Received heatmap data:', data);

            // Directly use the HTML content
            setHeatmapHtml(data.heatmaps[0]);
            setMapVisible(false); // Hide default map after fetching heatmap
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div style={styles.container}>
            {loading && (
                <div style={styles.loadingScreen}>
                    <div style={styles.squid}></div>
                    <div>Predicting...</div>
                </div>
            )}
            <h1>Indian Squid Heatmap Analysis</h1>
            <p>Select a year and month to predict the abundance of squid in various hotspots. This tool helps researchers and fishery managers anticipate squid population trends, aiding in sustainable management and conservation efforts.</p>
            <div style={styles.controls}>
                <div style={styles.selectContainer}>
                    <label htmlFor="year" style={styles.label}>Select Year:</label>
                    <select id="year" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} style={styles.select}>
                        <option value={2023}>2023</option>
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                    </select>
                </div>

                <div style={styles.selectContainer}>
                    <label htmlFor="month" style={styles.label}>Select Month:</label>
                    <select id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} style={styles.select}>
                        {monthNames.map((month, index) => (
                            <option key={index + 1} value={index + 1}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={handlePredict} style={styles.button}>Predict</button>
            </div>

            {heatmapHtml && (
                <div style={styles.result}>
                    <h3>Generated Heatmap for {monthNames[selectedMonth - 1]} {selectedYear}</h3>
                    <div dangerouslySetInnerHTML={{ __html: heatmapHtml }} />
                </div>
            )}

            {mapVisible && (
                <div style={styles.result}>
                    <h3 style={styles.mapHeader}>Default Map (OpenStreetMap in Northern Iloilo, Visayan Sea)</h3>
                    <div style={styles.mapContainer}>
                        <iframe
                            src="https://www.openstreetmap.org/export/embed.html?bbox=123.0,11.0,123.5,11.5&layer=mapnik"
                            style={{ width: '100%', height: '100%' }}
                            title="Default Map"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Heatmap;
