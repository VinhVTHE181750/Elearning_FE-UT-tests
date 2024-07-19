import { Box } from '@mui/material';
import React from 'react';
import Header from '../../../components/Admin/Header/Header';
import { Space, Table, Select, Button } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import authApi from '../../../api/authApi';
import moment from 'moment';
import Sidebar from '../../../components/Sidebar/Sidebar';
import jwtDecode from 'jwt-decode';

export const getFullDate = (date) => {
  const dateAndTime = date.split('T');
  return dateAndTime[0].split('-').reverse().join('-');
};

export default function RecycleBin() {
  const [categoryEntity, setCategoryEntity] = useState('category');
  const [listDeleted, setListDeleted] = useState([]);
  const [username, setUsername] = useState('');
  useEffect(() => {
    if (localStorage.getItem('user-access-token')) {
      setUsername(jwtDecode(localStorage.getItem('user-access-token')).sub);
    }
  }, [localStorage.getItem('user-access-token')]);

  useEffect(() => {
    authApi
      .findAllDeleted(categoryEntity)
      .then((response) => {
        if (categoryEntity === 'quiz') {
          setListDeleted(response.data.quizList);
        } else if (categoryEntity === 'question') {
          setListDeleted(response.data);
        } else if (categoryEntity === 'lesson') {
          setListDeleted(response.data.listLesson);
        } else if (categoryEntity === 'answer') {
          setListDeleted(response.data);
        } else if (categoryEntity === 'course') {
          setListDeleted(response.data.listCourse);
        } else if (categoryEntity === 'category') {
          setListDeleted(response.data.categoryList);
        }
      })
      .catch((err) => {
        setListDeleted(null);
      });
  }, [categoryEntity]);

  const handleRestore = (entity) => {
    // if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    if (window.confirm('Do you want restore?')) {
      const params = {};
      if (categoryEntity === 'quiz') {
        Object.assign(params, {
          username: username,
          quizID: entity.id,
          quizName: entity.name,
          lessonID: entity.lesson.id,
          lessonName: entity.lesson.name,
        });
      } else if (categoryEntity === 'question') {
        Object.assign(params, {
          username: username,
          questionID: entity.id,
          quizID: entity.quizID,
          questionName: entity.questionName,
          questionType: entity.questionType,
          answers: entity.answerList,
        });
      } else if (categoryEntity === 'lesson') {
        Object.assign(params, {
          username: username,
          lessonID: entity.id,
          lessonName: entity.name,
          ordNumber: entity.ordNumber,
          courseID: entity.course.id,
          linkContent: entity.linkContent,
          description: entity.description,
        });
      } else if (categoryEntity === 'answer') {
        Object.assign(params, {
          username: username,
          questionID: entity.questionID,
          answerID: entity.answerID,
          answerContent: entity.answerContent,
          correct: entity.correct,
        });
      } else if (categoryEntity === 'course') {
        Object.assign(params, {
          username: username,
          courseID: entity.id,
          name: entity.name,
          description: entity.description,
          price: entity.price,
          link_thumnail: entity.linkThumnail,
          categoryID: entity.category.id,
        });
      } else if (categoryEntity === 'category') {
        Object.assign(params, {
          username: username,
          categoryID: entity.id,
          categoryUpdate: entity.name,
        });
      }
      authApi
        .restoreEntity(params, categoryEntity)
        .then((response) => {
          const newListDeleted = listDeleted.filter((value) => value.id !== entity.id);
          setListDeleted(newListDeleted);
        })
        .catch((err) => {});
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '3%',
    },
    {
      title: 'Name',
      render: (record) => {
        if (categoryEntity === 'question') return <a>{record.questionName}</a>;
        else return <a>{record.name}</a>;
      },
      width: '40%',
    },
    {
      title: 'Deleter',
      align: 'center',
      dataIndex: '',
      width: '20%',
    },
    {
      title: 'Date Deleted',
      align: 'center',
      render: (record) => {
        const formatDate = moment(record.updatedAt).format('MMMM Do YYYY, h:mm a');
        if (record.updatedAt !== null) return <a>{formatDate}</a>;
      },
    },
    {
      title: 'Actions',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button style={{ width: '80px' }} onClick={() => handleRestore(record)}>
            Restore
          </Button>
        </Space>
      ),
    },
  ];

  const handleChange = (value) => {
    // if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    setCategoryEntity(value.value);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box m="20px">
          <Header title="Recycle Bin" subtitle="Managing the recycle bin " />

          <div className="recycle-bin-select">
            <Select
              labelInValue
              defaultValue={{
                value: 'category',
                label: 'Category',
              }}
              style={{
                width: 120,
              }}
              onChange={handleChange}
              options={[
                {
                  value: 'course',
                  label: 'Course',
                },
                {
                  value: 'lesson',
                  label: 'Lesson',
                },
                {
                  value: 'quiz',
                  label: 'Quiz',
                },
                {
                  value: 'question',
                  label: 'Question',
                },
                {
                  value: 'answer',
                  label: 'Answer',
                },
                {
                  value: 'category',
                  label: 'Category',
                },
              ]}
            />
          </div>

          <Table columns={columns} dataSource={listDeleted} rowKey={(record) => record.id} />
        </Box>
      </div>
    </div>
  );
}
