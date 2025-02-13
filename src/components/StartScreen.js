// src/components/StartScreen.js
import React from 'react';

const StartScreen = ({ onStart }) => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>クイズアプリ ver1</h1>
            <button style={styles.button} onClick={onStart}>スタート</button>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        marginTop: '100px'
    },
    title: {
        fontSize: '48px',
        marginBottom: '40px',
        color: '#333'
    },
    button: {
        fontSize: '24px',
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default StartScreen;
