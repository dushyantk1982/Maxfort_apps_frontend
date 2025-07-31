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
const [userFormData, setUserFormData] = useState({ name: '', email: '', mobile_number: '', role: '', employee_code: '', admission_no: '', class_name: '', section: '', is_active:'', password:'' }); // For editing user details
const [showConfirmModal, setShowConfirmModal] = useState(false);
// const [selectedUser, setSelectedUser] = useState(null);
const [showCredentialsModal, setShowCredentialsModal] = useState(false);
const [selectedUserCredentials, setSelectedUserCredentials] = useState([]);
const [loadingCredentials, setLoadingCredentials] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [filterEmployeeCode, setFilterEmployeeCode] = useState("");
const [filterAdmissionNo, setFilterAdmissionNo] = useState("");
const [filterClassName, setFilterClassName] = useState("");
const [filterSection, setFilterSection] = useState("");
const [filterUserRole, setFilterUserRole] = useState("");
const [filterOptions, setFilterOptions] = useState({employee_codes: [], admission_nos: [], class_names: [], sections: [], roles: []});


const loadUsers = async (page = 1) => {
  try {
    
    const user_filter = {
      employee_code: filterEmployeeCode,
      admission_no: filterAdmissionNo,
      class_name: filterClassName,
      section: filterSection,
      user_role: filterUserRole 
    };

    const data = await fetchUsers(page, perPage, searchTerm, user_filter);  // now using searchQuery
    setUsers(data.users);
    setTotalPages(data.total_pages);
    setPage(page);  // Update current page
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
};


  useEffect(() => {
    axios.get(`${API_BASE_URL}/users`)
      .then(res => {
        setUsers(res.data.users);  // Extracting the 'users' array from the response
        setTotalPages(res.data.total_pages); // Set the total pages for pagination
      })
      .catch(err => {
        console.error("Failed to fetch users:", err);
      });

      axios.get(`${API_BASE_URL}/users/userFilters`)
      .then(res => {
        setFilterOptions(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch filter options:", err);
      });
  }, []);

  const handlePageChange = async (pageNumber) =>{
    loadUsers(pageNumber);
  };

  

  const handleView = (user) => {
    setSelectedUser(user);
    setUserFormData({ name: user.name, email: user.email, mobile_number: user.mobile_number, role: user.role, employee_code: user.employee_code, admission_no: user.admission_no, class_name: user.class_name, section: user.section, password:user.password });
    setShowModal(true); // Show the modal for user details
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
    try {

          const payload = { ...userFormData };
          if (!payload.password) {
            delete payload.password; // Don’t send empty password
          }

        const result = await updateUser(selectedUser.id, userFormData);
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
    const token = localStorage.getItem("token");
    setLoadingCredentials(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/user-credentials/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSelectedUserCredentials(response.data);
      setShowCredentialsModal(true);
    } catch (error) {
      console.error("Error fetching credentials:", error);
      // Redirect to login page if session is expired
      if(error.response?.status===401){
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href="/login";
      }else{
        alert("Failed to fetch user credentials");
      }
    } finally {
      setLoadingCredentials(false);
    }
  };
  

  return (
    <>
      <CustomeNavbar />
      <div className="container user-table-container">
  <h2 className="mb-4 text-center text-primary">Registered Users</h2>
  <div className="d-inline-flex gap-3 justify-content-even mb-3">
    <div className="col">
          <Form.Select value={filterUserRole} onChange={(e) => setFilterUserRole(e.target.value)} className="w-auto">
            <option value="">All Role</option>
            {filterOptions.roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </Form.Select>
    </div>
    <div className="col">
          <Form.Select value={filterEmployeeCode} onChange={(e) => setFilterEmployeeCode(e.target.value)} className="w-auto">
            <option value="">All Employee Code</option>
            {filterOptions.employee_codes.map((emp) => (
              <option key={emp} value={emp}>{emp}</option>
            ))}
          </Form.Select>
    </div>
    <div className="col">
          <Form.Select value={filterAdmissionNo} onChange={(e) => setFilterAdmissionNo(e.target.value)} className="w-auto">
            <option value="">All Admission No</option>
            {filterOptions.admission_nos.map((addn) => (
              <option key={addn} value={addn}>{addn}</option>
            ))}
          </Form.Select>
    </div>
    <div className="col">
          <Form.Select value={filterClassName} onChange={(e) => setFilterClassName(e.target.value)} className="w-auto">
            <option value="">All Class</option>
            {filterOptions.class_names.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </Form.Select>
    </div>
    <div className="col">
          <Form.Select value={filterSection} onChange={(e) => setFilterSection(e.target.value)} className="w-auto">
            <option value="">All Section</option>
            {filterOptions.sections.map((sec) => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </Form.Select>
    </div>
    
      
  </div>
  <div className="d-flex justify-content-center mb-3">
      <Form.Control
        type="text"
        placeholder="Search by admission no, employee code, class, or section"
        className="me-2 w-50"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="primary" onClick={() => loadUsers(1)}>
        <i className="bi bi-search"></i>{/* Search */}
      </Button>
  </div>
  <Table bordered hover responsive className="user-table">
    <thead className="gradient-header text-white text-center">
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Email</th>
        <th>Mobile</th>
        <th>Role</th>
        <th>Employee Code</th>
        <th>Admission No</th>
        <th>Class</th>
        <th>Section</th>
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
          <td>{user.employee_code}</td>
          <td>{user.admission_no}</td>
          <td>{user.class_name}</td>
          <td>{user.section}</td>
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
              <Form.Control className="mb-1" type="text" name="name" value={userFormData.name || ""} onChange={handleInputChange} disabled={!selectedUser} />
            </Form.Group>

            <Form.Group controlId="userEmail">
              <Form.Label className="fw-bold mb-1">Email</Form.Label>
              <Form.Control className="mb-1" type="email" name="email" value={userFormData.email || ""} disabled readOnly />
            </Form.Group>

            <Form.Group controlId="userMobile">
              <Form.Label className="fw-bold mb-1">Mobile Number</Form.Label>
              <Form.Control className="mb-1" type="text" name="mobile_number" value={userFormData.mobile_number || ""} onChange={handleInputChange} disabled={!selectedUser} />
            </Form.Group>

            <Form.Group controlId="userPassword">
                <Form.Label className="fw-bold mb-1">Password</Form.Label>
                <Form.Control className="mb-1" type="text" name="password" value={userFormData.password || ""} placeholder="Leave blank to keep existing password" onChange={handleInputChange} />
            </Form.Group>

            <Form.Group controlId="userRole">
              <Form.Label className="fw-bold mb-1">Role</Form.Label>
              <Form.Select className="mb-1" name="role" value={userFormData.role || ""} onChange={handleInputChange} disabled={!selectedUser} >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="userEmployeeCode">
              <Form.Label className="fw-bold mb-1">Employee Code</Form.Label>
              <Form.Control className="mb-1" type="text" name="employee_code" value={userFormData.employee_code || ""} onChange={handleInputChange} disabled={!selectedUser} />
            </Form.Group>
            <Form.Group controlId="userAdmissionNo">
              <Form.Label className="fw-bold mb-1">Admission No</Form.Label>
              <Form.Control className="mb-1" type="text" name="admission_no" value={userFormData.admission_no || ""} onChange={handleInputChange} disabled={!selectedUser} />
            </Form.Group>
            <Form.Group controlId="userClass">
              <Form.Label className="fw-bold mb-1">Class</Form.Label>
              <Form.Control className="mb-1" type="text" name="class_name" value={userFormData.class_name || ""} onChange={handleInputChange} disabled={!selectedUser} />
            </Form.Group>
            <Form.Group controlId="userSection">
              <Form.Label className="fw-bold mb-1">Section</Form.Label>
              <Form.Control className="mb-1" type="text" name="section" value={userFormData.section || ""} onChange={handleInputChange} disabled={!selectedUser} />
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
