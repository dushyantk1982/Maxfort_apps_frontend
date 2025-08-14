import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Modal, Button } from 'react-bootstrap';
import { createNotification, fetchAllNotifications, deleteNotification, fetchUsersBySearch, fetchNotificationUsers } from "../utils/api";
import CustomeNavbar from "../components/CustomeNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from "../config";
import { toast, ToastContainer  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationManagement = () => {
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState("");
  const [selectedAdmissionNo, setSelectedAdmissionNo] = useState("");
  const [selectedClassName, setSelectedClassName] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    employee_codes: [],
    admission_nos: [],
    class_names: [],
    sections: []
  });
  const [selectAll, setSelectAll] = useState(false);
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const [selectedNotificationUsers, setSelectedNotificationUsers] = useState(null);
  const [notificationUsers, setNotificationUsers] = useState([]);
  const [inactiveNotifications, setInactiveNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const data = await fetchAllNotifications(token);
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchUsers = async () => {
    const queryParts = [];

    if (searchQuery.trim()) queryParts.push(searchQuery.trim());
    if (selectedEmployeeCode) queryParts.push(selectedEmployeeCode);
    if (selectedAdmissionNo) queryParts.push(selectedAdmissionNo);
    if (selectedClassName) queryParts.push(selectedClassName);
    if (selectedSection) queryParts.push(selectedSection);

    if (queryParts.length === 0) {
      alert("Enter a search term or select filter values.");
      return;
    }

    const finalQuery = queryParts.join(" "); // Or use `,` or `|` if needed in backend

    try {
      const res = await fetchUsersBySearch(finalQuery, token);
      const newUsers = res.filter(u => !allUsers.some(p => p.id === u.id));
      setAllUsers(prev => [...prev, ...newUsers]);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  // To Select users
  const toggleUserSelection = (id) => {
    setSelectedUserIds(prev => prev.includes(id)
      ? prev.filter(uid => uid !== id)
      : [...prev, id]);
  };

  // To Select All user
  const handleSelectAll = () => {
  setSelectAll(prev => {
    const newSelectAll = !prev;
    setSelectedUserIds(newSelectAll ? allUsers.map(user => user.id) : []);
    return newSelectAll;
  });
};

  const handleCreateNotification = async () => {
    if (!message.trim() || selectedUserIds.length === 0) {
      alert("Enter message and select at least one user.");
      return;
    }
    try {
      await createNotification({ message, user_ids: selectedUserIds }, token);
      setMessage("");
      setAllUsers([]);
      setSelectedUserIds([]);
      await loadNotifications();
    } catch (err) {
      alert("Failed to create notification");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id, token);
      await loadNotifications();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try{
        // const res = await axios.get(`${API_BASE_URL}/users/filters`)
        axios.get(`${API_BASE_URL}/users/filters`, {
    headers: { Authorization: `Bearer ${token}` }
  })
        .then(response =>{
          // console.log("Filter data:", response.data);
          const data = response.data || [];
          // console.log("Filter data:", data);
          const employeeCodes = [...new Set(data.map(item => item.employee_codes).filter(Boolean))];
          const admissionNos = [...new Set(data.map(item => item.admission_nos).filter(Boolean))];
          const classNames = [...new Set(data.map(item => item.class_names).filter(Boolean))];
          const sections = [...new Set(data.map(item => item.sections).filter(Boolean))];

          setFilterOptions({
            employee_codes: employeeCodes,
            admission_nos: admissionNos,
            class_names: classNames,
            sections: sections,
          });
        })
        // const data = await res.json();
        // setFilterOptions(data);
      } catch(err){
        console.error("Failed to fetch filter options", err);
      }
    }
    fetchFilters();
    loadNotifications();
  }, []);

  // To view notification detail 
  const handleViewNotification = async (notificationId, message, created_at) => {
  try {
    const token = localStorage.getItem("token");
    const users = await fetchNotificationUsers(notificationId, token);
    setNotificationUsers(users);               //  Save actual user list
    setSelectedNotificationUsers({ id: notificationId, message, created_at });
    setShowModal(true);
  } catch (err) {
    console.error("Failed to fetch users:", err.response?.data || err.message);
    toast.error("Failed to load users for this notification.");
    // alert("Failed to fetch users for this notification");
    console.error(err);
  }
};

// To delete notifications form database
const handleDeleteNotification = async (notificationId) => {
  if (!window.confirm("Are you sure you want to delete this notification?")) return;

  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // toast.success("Notification deleted successfully");
    setTimeout(() => {
      toast.success("Notification deleted successfully", { autoClose: 1000 });
    }, 0);
    // Refetch notifications or remove it from list manually
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    // Show toast after state update
    
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete notification.");
  }
};



  return (
    <>
      <CustomeNavbar />
      <div className="container mt-5 bg-white p-4 shadow-lg rounded" style={{ width: "800px" }}>
        <h4 className="text-center text-primary mb-4">Admin Notification Panel</h4>

        <textarea
          className="form-control mb-3"
          rows="2"
          placeholder="Enter notification message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Dropdowns code */}
        <div className="row mb-3">
          <div className="col">
            <Form.Group className="mb-3">
              <Form.Label>Employee Code</Form.Label>
              <Form.Select value={selectedEmployeeCode} onChange={e => setSelectedEmployeeCode(e.target.value)}>
                <option value="">Select Employee Code</option>
                {filterOptions.employee_codes.map((code, index) => (
                  <option key={`emp-${index}`} value={code}>{code}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          <div className="col">
            <Form.Group className="mb-3">
              <Form.Label>Admission No</Form.Label>
              <Form.Select value={selectedAdmissionNo} onChange={e => setSelectedAdmissionNo(e.target.value)}>
                <option value="">Select Admission No</option>
                {filterOptions.admission_nos.map((no, index) => (
                  <option key={`adm-${index}`} value={no}>{no}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          <div className="col">
            <Form.Group className="mb-3">
              <Form.Label>Class</Form.Label>
              <Form.Select value={selectedClassName} onChange={e => setSelectedClassName(e.target.value)}>
                <option value="">Select Class</option>
                {filterOptions.class_names.map((cls, index) => (
                  <option key={`cls-${index}`} value={cls}>{cls}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          <div className="col">
            <Form.Group className="mb-3">
              <Form.Label>Section</Form.Label>
              <Form.Select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
                <option value="">Select Section</option>
                {filterOptions.sections.map((sec, index) => (
                  <option key={`sec-${index}`} value={sec}>{sec}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
        </div>

        {/* Search Bar code */}
        <div className="d-flex gap-2 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Admission No, Employee Code, Class, or Section"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearchUsers}>
            Search
          </button>
        </div>

        {allUsers.length > 0 && (
          <>
            <h6 className="text-primary">Select Users</h6>
            <table className="user-table table table-bordered">
              <thead className="gradient-header">
                <tr>
                <th style={{padding:"10px"}}>User Name</th>
                <th style={{padding:"10px"}}>Employee Code / Admission No</th>
                <th style={{padding:"10px"}}>Class</th>
                <th style={{padding:"10px"}}>Section</th>
                <th style={{padding:"10px"}}>Action<br /><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
              </tr>
              </thead>
              <tbody>
                {allUsers.map(user => (
                  <tr key={user.id}>
                    <td style={{padding:"10px"}}>{user.name}</td>
                    <td style={{padding:"10px"}}>{user.employee_code || user.admission_no}</td>
                    <td style={{padding:"10px"}}>{user.class_name}</td>
                    <td style={{padding:"10px"}}>{user.section}</td>
                    <td style={{padding:"10px"}}><input type="checkbox" checked={selectedUserIds.includes(user.id)} onChange={() => toggleUserSelection(user.id)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </>
        )}
        <button className="btn btn-primary mb-3" onClick={handleCreateNotification}>
              Send Notification
            </button>
        <hr />
        <h5 className="text-primary">Active Notifications</h5>
        
        {notifications.filter(n => n.is_active).length === 0 ? (
  <p className="text-muted">No active notifications</p>
) : (
  <table className="user-table table table-bordered">
    <thead className="gradient-header">
        <tr>
            <th style={{padding:"5px"}}>Message</th>
            <th style={{padding:"5px"}}>Date & Time</th>
            <th style={{padding:"5px"}} colSpan={2}>Action</th>
        </tr>
    </thead>
    <tbody>

      {notifications
      .filter(n => n.is_active)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(notif => (
        // 
        <tr key={notif.id} >
          <td>{notif.message}</td>
          <td>{new Date(notif.created_at).toLocaleString()}</td>
          <td>
            <button className="btn btn-sm btn-primary mx-2" onClick={() => handleViewNotification(notif.id, notif.message, notif.created_at)} > View </button>
          </td>
          <td>
            <button className="btn btn-sm btn-outline-primary" onClick={() => handleDelete(notif.id)} > Inactive </button>
          </td>
        </tr>
      ))}
    </tbody>
  
  </table>
)}

<h5 className="text-primary">Inactive Notifications</h5>
{notifications.filter(n => !n.is_active).length === 0 ? (
  <p className="text-muted">No inactive notifications</p>
) : (
  <table className="user-table table table-bordered">
    <thead className="gradient-header">
        <tr>
            <th style={{padding:"5px"}}>Message</th>
            <th style={{padding:"5px"}}>Date & Time</th>
            <th style={{padding:"5px"}} colSpan={2}>Action</th>
        </tr>
    </thead>
    <tbody>
          {notifications
      .filter(n => !n.is_active)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(notif => (
        <tr key={notif.id} >
          <td>{notif.message}</td>
          <td>{new Date(notif.created_at).toLocaleString()}</td>
          <td>
            <button className="btn btn-sm btn-primary mx-2" onClick={() => handleViewNotification(notif.id, notif.message, notif.created_at)} > View </button>
          </td>
          <td>
            <button className="btn btn-sm btn-outline-primary max 2" onClick={() => handleDeleteNotification(notif.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
 
  </table>
)}
      </div>

{/* View Notification details popup */}
<Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
  <Modal.Header closeButton className="bg-primary">
    <Modal.Title className="text-white">Notification Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedNotificationUsers && (
      <>
        <h5 className="text-primary">Message: </h5>
        <p className="text-muted"> {selectedNotificationUsers.message}</p>
        <p className="text-muted">Sent on: {new Date(selectedNotificationUsers.created_at).toLocaleString()}</p>
        <hr />
        <h6 className="text-primary">Users who received this notification:</h6>
        <ul className="list-group">
          {notificationUsers.map(user => (
            <li key={user.id} className="list-group-item">
              {user.name} ({user.employee_code || user.admission_no}) - {user.class_name} {user.section}
            </li>
          ))}
        </ul>
      </>
    )}
  </Modal.Body>
</Modal>

<ToastContainer />
    </>
  );
};

export default NotificationManagement;
