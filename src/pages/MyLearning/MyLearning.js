import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import jwtDecode from 'jwt-decode';
import authApi from '../../api/authApi';
import moment from 'moment';
import './index.css';
import Footer from '../../components/Footer/Footer';
import Course from '../Course/Course';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRef } from 'react';

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

  const handleViewCourse = (courseId) => {
    navigate(`/viewLesson/${courseId}`);
  };

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
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
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
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
      title: 'No',
      dataIndex: 'no',
      align: 'center',
      width: '3%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      width: '40%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      align: 'center',
      width: '15%',
      ...getColumnSearchProps('category'),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      align: 'center',
      width: '15%',
      ...getColumnSearchProps('price'),
    },
    {
      title: 'Create At',
      dataIndex: 'createdAt',
      align: 'center',
      render: (record) => {
        return (
          <div>
            <a>{moment(record.createdAt).format('LLLL')}</a>
          </div>
        );
      },
      ...getColumnSearchProps('createdAt'),
    },
  ];

  return (
    <>
      <Header />
      <div style={{ marginBottom: '150px' }}>
        <div className="course-list">
          <h4 style={{ textAlign: 'center', marginTop: '40px' }}>My learning</h4>
          <Table
            columns={columns}
            dataSource={courses}
            rowKey={(record) => record.id}
            onRow={(record) => ({
              onClick: () => handleViewCourse(record.id),
            })}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
