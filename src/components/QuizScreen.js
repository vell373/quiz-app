// src/components/QuizScreen.js
import React, { useState, useEffect } from 'react';

const QuizScreen = ({ question, questionNumber, totalQuestions, onAnswerSubmit, onFinishQuiz }) => {
    // 複数回答問題かどうかを判定（正解が配列の場合は複数回答）
    const isMultiple = Array.isArray(question.correctAnswer);

    // 問題が変わるたびに selected とフィードバック表示状態をリセット
    useEffect(() => {
        setSelected(isMultiple ? [] : '');
        setShowFeedback(false);
    }, [question, isMultiple]);


    // 単一回答の場合は文字列、複数回答の場合は配列で管理
    const [selected, setSelected] = useState([]);
    // 回答送信後、フィードバック表示状態を管理
    const [showFeedback, setShowFeedback] = useState(false);

    // 単一回答用：ラジオボタンの変更ハンドラ
    const handleRadioChange = (label) => {
        setSelected(label);
    };

    // 複数回答用：チェックボックスの変更ハンドラ
    const handleCheckboxChange = (label) => {
        if (selected.includes(label)) {
            setSelected(selected.filter(item => item !== label));
        } else {
            setSelected([...selected, label]);
        }
    };


    // 配列同士の比較（順不同）
    const arraysEqual = (a, b) => {
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        for (let i = 0; i < sortedA.length; i++) {
            if (sortedA[i] !== sortedB[i]) return false;
        }
        return true;
    };

    // 「Submit Answer」ボタン押下時（フィードバック表示前）
    const handleSubmit = () => {
        if (isMultiple ? selected.length === 0 : selected === '') return; // 何も選択されていない場合は何もしない
        setShowFeedback(true);
    };

    // 「Next Question」ボタン押下時：正誤判定を行い、結果を親へ渡す
    const handleNext = () => {
        let isCorrect;
        if (isMultiple) {
            isCorrect = arraysEqual(selected, question.correctAnswer);
        } else {
            isCorrect = (selected === question.correctAnswer);
        }
        onAnswerSubmit(selected, isCorrect);
    };

    /*
    const handleBack = () => {
        if (showFeedback) {
            // フィードバック（解説）表示中の場合：
            // 前の問題に戻る（前の問題を「問題表示モード」にする）
            onCancel({ previous: true, showFeedback: false });
        } else {
            // 問題表示中の場合：
            // 前の問題に戻り、前の問題の解説を表示する
            onCancel({ previous: true, showFeedback: true });
        }
    };*/

    return (
        <div style={styles.container}>
            <h2 style={styles.questionNumber}>
                {questionNumber}問目　（全{totalQuestions}問）
            </h2>
            <div style={styles.questionContainer}>
                <p style={styles.questionText}>{question.question}</p>
                    <div style={styles.choicesContainer}>
                    {question.choices.filter(choice => choice.text.trim() !== "").map((choice, index) => (
                        <label key={index} style={styles.choiceLabel}>
                            {isMultiple ? (
                                <input
                                    type="checkbox"
                                    name="choice"
                                    value={choice.label}
                                    checked={selected.includes(choice.label)}
                                    onChange={() => handleCheckboxChange(choice.label)}
                                />
                            ) : (
                                <input
                                    type="radio"
                                    name="choice"
                                    value={choice.label}
                                    checked={selected === choice.label}
                                    onChange={() => handleRadioChange(choice.label)}
                                />
                            )}
                            {choice.label}. {choice.text}
                        </label>
                    ))}
                    </div>
                {!showFeedback ? (
                ""
                ) : (
                    // フィードバック表示：ユーザーの選択、正解、解説を表示
                    <div style={styles.feedbackContainer}>
                        <p style={styles.feedbackText}>
                            <strong>あなたの回答：</strong>{' '}
                            {Array.isArray(selected) ? selected.join(', ') : selected}
                            </p>
                        <p style={styles.feedbackText}>
                            <strong>正解：</strong>{' '}
                            {isMultiple
                                ? question.correctAnswer.join(', ')
                                : question.correctAnswer}
                        </p>
                        <p style={styles.feedbackText}>
                            <strong>解説：</strong> {question.explanation}
                        </p>
                    </div>
                )}
            </div>
            <div style={styles.buttonsContainer}>
                <button
                    style={styles.finishButton}
                    onClick={() => onFinishQuiz(selected)}
                    disabled={isMultiple ? selected.length === 0 : selected === ''}
                >
                    回答を終了
                </button>
                {!showFeedback ? (
                    <button
                        style={styles.submitButton}
                        onClick={handleSubmit}
                        disabled={isMultiple ? selected.length === 0 : selected === ''}
                    >
                        答え
                    </button>
                ) : (
                    <button
                        style={styles.nextButton}
                        onClick={handleNext}
                        disabled={isMultiple ? selected.length === 0 : selected === ''}
                    >
                        次の問題
                    </button>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    questionNumber: {
        textAlign: 'center',
        color: '#333'
    },
    questionContainer: {
        marginTop: '20px'
    },
    questionText: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#444'
    },
    choicesContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    choiceLabel: {
        fontSize: '20px',
        marginBottom: '10px',
        cursor: 'pointer'
    },
    feedbackContainer: {
        marginTop: '20px',
        backgroundColor: '#e0e0e0',
        padding: '10px',
        borderRadius: '5px'
    },
    feedbackText: {
        fontSize: '20px',
        marginBottom: '10px',
        color: '#333'
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '30px'
    },
    cancelButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    nextButton: {
        backgroundColor: '#2196F3',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    finishButton: {
        backgroundColor: '#FF9800',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default QuizScreen;
