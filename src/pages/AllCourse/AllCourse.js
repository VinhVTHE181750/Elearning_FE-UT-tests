import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './index.css';
import authApi from '../../api/authApi';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Button, DatePicker, Input, Space, Table, Select, Statistic } from 'antd';

export default function AllCourse() {
  const [categories, setCategories] = useState([]);
  const [allCourse, setAllCourse] = useState([]);
  const [courses, setCourses] = useState([]);
  const [verticalActive, setVerticalActive] = useState(-1);

  const navigate = useNavigate();

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

  // ant
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        {dataIndex === 'createAt' ? (
          <Space>
            <DatePicker
              onChange={(e) => {
                setSelectedKeys([e]);
              }}
              allowClear={true}
              picker="year"
            />
          </Space>
        ) : (
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
        )}
        ,
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (dataIndex === 'createAt') {
        console.log(value);
        return moment(record.createAt).year === moment(value);
      } else if (dataIndex === 'price') {
        return parseInt(record.price) === parseInt(value);
      } else if (dataIndex === 'category') {
        return record.category.name.indexOf(value) !== -1;
      } else return record.name.toLowerCase().includes(value.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '45%',
      align: 'center',
      ...getColumnSearchProps('name'),
      sorter: (course1, course2) => course1.name.localeCompare(course2.name),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      width: '20%',
      align: 'center',
    },
    {
      title: 'Price',
      align: 'center',
      render: (record) => {
        return (
          <div>
            <p style={{ color: '#000000e0', fontWeight: 'unset' }}>
              {record.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND
            </p>
          </div>
        );
      },
      width: '17%',
      sorter: (course1, course2) => course2.price - course1.price,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Create At',
      align: 'center',
      render: (record) => {
        const formatDate = moment(record.createdAt).format('MMMM Do YYYY, h:mm a');
        return <a>{formatDate}</a>;
      },
      sorter: (a, b) => moment(a).diff(moment(b)),
      sortDirections: ['descend', 'ascend'],
    },
  ];

  const handleViewCourse = (id) => {
    return navigate(`/view-course/${id}`);
  };

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

  return (
    <>
      <Header />
      <h2 style={{ textAlign: 'center', marginTop: '50px' }}>List courses</h2>
      <div className="all-course-container">
        <div className="all-course-list-category">
          <ul className="all-course-ul-li">
            <h4>List Category</h4>
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
        <Table
          columns={columns}
          dataSource={courses}
          bordered
          style={{ margin: '50px 200px 50px 0', minWidth: '900px', minHeight: '500px' }}
          rowKey={(record) => record.id}
          onRow={(record) => ({
            onClick: () => handleViewCourse(record.id),
          })}
        />
      </div>
      <Footer />
    </>
  );
}
