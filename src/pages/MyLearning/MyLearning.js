import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import jwtDecode from 'jwt-decode';
import authApi from '../../api/authApi';
import moment from 'moment';
import './index.css';
import Footer from '../../components/Footer/Footer';
import Course from '../Course/Course';

export default function MyLearning() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var decoded = jwtDecode(userString);
      const username = decoded.sub;
      authApi
        .getCourseByUser(username)
        .then((response) => {
          if (response.code === 0) {
            setCourses(response.data.listCourse);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, SetRecordsPerPage] = useState(10);
  const lastIndex = currentPage * recordsPerPage;
  const fisttIndex = lastIndex - recordsPerPage;
  const records = courses.slice(fisttIndex, lastIndex);
  const npage = Math.ceil(courses.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id) {
    setCurrentPage(id);
  }

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

  const handleViewCourse = (course) => {
    navigate(`/view-course/${course.id}`);
  };

  return (
    <>
      <Header />
      <div style={{ marginBottom: '150px' }}>
        <div className="course-list">
          <h4 style={{ textAlign: 'center', marginTop: '40px' }}>My learning</h4>
          <table style={{ marginTop: '40px' }}>
            <thead style={{ color: '#fff' }}>
              <th>No</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Create At</th>
            </thead>
            <tbody>
              {records.map((course, index) => {
                return (
                  <tr key={course.id} onClick={() => handleViewCourse(course)}>
                    <td>{index + (currentPage - 1) * recordsPerPage + 1}</td>
                    <td>{course.name}</td>
                    <td>{course.category.name}</td>
                    <td>{course.price}</td>
                    <td>{moment(course.createdAt).format('DD/MM/YYYY')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <nav>
            <ul className="pagination" style={{ marginTop: '30px' }}>
              <li className="page-item">
                <a className="page-link" onClick={prePage}>
                  Prev
                </a>
              </li>
              {numbers.map((n, index) => (
                <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={index}>
                  <a className="page-item" onClick={() => changeCPage(index + 1)}>
                    {index + 1}
                  </a>
                </li>
              ))}
              <li className="page-item">
                <a className="page-link" onClick={nextPage}>
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <Footer />
    </>
  );
}
