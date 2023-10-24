import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './index.css';
import authApi from '../../api/authApi';
import moment from 'moment';

export default function AllCourse() {
  const [categories, setCategories] = useState([]);
  const [allCourse, setAllCourse] = useState([]);
  const [courses, setCourses] = useState([]);
  const [nameCourse, setNameCourse] = useState('');
  const [sortDirectionName, setSortDirectionName] = useState('asc');
  const [sortDirectionDate, setSortDirectionDate] = useState('asc');
  const [sortDirection, setSortDirection] = useState('asc');
  const [verticalActive, setVerticalActive] = useState(-1);

  useEffect(() => {
    authApi
      .findAllCategory()
      .then((response) => {
        if (response.code === 0) {
          setCategories(response.data.categoryList);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    authApi
      .findAllCourse()
      .then((response) => {
        if (response.code === 0) {
          setCourses(response.data.listCourse);
          setAllCourse(response.data.listCourse);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleViewCourseByCategory = (id) => {
    setVerticalActive(id);
    if (id === -1) {
      setCourses(allCourse);
      return;
    } else {
      const filteredCourses = allCourse.filter((course) => course.category.id === id);
      setCourses(filteredCourses);
    }
  };

  const handleSearchByNameCourse = () => {
    setCourses(courses.filter((course) => course.name.indexOf(nameCourse) !== -1));
  };

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, SetRecordsPerPage] = useState(5);
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

  // Sort price
  function comparePrice(course1, course2) {
    return course2.price - course1.price;
  }
  const handleSortPrice = () => {
    if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortDirection('asc');
    }
    const courses = [...records].sort(comparePrice);
    if (sortDirection === 'desc') {
      courses.reverse();
    }
    setCourses(courses);
  };

  // Sort name
  function compareName(course1, course2) {
    return course1.name.localeCompare(course2.name);
  }
  const handleSortName = () => {
    if (sortDirectionName === 'asc') {
      setSortDirectionName('desc');
    } else {
      setSortDirectionName('asc');
    }
    const courses = [...records].sort(compareName);
    if (sortDirectionName === 'desc') {
      courses.reverse();
    }
    setCourses(courses);
  };

  // Sort create at
  function compareCreateAt(course1, course2) {
    return moment(course1.createdAt).diff(moment(course2.createdAt));
  }
  const handleSortCreateAt = () => {
    if (sortDirectionDate === 'asc') {
      setSortDirectionDate('desc');
    } else {
      setSortDirectionDate('asc');
    }
    const courses = [...records].sort(compareCreateAt);
    if (sortDirectionDate === 'desc') {
      courses.reverse();
    }
    setCourses(courses);
  };

  const [nameFilter, setNameFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [createAtFilter, setCreateAtFilter] = useState('');

  const filterCourses = () => {
    setCourses(
      records.filter((course) => {
        return course.name.includes(nameFilter) && course.price >= priceFilter && course.createdAt >= createAtFilter;
      }),
    );
  };

  return (
    <>
      <Header />
      <div style={{ marginBottom: '150px' }}>
        <h2 style={{ textAlign: 'center' }}>List courses</h2>
        <div className="container">
          <div className="category-list">
            <h4>List Category</h4>
            <ul>
              <button
                onClick={() => handleViewCourseByCategory(-1)}
                className={verticalActive === -1 ? 'active-category' : ''}
              >
                All Course
              </button>
              {categories.map((category) => (
                <button
                  style={{ marginTop: '4px' }}
                  key={category.id}
                  onClick={() => handleViewCourseByCategory(category.id)}
                  className={verticalActive === category.id ? 'active-category' : ''}
                >
                  {category.name}
                </button>
              ))}
            </ul>
          </div>
          <div className="course-list">
            <h5>Search by name course</h5>
            <input type="text" placeholder="Enter course name" onChange={(e) => setNameCourse(e.target.value)} />
            <button onClick={() => handleSearchByNameCourse()}>Search</button>

            <div className="filter" style={{ marginTop: '40px' }}>
              <input
                type="text"
                placeholder="Filter by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
              <input
                type="number"
                placeholder="Filter by price"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              />
              <input
                type="date"
                placeholder="Filter by create at"
                value={createAtFilter}
                onChange={(e) => setCreateAtFilter(e.target.value)}
              />
              <button onClick={filterCourses}>Filter</button>
            </div>

            <table style={{ marginTop: '40px' }}>
              <thead>
                <th>No</th>
                <th onClick={handleSortName} style={{ cursor: 'pointer' }}>
                  Name
                </th>
                <th>Category</th>
                <th onClick={handleSortPrice} style={{ cursor: 'pointer' }}>
                  Price
                </th>
                <th onClick={handleSortCreateAt} style={{ cursor: 'pointer' }}>
                  Create At
                </th>
              </thead>
              <tbody>
                {records.map((course, index) => {
                  return (
                    <tr key={course.id}>
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
      </div>

      <Footer />
    </>
  );
}
