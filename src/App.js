import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { csvParse } from 'd3-dsv'; // CSV をパースするためのライブラリ

function App() {
  const [screen, setScreen] = useState('start'); // 'start', 'quiz', 'result'
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [initialFeedback, setInitialFeedback] = useState(false);

  // Google スプレッドシートから CSV データを取得
  useEffect(() => {
    const fetchQuestions = async () => {
      const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSkzE_5QlquBZS47JusmXe70074ewiwz5eyocF9xD2qoDz8Noysao6pKAqi9dSW2_yfQxfaEWY__Yju/pub?gid=0&single=true&output=csv';

      try {
        const response = await fetch(csvUrl);
        const csvText = await response.text();

        // CSV を JavaScript オブジェクトに変換
        const parsedData = csvParse(csvText, ({
          id, question, choiceA, choiceB, choiceC, choiceD, choiceE, correctAnswer, explanation
        }) => ({
          id,
          question,
          choices: [
            { label: 'A', text: choiceA },
            { label: 'B', text: choiceB },
            { label: 'C', text: choiceC },
            { label: 'D', text: choiceD },
            { label: 'E', text: choiceE }
          ],
          correctAnswer: correctAnswer.includes(',') ? correctAnswer.split(',') : correctAnswer, // 複数回答対応
          explanation
        }));

        setQuestions(parsedData);
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleStartQuiz = () => {
    setScreen('quiz');
    setCurrentQuestionIndex(0);
    setResults([]);
  };

  const handleAnswerSubmit = (selectedAnswer, isCorrect) => {
    const currentQuestion = questions[currentQuestionIndex];
    setResults([...results, { question: currentQuestion, isCorrect, userAnswer: selectedAnswer }]);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setScreen('result');
    }
  };

  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((value, index) => value === sortedB[index]);
  };

  const handleFinishQuiz = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = Array.isArray(currentQuestion.correctAnswer)
      ? arraysEqual(selectedAnswer, currentQuestion.correctAnswer)
      : selectedAnswer === currentQuestion.correctAnswer;

    const updatedResults = [...results, { question: currentQuestion, isCorrect, userAnswer: selectedAnswer }];
    setResults(updatedResults);
    setScreen('result');
  };

  const handleBack = (params) => {
    if (params.previous && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      setInitialFeedback(params.showFeedback);
    }
  };

  const handleRestart = () => {
    setScreen('start');
  };

  if (questions.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading questions...</div>;
  }

  return (
    <div className="App">
      {screen === 'start' && <StartScreen onStart={handleStartQuiz} />}
      {screen === 'quiz' && (
        <QuizScreen
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswerSubmit={handleAnswerSubmit}
          onCancel={handleBack}
          onFinishQuiz={handleFinishQuiz}
          initialFeedback={initialFeedback}
        />
      )}
      {screen === 'result' && <ResultScreen results={results} onRestart={handleRestart} />}
    </div>
  );
}

export default App;
