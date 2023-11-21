import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './ViewUser.css'; // Import your custom CSS file
import Sidebar from '../../../components/Sidebar/Sidebar';
import { Table } from 'antd';
import moment from 'moment';

const ViewUser = () => {
  const { username } = useParams();
  const [user, setUser] = useState([]);
  const [listCourse, setListCourse] = useState([]);
  useEffect(() => {
    authApi
      .getUserByUserName(username)
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((err) => {});

    authApi
      .getCourseByUser(username)
      .then((resp) => {
        const list = resp.data.listCourse;
        const uniqueCourseNames = {};
        const filteredCourse = list.filter((course) => {
          if (uniqueCourseNames[course.name]) {
            return false;
          } else {
            uniqueCourseNames[course.name] = true;
            return true;
          }
        });
        setListCourse(filteredCourse.map((item, index) => ({ ...item, no: index + 1 })));
      })
      .catch((err) => {});
  }, [username]);

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
    },
    {
      title: 'Enroll Date',
      render: (record) => {
        const formatDate = moment(record.createdAt).format('MMMM Do YYYY, h:mm a');
        return <a>{formatDate}</a>;
      },
    },
  ];

  console.log(listCourse);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="view-user-container">
          <h1>User Details</h1>

          <div className="user-details">
            <p style={{ color: 'white' }}>
              <span className="label">Full Name:</span> {user.fullName}
            </p>
            <p style={{ color: 'white' }}>
              <span className="label">Username:</span> {user.username}
            </p>
            <p style={{ color: 'white' }}>
              <span className="label">Email:</span> {user.email}
            </p>
            <p style={{ color: 'white' }}>
              <span className="label">Gender:</span> {user.gender}
            </p>
            <p style={{ color: 'white' }}>
              <span className="label">Phone:</span> {user.phone}
            </p>
            <p style={{ color: 'white' }}>
              <span className="label">DOB:</span> {user.date_of_birth}
            </p>
            <p style={{ color: 'white' }}>
              <span className="label">Status:</span> {user.status}
            </p>
          </div>
        </div>

        <div>
          <p style={{ color: 'white' }}>List Enroll Course</p>
          <Table columns={columns} dataSource={listCourse} rowKey={(record) => record.id} />
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
