import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./post.css";
import authApi from '../../../api/authApi';

export default function Post() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    authApi
      .findAllCourse()
      .then((response) => {
        const courseArray = (response.data && response.data.listCourse) || [];
        setCourses(courseArray);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  
  return (
    <div className="post">
      {courses.map((course) => (
        <div key={course.id}>
          <img
            className="postImg"
            src={course.linkThumnail} // Thay thế bằng trường dữ liệu phù hợp cho hình ảnh khóa học
            alt={course.name}
          />
          <div className="postInfo">
            <div className="postCats">
              <span className="postCat">
                <Link className="link" to={`/posts?cat=${course.category.name}`}>
                  {course.category.name}
                </Link>
              </span>
            </div>
            <span className="postTitle">
              <Link to={`/post/${course.id}`} className="link">
                {course.name}
              </Link>
            </span>
            <hr />
            <span className="postDate">{course.createdAt}</span> {/* Thay thế bằng trường dữ liệu phù hợp cho ngày tạo */}
          </div>
          <p className="postDesc">{course.description}</p> {/* Thay thế bằng trường dữ liệu phù hợp cho mô tả */}
        </div>
      ))}
    </div>
  );
}
