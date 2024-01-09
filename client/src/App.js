import React, { useEffect, useState } from 'react'
import { Button, Table, Modal } from 'react-bootstrap';
import './css/style.css'
import { axiosInstance } from './utils';
import { toast } from 'react-toastify';

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
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    age: ''
  })

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
        toast.success('User Created Successfully')
        setModalShow(false);
        setFormData({
          name: '',
          email: '',
          age: ''
        })
        setErrors({
          name: '',
          email: '',
          age: ''
        })
      } else if (response?.status === 201) {
        toast.error(response?.data?.message);
      }
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
        toast.success('User Updated Successfully')
        setModalShow(false);
        setFormData({
          name: '',
          email: '',
          age: ''
        })
        setErrors({
          name: '',
          email: '',
          age: ''
        })
        setIsEdit(false);
        setEditableUser({});
      } else if (response?.status === 201) {
        toast.error(response?.data?.message);
      }

    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = async (user) => {
    try {
      let response = await axiosInstance('delete', `deleteUser?slug=${user?.slug}`);
      if (response?.status === 200) {
        setUsers(prev => prev.filter(userData => userData?.slug !== user?.slug))
        toast.success('User Deleted Successfully')
      }
    } catch (error) {
      console.error(error);
    }
  }

  const isValidate = () => {
    let error = {};
    if (formData?.name === '') {
      setErrors((prev) => ({ ...prev, name: 'Please enter Name' }))
      error['name'] = 'name'
    }
    if (formData?.email === '') {
      setErrors((prev) => ({ ...prev, email: 'Please enter Email' }))
      error['email'] = 'email'
    }
    if (formData?.age === '') {
      setErrors((prev) => ({ ...prev, age: 'Please enter Age' }))
      error['age'] = 'age'
    }
    return Object.keys(error)?.length
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidate()) {
      if (isEdit) updateUser();
      else createUser();
    }
  }

  const handleClose = () => {
    setModalShow(false);
    setFormData({
      name: '',
      email: '',
      age: ''
    });
    setErrors({
      name: '',
      email: '',
      age: ''
    })
    setIsEdit(false);
    setEditableUser({});
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: ''
    }))
  }

  const handleBlur = (e) => {
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: e.target.value?.length ? '' : `Please enter ${e.target.name.slice(0, 1).toUpperCase().concat(e.target.name.slice(1))}`
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
                  : <tr>
                    <td colSpan={4}>
                      <div className='text-center'>No Data Found</div>
                    </td>
                  </tr>}
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
                  <input type="text" value={formData.name} className="form-control" name='name' onChange={(e) => handleChange(e)} onBlur={(e) => handleBlur(e)} />
                  <p className='error'>{errors?.name}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input type="email" value={formData.email} className="form-control" name='email' onChange={(e) => handleChange(e)} onBlur={(e) => handleBlur(e)} />
                  <p className='error'>{errors?.email}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Age</label>
                  <input type="text" value={formData.age} className="form-control" name='age' onChange={(e) => handleChange(e)} onBlur={(e) => handleBlur(e)} />
                  <p className='error'>{errors?.age}</p>
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
