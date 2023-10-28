import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import authApi from '../../api/authApi';

export default function TakeQuiz() {
  const { id } = useParams();
  const [listQuestion, setListQuestion] = useState([]);

  console.log(id);
  useEffect(() => {
    authApi.getQuestionByQuizId(13).then((response) => {
      setListQuestion(response.data.questionList);
    });
  }, [id]);

  console.log(listQuestion);
  return (
    <>
      <Header />

      <Footer />
    </>
  );
}
