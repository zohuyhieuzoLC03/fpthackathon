import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { updateScoreAndTimestampOfScoreOfQuizzes, auth } from '../../firebase';

const DailyQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Set to true initially to show loading state.
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [dailyQuiz, setDailyQuiz] = useState([]);

  // Fetch data using useEffect and move fetchData inside the component.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/daily_quiz');
        setDailyQuiz(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAnswerButtonClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < dailyQuiz.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      updateScoreAndTimestampOfScoreOfQuizzes(auth.currentUser.uid, score);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setShowScore(false);
    setScore(0);
  };

  return (
    <div className='mt-40'>
      {dailyQuiz.length > 0 && (
        <div className='text-white my-10 mx-20 rounded-lg px-20 py-10 shadow-xl flex bg-gradient-to-tr from-yellow-400 to-pink-500'>
          {showScore ? (
            <div>
              <div className='flex text-2xl items-center'>
                You scored {score} out of {dailyQuiz.length}
              </div>
              <button
                className='text-lg text-white bg-gradient-to-t from-orange-400 to-pink-500 border border-red-500 rounded-lg flex p-2 items-center justify-center cursor-pointer'
                onClick={handleRestart}
              >
                Restart
              </button>
            </div>
          ) : (
            <>
              <div className='w-full relative'>
                <div className='mb-10'>
                  <span className='text-4xl font-bold'>
                    Question {currentQuestion + 1}/{dailyQuiz.length}
                  </span>
                </div>
                <div className='text-lg font-semibold'>
                  {dailyQuiz[currentQuestion]?.questionText}
                </div>
              </div>

              <div className='w-full flex flex-col justify-between gap-2'>
                {dailyQuiz[currentQuestion]?.answerOptions?.map((answerOption, index) => (
                  <button
                    key={index}
                    className='w-full text-lg text-white bg-gradient-to-t from-orange-400 to-pink-500 border border-red-500 rounded-lg flex p-2 items-center justify-center cursor-pointer'
                    onClick={() => handleAnswerButtonClick(answerOption.isCorrect)}
                  >
                    <span>{answerOption.answerText}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) 
      }
    </div>
  );
};

export default DailyQuiz;
