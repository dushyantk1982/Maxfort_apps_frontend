// import React, { useState, useEffect } from 'react';
// import { Container, Form, Button, Table, Modal, FormCheck } from 'react-bootstrap';
// import CustomeNavbar from '../components/CustomeNavbar';
// import { toast } from 'react-toastify';
// import API_BASE_URL from '../config';

// const NotificationManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [notificationTitle, setNotificationTitle] = useState('');
//   const [notificationMessage, setNotificationMessage] = useState('');
//   const [showUserSelection, setShowUserSelection] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [existingNotifications, setExistingNotifications] = useState([]);
//   const [showExistingNotifications, setShowExistingNotifications] = useState(false);

//   // Fetch all users when component mounts
//   useEffect(() => {
//     fetchUsers();
//     fetchExistingNotifications();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${API_BASE_URL}/users-to-notify`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) throw new Error('Failed to fetch users');
      
//       const data = await response.json();
//       if (Array.isArray(data)) {
//         setUsers(data);
//       } else {
//         console.error('Expected array of users but got:', data);
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       toast.error('Failed to fetch users');
//       setUsers([]);
//     }
//   };

  
//   const fetchExistingNotifications = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) throw new Error('Failed to fetch notifications');
      
//       const data = await response.json();
//       setExistingNotifications(Array.isArray(data)?data:[]);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       toast.error('Failed to fetch existing notifications');
//       setExistingNotifications([]);
//     }
//   };

//   const handleUserSelection = (userId) => {
//     setSelectedUsers(prev => {
//       if (prev.includes(userId)) {
//         return prev.filter(id => id !== userId);
//       } else {
//         return [...prev, userId];
//       }
//     });
//   };

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedUsers(users.map(user => user.id));
//     } else {
//       setSelectedUsers([]);
//     }
//   };

// //   To submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!notificationTitle.trim() || !notificationMessage.trim()) {
//       toast.error('Please fill in all fields');
//       return;
//     }

//     if (showUserSelection && selectedUsers.length === 0) {
//       toast.error('Please select at least one user');
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${API_BASE_URL}/notifications`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           title: notificationTitle,
//           message: notificationMessage,
//           user_ids: showUserSelection ? selectedUsers : users.map(user => user.id)
//         })
//       });

//       if (!response.ok){
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to create notification');
//       } 

//       toast.success('Notification sent successfully');
//       // Reset form
//       setNotificationTitle('');
//       setNotificationMessage('');
//       setSelectedUsers([]);
//       setShowUserSelection(false);
//       fetchExistingNotifications();
//     } catch (error) {
//       console.error('Error creating notification:', error);
//       toast.error(error.message || 'Failed to send notification');
//     } finally {
//       setLoading(false);
//     }
//   };

// //   To remove notification
//   const handleRemoveNotification = async (notificationId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${API_BASE_URL}/admin/notifications/${notificationId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) throw new Error('Failed to remove notification');

//       toast.success('Notification removed successfully');
//       fetchExistingNotifications(); // Refresh the list
//     } catch (error) {
//       console.error('Error removing notification:', error);
//       toast.error('Failed to remove notification');
//     }
//   };

//   return (
//     <>
//       <CustomeNavbar />
//       <Container className="mt-4">
//         <h2 className="mb-4 text-center text-primary">Send Notifications</h2>
        
//         <Form onSubmit={handleSubmit} className="mb-4">
//           <Form.Group className="mb-3">
//             <Form.Label>Notification Title</Form.Label>
//             <Form.Control
//               type="text"
//               value={notificationTitle}
//               onChange={(e) => setNotificationTitle(e.target.value)}
//               placeholder="Enter notification title"
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Notification Message</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               value={notificationMessage}
//               onChange={(e) => setNotificationMessage(e.target.value)}
//               placeholder="Enter notification message"
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <FormCheck
//               type="checkbox"
//               label="Send to specific users"
//               checked={showUserSelection}
//               onChange={(e) => setShowUserSelection(e.target.checked)}
//             />
//           </Form.Group>

//           {showUserSelection && (
//             <div className="mb-3">
//               <h5>Select Users</h5>
//               <Table striped bordered hover>
//                 <thead>
//                   <tr>
//                     <th>
//                       <FormCheck
//                         type="checkbox"
//                         checked={selectedUsers.length === users.length}
//                         onChange={handleSelectAll}
//                       />
//                     </th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Role</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map(user => (
//                     <tr key={user.id}>
//                       <td>
//                         <FormCheck
//                           type="checkbox"
//                           checked={selectedUsers.includes(user.id)}
//                           onChange={() => handleUserSelection(user.id)}
//                         />
//                       </td>
//                       <td>{user.name}</td>
//                       <td>{user.email}</td>
//                       <td>{user.role}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           )}

//           <Button 
//             variant="primary" 
//             type="submit" 
//             disabled={loading}
//           >
//             {loading ? 'Sending...' : 'Send Notification'}
//           </Button>
//         </Form>
//         {/* Existing Notifications Section */}
//         <div className="mt-5">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h3>Existing Notifications</h3>
//             <Button 
//               variant="outline-primary" 
//               onClick={() => setShowExistingNotifications(!showExistingNotifications)}
//             >
//               {showExistingNotifications ? 'Hide' : 'Show'} Existing Notifications
//             </Button>
//           </div>

//           {showExistingNotifications && (
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Message</th>
//                   <th>Created At</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {existingNotifications.map(notification => (
//                   <tr key={notification.id}>
//                     <td>{notification.title}</td>
//                     <td>{notification.message}</td>
//                     <td>{new Date(notification.created_at).toLocaleString()}</td>
//                     <td>
//                       <span className={`badge ${notification.is_active ? 'bg-success' : 'bg-danger'}`}>
//                         {notification.is_active ? 'Active' : 'Removed'}
//                       </span>
//                     </td>
//                     <td>
//                       {notification.is_active && (
//                         <Button
//                           variant="danger"
//                           size="sm"
//                           onClick={() => handleRemoveNotification(notification.id)}
//                         >
//                           Remove
//                         </Button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           )}
//         </div>
//       </Container>
//     </>
//   );
// };

// export default NotificationManagement;

import React, { useEffect, useState } from "react";
import { createNotification, fetchNotifications, deleteNotification} from "../utils/api";
import CustomeNavbar from "../components/CustomeNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';

const NotificationManagement = () => {
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications(token);
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    if (!message.trim()) return;
    try {
      await createNotification(message, token);
      setMessage("");
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
    loadNotifications();
  }, []);

 return (
    <>
      <CustomeNavbar />
      <div className="container mt-5 bg-white p-4 shadow-lg rounded" style={{width:"800px", height:"100%", minHeight:"550px"}}>
        <div style={{width:"100%"}}>
          {/* <div className="card-header bg-primary text-white"> */}
            <h4 className="mb-4 text-center text-primary">Admin Notification Panel</h4>
          </div>
          <div className="card-body">
            <div className="mb-3 d-flex flex-column flex-md-row gap-2">
              <input type="text" className="form-control" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter notification message"/>
              <button className="btn btn-primary" onClick={handleCreate}>
                Create
              </button>
            </div>

            <h5 className="mt-4 text-primary">Active Notifications</h5>
            {notifications.length === 0 ? (
              <p className="text-muted text-primary">No active notifications</p>
            ) : (
              <ul className="list-group">
                {notifications.map((notif) => (
                  <li key={notif.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{notif.message}</span>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleDelete(notif.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default NotificationManagement;