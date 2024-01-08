import React, { useEffect, useState } from 'react'
import { Button, Table, Modal } from 'react-bootstrap';
import './css/style.css'
import { axiosInstance } from './utils';

const App = () => {
  const [modalShow, setModalShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });
  const [editableUser, setEditableUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    getAllUsersData();
  }, [])

  const getAllUsersData = async () => {
    try {
      let response = await axiosInstance('get', 'getAllusers');
      if (response?.status === 200) {
        setUsers(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const createUser = async () => {
    try {
      let response = await axiosInstance('post', 'createUser', formData);
      if (response?.status === 200) {
        setUsers([...users, response?.data])
      }
      setModalShow(false);
      setFormData({
        name: '',
        email: '',
        age: ''
      })
    } catch (error) {
      console.error(error);
    }
  }

  const updateUser = async () => {
    try {
      let updatedUser = { ...editableUser, ...formData }
      let response = await axiosInstance('put', `updateUser?slug=${editableUser?.slug}`, updatedUser);
      if (response?.status === 200) {
        setUsers((prev) => prev.map(user => user.slug === editableUser.slug ? updatedUser : user));
      }
      setModalShow(false);
      setFormData({
        name: '',
        email: '',
        age: ''
      })
      setIsEdit(false);
      setEditableUser({});
    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = async (user) => {
    try {
      let response = await axiosInstance('delete', `deleteUser?slug=${user?.slug}`);
      if (response?.status === 200) {
        setUsers(prev => prev.filter(userData => userData?.slug !== user?.slug))
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) updateUser();
    else createUser();

  }

  const handleClose = () => {
    setModalShow(false);
    setFormData({
      name: '',
      email: '',
      age: ''
    });
    setIsEdit(false);
    setEditableUser({});
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleEdit = (user) => {
    setModalShow(true);
    setFormData({
      name: user?.name,
      email: user?.email,
      age: user?.age
    });
    setIsEdit(true);
    setEditableUser(user);
  }

  return (
    <div className='container-fluid mx-0 px-0'>
      <div className="box-container position-relative">
        <div className='box p-4 position-absolute bg-white'>
          <div>
            <Button variant="success" className='px-4' onClick={() => setModalShow(true)}>Add</Button>
            <Table striped bordered hover size="sm" className='mt-2  text-center'>
              <thead>
                <tr>
                  <th className='table-header'>Name</th>
                  <th className='table-header'>Email</th>
                  <th className='table-header'>Age</th>
                  <th className='table-header'>Action</th>
                </tr>
              </thead>
              <tbody>
                {users?.length ?
                  users.map((user, index) => (
                    <tr key={index}>
                      <td>{user?.name}</td>
                      <td>{user?.email}</td>
                      <td>{user?.age}</td>
                      <td>
                        <div className='d-flex'>
                          <Button variant="success" onClick={() => handleEdit(user)}>Update</Button>
                          <Button variant="danger" className='ms-2' onClick={() => handleDelete(user)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                  : null}
              </tbody>
            </Table>
          </div>
          <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={modalShow} onHide={() => handleClose()}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                {isEdit ? 'Edit' : 'Add'} User
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" value={formData.name} className="form-control" name='name' onChange={(e) => handleChange(e)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input type="email" value={formData.email} className="form-control" name='email' onChange={(e) => handleChange(e)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Age</label>
                  <input type="text" value={formData.age} className="form-control" name='age' onChange={(e) => handleChange(e)} />
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-success">Submit</button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div >
  )
}

export default App;
