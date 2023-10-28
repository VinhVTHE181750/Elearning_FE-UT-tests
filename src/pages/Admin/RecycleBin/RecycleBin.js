import { Box } from '@mui/material';
import React from 'react';
import Header from '../../../components/Admin/Header/Header';
import { Button, DatePicker, Input, Space, Table, Select } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import authApi from '../../../api/authApi';
import moment from 'moment';

export const getFullDate = (date) => {
  const dateAndTime = date.split('T');
  return dateAndTime[0].split('-').reverse().join('-');
};

export default function RecycleBin() {
  const [categoryEntity, setCategoryEntity] = useState('category');
  const [listDeleted, setListDeleted] = useState([]);

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
        console.log(err);
      });
  }, [categoryEntity]);

  const handleRestore = (entity) => {
    const params = {};
    if (categoryEntity === 'quiz') {
      Object.assign(params, {
        quizID: entity.id,
        quizName: entity.name,
        lessonID: entity.lesson.id,
        lessonName: entity.lesson.name,
      });
    } else if (categoryEntity === 'question') {
      Object.assign(params, {
        questionID: entity.id,
        quizID: entity.quizID,
        questionName: entity.questionName,
        questionType: entity.questionType,
        answers: entity.answerList,
      });
    } else if (categoryEntity === 'lesson') {
      Object.assign(params, {
        lessonID: entity.id,
        lessonName: entity.name,
        ordNumber: entity.ordNumber,
        courseID: entity.course.id,
        linkContent: entity.linkContent,
        description: entity.description,
      });
    } else if (categoryEntity === 'answer') {
      Object.assign(params, {
        questionID: entity.questionID,
        answerID: entity.answerID,
        answerContent: entity.answerContent,
        correct: entity.correct,
      });
    } else if (categoryEntity === 'course') {
      Object.assign(params, {
        courseID: entity.id,
        name: entity.name,
        description: entity.description,
        price: entity.price,
        link_thumnail: entity.linkThumnail,
        categoryID: entity.category.id,
      });
    } else if (categoryEntity === 'category') {
      Object.assign(params, {
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
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '3%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: 'Deleter',
      dataIndex: '',
      key: 'deleter',
      width: '20%',
    },
    {
      title: 'Date Deleted',
      dataIndex: 'updatedAt',
      key: 'updatdeAt',
      render: (record) => {
        return (
          <div>
            <a>{moment(record.updatedAt).format('LLLL')}</a>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleRestore(record)}>Restore</a>
        </Space>
      ),
    },
  ];

  const handleChange = (value) => {
    setCategoryEntity(value.value);
  };
  console.log(listDeleted);
  return (
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
  );
}
