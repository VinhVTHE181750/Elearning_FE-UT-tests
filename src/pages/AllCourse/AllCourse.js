import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './index.css';
import authApi from '../../api/authApi';
import { MDBTabs, MDBTabsItem, MDBTabsLink, MDBTabsContent, MDBTabsPane, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

export default function AllCourse() {
  const [categories, setCategories] = useState([]);
  const [allCourse, setAllCourse] = useState([]);
  const [courses, setCourses] = useState([]);

  const [verticalActive, setVerticalActive] = useState(-1);
  const handleVerticalClick = (value) => {
    if (value === verticalActive) {
      return;
    }
    setVerticalActive(value);
  };

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

  const handleCategoryClick = (id) => {
    setVerticalActive(id);
    if (id === -1) {
      setCourses(allCourse);
      return;
    } else {
      const filteredCourses = allCourse.filter((course) => course.category.id === id);
      setCourses(filteredCourses);
    }
  };

  return (
    <>
      <Header />

      <MDBRow>
        <MDBCol size="3">
          <MDBTabs className="flex-column text-center">
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleCategoryClick(-1)}>All Course</MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              {categories.map((category) => {
                return <MDBTabsLink onClick={() => handleCategoryClick(category.id)}>{category.name}</MDBTabsLink>;
              })}
            </MDBTabsItem>
          </MDBTabs>
        </MDBCol>
        <MDBCol size="9">
          <MDBTabsContent>
            <MDBTabsPane show={verticalActive}>
              {courses.map((course) => (
                <Link to={'/course/${course.name}'} key={course.id} className="course">
                  <img
                    src={
                      'https://static.wixstatic.com/media/65246d_c7bd3ba476fb4191af59a11494ad027f~mv2.jpg/v1/fill/w_820,h_460,al_c,q_85/65246d_c7bd3ba476fb4191af59a11494ad027f~mv2.jpg'
                    }
                    alt={course.name}
                  />
                  <h2>{course.name}</h2>
                </Link>
              ))}
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
      <Footer />
    </>
  );
}
