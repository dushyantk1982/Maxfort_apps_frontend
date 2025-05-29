import React, { useEffect, useState } from "react";
import { Table, Button, Pagination, Modal, Form } from "react-bootstrap";
import { fetchUsers, deleteUser, updateUser } from "../utils/api";
import CustomeNavbar from "../components/CustomeNavbar";
import axios from 'axios';
import '../css/UserList.css'
import API_BASE_URL from "../config";


const UserList = () => {
const [users, setUsers] = useState([]);
const [page, setPage] = useState(1);
const [perPage, setPerPage] = useState(15);
const [totalPages, setTotalPages] = useState(0);
const [selectedUser, setSelectedUser] = useState(null); // To store the user details for editing/viewing
const [showModal, setShowModal] = useState(false); // To control modal visibility
const [userFormData, setUserFormData] = useState({ name: '', email: '', mobile_number: '', role: '', is_active:'', password:'' }); // For editing user details
const [showConfirmModal, setShowConfirmModal] = useState(false);
// const [selectedUser, setSelectedUser] = useState(null);
const [showCredentialsModal, setShowCredentialsModal] = useState(false);
const [selectedUserCredentials, setSelectedUserCredentials] = useState([]);
const [loadingCredentials, setLoadingCredentials] = useState(false);



  const loadUsers = async (page = 1) => {
    const data = await fetchUsers(page, perPage);
    setUsers(data.users);
    setTotalPages(data.total_pages);

  };

  useEffect(() => {
    // axios.get("http://localhost:8000/users")
    axios.get(`${API_BASE_URL}/users`)
      .then(res => {
        // console.log(res.data); 
        setUsers(res.data.users);  // Extracting the 'users' array from the response
        setTotalPages(res.data.total_pages); // Set the total pages for pagination
      })
      .catch(err => {
        console.error("Failed to fetch users:", err);
      });
  }, []);

  const handlePageChange = async (pageNumber) =>{
    loadUsers(pageNumber);
  };

  
  // const handleDelete = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this user?")) {
  //     await deleteUser(id);
  //     loadUsers(); // Refresh list
  //   }
  // };

  const handleView = (user) => {
    setSelectedUser(user);
    setUserFormData({ name: user.name, email: user.email, mobile_number: user.mobile_number, role: user.role, password:user.password });
    setShowModal(true); // Show the modal for user details
    // alert(`User Info:\nName: ${user.name}\nEmail: ${user.email}\nMobile: ${user.mobile_number}\nRole: ${user.role}`);
  };

  const handleCloseModal = () => setShowModal(false); // Close the modal

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    // console.log("Updating user ID:", selectedUser.id);
    // console.log("Data to send:", userFormData);
    try {

          const payload = { ...userFormData };
          if (!payload.password) {
            delete payload.password; // Don’t send empty password
          }

        const result = await updateUser(selectedUser.id, userFormData);
        // console.log("User update result:", result)
        setShowModal(false);
        fetchUsers(); // Refresh the table
        loadUsers();  // Refresh list after update
      } catch (error) {
        console.error("Update failed:", error.response?.data || error.message);
        alert("Error updating user. Check console for more info.");
      }
  };

  // To change the status of user as Active / Inactive
  const handleToggleStatus = (user) => {
    if (user.is_active) {
      // Show confirm modal for deactivation
      setSelectedUser(user);
      setShowConfirmModal(true);
    } else {
      // Directly activate without confirmation
      toggleUserStatus(user);
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      const updatedStatus = !user.is_active;
      await updateUser(user.id, { ...user, is_active: updatedStatus });
      loadUsers(page); // Refresh the list
    } catch (error) {
      console.error("Status toggle failed:", error.response?.data || error.message);
      alert("Failed to update user status.");
    }
  };
  
  const confirmDeactivation = () => {
    if (selectedUser) {
      toggleUserStatus(selectedUser);
      setShowConfirmModal(false);
    }
  };

  // To view user's app credentials
  const handleViewCredentials = async (user) => {
    setLoadingCredentials(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/user-credentials/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setSelectedUserCredentials(response.data);
      setShowCredentialsModal(true);
    } catch (error) {
      console.error("Error fetching credentials:", error);
      alert("Failed to fetch user credentials");
    } finally {
      setLoadingCredentials(false);
    }
  };
  

  return (
    <>
      <CustomeNavbar />
      <div className="container user-table-container">
  <h2 className="mb-4 text-center text-primary">Registered Users</h2>
  <Table bordered hover responsive className="user-table">
    <thead className="gradient-header text-white text-center">
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Email</th>
        <th>Mobile</th>
        <th>Role</th>
        <th>Status</th>
        <th>Actions</th>
        <th>App<br />Credentials</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user, index) => (
        <tr key={user.id}>
          <td>{(page - 1) * perPage + index + 1}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.mobile_number}</td>
          <td>{user.role}</td>
          <td>
              <Form.Check type="switch" id={`toggle-${user.id}`} checked={user.is_active} onChange={(e) => handleToggleStatus(user, e.target.checked)}/>
          </td>
          <td className="action-btns">
            {/* <Button variant="info" size="sm" className="me-2" onClick={() => handleView(user)} > */}
            <i className="bi bi-eye-fill text-primary me-3 view-icon" onClick={() => handleView(user)} role="button" style={{ cursor: "pointer", fontSize: "1.2rem" }}></i>
          </td>
          <td className="action-btns">
            <i className="bi bi-key-fill text-primary me-3" onClick={() => handleViewCredentials(user)} role="button" style={{ cursor: "pointer", fontSize: "1.2rem" }} title="View App Credentials"></i>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>

  <Pagination>
    {[...Array(totalPages)].map((_, index) => (
      <Pagination.Item
        key={index + 1}
        active={index + 1 === page}
        onClick={() => handlePageChange(index + 1)}
      >
        {index + 1}
      </Pagination.Item>
    ))}
  </Pagination>
