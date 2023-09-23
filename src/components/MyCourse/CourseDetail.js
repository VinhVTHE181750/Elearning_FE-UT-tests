// CourseList.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseData from './CourseData';

function CourseDetail() {
  const [search, setSearch] = useState();
  const [course, setCourse] = useState();
  const [categoty, setCategoty] = useState();
  return (
    <div className="container-content">
      <div className="header-content">
        <h1> My Learing</h1>
      </div>
      <div className="header-choice">
        <div className="sort-category">
          <form className="form-sort-category">
            <label className="">
              Sort by:
              <select name="course" value={course} onChange={(e) => setCourse(e.target.value)}>
                <option value="html">Title: A-to-Z</option>
                <option value="css">Title: Z-to-A</option>
                <option value="css">Title: Z-to-A</option>
              </select>
            </label>
            <label>
              Category:
              <select name="category" value={categoty} onChange={(e) => setCategoty(e.target.value)}>
                <option value="all">All-Course</option>
                <option value="it">IT Operations </option>
                <option value="data">Data Science </option>
                <option value="dev">Development </option>
              </select>
            </label>
          </form>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search my course"
          id="search"
          name="search"
        />
      </div>
      <div className="body-content">
        {CourseData.map((course) => (
          <div key={course.id}>
            <img src={course.image} alt="" />
            <Link to={`/courses/${course.id}`}>{course.title}</Link>
            {course.description}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseDetail;
