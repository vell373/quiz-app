// src/components/ResultScreen.js
import React from 'react';

const ResultScreen = ({ results, onRestart }) => {
    const totalQuestions = results.length;
    const correctCount = results.filter(result => result.isCorrect).length;
    const scorePercentage = ((correctCount / totalQuestions) * 100).toFixed(1);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>結果発表</h1>
            <p style={styles.scoreText}>
            <b>{totalQuestions}</b>問中<b>{correctCount}</b>問正解！
            </p>
            <p style={styles.scoreText}><b>スコア: {scorePercentage}%</b></p>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>No.</th>
                        <th style={styles.th}>あなたの回答</th>
                        <th style={styles.th}>正解</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                        <tr key={index}>
                            <td style={styles.td}>{index + 1}</td>
                            <td style={styles.td}>{result.userAnswer}</td>
                            <td style={styles.td}>{result.question.correctAnswer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button style={styles.button} onClick={onRestart}>
                最初に戻る
            </button>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        marginTop: '50px'
    },
    title: {
        fontSize: '36px',
        marginBottom: '20px',
        color: '#333'
    },
    scoreText: {
        fontSize: '24px',
        marginBottom: '10px',
        color: '#444'
    },
    table: {
        margin: '20px auto',
        borderCollapse: 'collapse',
        width: '60%'
    },
    th: {
        border: '1px solid #ddd',
        padding: '8px',
        backgroundColor: '#4CAF50',
        color: 'white'
    },
    td: {
        border: '1px solid #ddd',
        padding: '8px'
    },
    button: {
        fontSize: '20px',
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '30px'
    }
};

export default ResultScreen;