</div>

      {/* Modal for Viewing/Editing User Details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">{selectedUser ? `Edit ${selectedUser.name}` : "View User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="userName">
              <Form.Label className="fw-bold mb-1">Name</Form.Label>
              <Form.Control className="mb-1" type="text" name="name" value={userFormData.name} onChange={handleInputChange} disabled={!selectedUser} />
            </Form.Group>

            <Form.Group controlId="userEmail">
              <Form.Label className="fw-bold mb-1">Email</Form.Label>
              <Form.Control className="mb-1" type="email" name="email" value={userFormData.email} disabled readOnly />
            </Form.Group>

            <Form.Group controlId="userMobile">
              <Form.Label className="fw-bold mb-1">Mobile Number</Form.Label>
              <Form.Control className="mb-1" type="text" name="mobile_number" value={userFormData.mobile_number} onChange={handleInputChange} disabled={!selectedUser} />
            </Form.Group>

            <Form.Group controlId="userPassword">
                <Form.Label className="fw-bold mb-1">Password</Form.Label>
                <Form.Control className="mb-1" type="text" name="password" value={userFormData.password} placeholder="Leave blank to keep existing password" onChange={handleInputChange} />
            </Form.Group>

            <Form.Group controlId="userRole">
              <Form.Label className="fw-bold mb-1">Role</Form.Label>
              <Form.Select className="mb-1" name="role" value={userFormData.role} onChange={handleInputChange} disabled={!selectedUser} >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {selectedUser && (
            <Button variant="primary" onClick={handleCloseModal}>Close</Button>
          )}
          {selectedUser && (
            <Button variant="outline-primary" onClick={handleSaveChanges}>Save Changes</Button>
          )}
        </Modal.Footer>
      </Modal>
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deactivation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to deactivate <strong>{selectedUser?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
            <Button variant="outline-primary" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="outline-danger" onClick={confirmDeactivation}>
              Deactivate
            </Button>
        </Modal.Footer>
      </Modal>



      {/* Credentials Modal */}
        <Modal 
          show={showCredentialsModal} 
          onHide={() => setShowCredentialsModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-primary">Application Credentials</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingCredentials ? (
              <div className="text-center">Loading credentials...</div>
            ) : selectedUserCredentials.length === 0 ? (
              <div className="text-center">No credentials found for this user</div>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Application</th>
                    <th>Username</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUserCredentials.map((cred, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{cred.app_name}</td>
                      <td>{cred.username}</td>
                      <td>{cred.password}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowCredentialsModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>




    </>
  );
};

export default UserList;
