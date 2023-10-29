import { Box } from '@mui/material';
import Header from '../../../components/Admin/Header/Header';
import { useNavigate } from 'react-router-dom';
import { Table, Space, Button, Dropdown, Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import authApi from '../../../api/authApi';
import moment from 'moment';
import Item from 'antd/es/list/Item';
import Highlighter from 'react-highlight-words';

export default function ManageUser() {
  const negative = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    authApi
      .getAllUser()
      .then((response) => {
        setUsers(response.data.userList);
      })
      .catch((err) => {});
  }, []);

  const handleEditClick = (userId) => {
    negative(`/editUser/${userId}`);
  };

  const handleDeleteClick = (userId) => {
    const updatedUsers = [...users];
    const userIndex = updatedUsers.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      updatedUsers.splice(userIndex, 1);
      updatedUsers.forEach((user, index) => {
        user.id = index + 1;
      });
      setUsers(updatedUsers);
    }
  };
  const handleViewClick = (username) => {
    negative(`/view/${username}`);
  };

  const handleChangeRole = (username) => {
    if (window.confirm(`Do you want to change the role of username: ${username}`)) {
      authApi
        .changeRoleUser({ username: username, typeRole: 'ADMIN' })
        .then((response) => {
          window.location.reload('Change role success');
        })
        .catch((err) => {
          window.location.reload('Change role success');
        });
    }
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
      title: 'ID',
      dataIndex: 'id',
      width: '3%',
      align: 'center',
    },
    {
      title: 'Fullname',
      dataIndex: 'fullName',
      width: '20%',
      align: 'center',
      ...getColumnSearchProps('fullName'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '10%',
      align: 'center',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      width: '10%',
      align: 'center',
      ...getColumnSearchProps('gender'),
    },
    {
      title: 'Date of birth',
      dataIndex: 'date_of_birth',
      width: '20%',
      align: 'center',
      render: (record) => {
        return (
          <div>
            <a>{moment(record.date_of_birth).format('L')}</a>
          </div>
        );
      },
      ...getColumnSearchProps('date_of_birth'),
    },
    {
      title: 'Role',
      width: '5%',
      align: 'center',
      render: (_, record) => (
        <>
          {record.role === 'STUDENT' ? (
            <Select
              defaultValue={{ label: 'STUDENT', value: 'STUDENT' }}
              style={{ width: 110 }}
              onChange={() => handleChangeRole(record.username)}
              options={[{ label: 'ADMIN', value: 'ADMIN' }]}
            />
          ) : (
            <Space size="small">
              <Item style={{ width: '110px' }}>{record.role}</Item>
            </Space>
          )}
        </>
      ),
    },
    {
      title: 'Status',
      width: '5%',
      dataIndex: 'status',
      align: 'center',
    },
    {
      title: 'Actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button style={{ width: '80px' }} onClick={() => handleViewClick(record.username)}>
            View
          </Button>
          <Button style={{ width: '80px' }} onClick={() => handleDeleteClick(record.username)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="LIST USER" subtitle="Managing the User " />
      <Table columns={columns} dataSource={users} rowKey={(record) => record.id} />
    </Box>
  );
}
