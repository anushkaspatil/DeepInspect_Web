import React, { useEffect, useState } from "react";
import { Users, Settings, LogOut, Edit3, Trash2, Save, X, ChevronDown, ChevronRight, Shield, UserCheck, User } from "lucide-react";
import "./admin.css";

// Dummy data since original imports aren't available
const dummyUsers = [
  { username: "admin1", fullName: "John Smith", email: "john@company.com", phone: "123-456-7890", role: "admin" },
  { username: "admin2", fullName: "Sarah Wilson", email: "sarah@company.com", phone: "123-456-7891", role: "admin" },
  { username: "supervisor1", fullName: "Mike Johnson", email: "mike@company.com", phone: "123-456-7892", role: "supervisor" },
  { username: "supervisor2", fullName: "Lisa Brown", email: "lisa@company.com", phone: "123-456-7893", role: "supervisor" },
  { username: "operator1", fullName: "David Lee", email: "david@company.com", phone: "123-456-7894", role: "operator" },
  { username: "operator2", fullName: "Emma Davis", email: "emma@company.com", phone: "123-456-7895", role: "operator" },
  { username: "operator3", fullName: "Alex Chen", email: "alex@company.com", phone: "123-456-7896", role: "operator" },
];

const CreateUserForm = () => (
  <div className="admin-card p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <Users className="w-5 h-5" />
      Create New User
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input className="admin-input" placeholder="Full Name" />
      <input className="admin-input" placeholder="Email" type="email" />
      <input className="admin-input" placeholder="Phone" />
      <select className="admin-input">
        <option>Select Role</option>
        <option value="admin">Admin</option>
        <option value="supervisor">Supervisor</option>
        <option value="operator">Operator</option>
      </select>
    </div>
    <button className="admin-btn-primary mt-4">
      <Users className="w-4 h-4" />
      Create User
    </button>
  </div>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [expandedRoles, setExpandedRoles] = useState({ admin: true, supervisor: true, operator: true });

  useEffect(() => {
    setUsers(dummyUsers);
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
  };

  const handleDeleteUser = (username) => {
    setUsers(users.filter((u) => u.username !== username));
    if (selectedUser && selectedUser.username === username) {
      setSelectedUser(null);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
    setEditedUser({ ...selectedUser });
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = () => {
    setUsers(users.map((user) => (user.username === editedUser.username ? editedUser : user)));
    setSelectedUser(editedUser);
    setIsEditing(false);
  };

  const toggleRole = (role) => {
    setExpandedRoles(prev => ({ ...prev, [role]: !prev[role] }));
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return Shield;
      case "supervisor": return UserCheck;
      case "operator": return User;
      default: return User;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "role-admin";
      case "supervisor": return "role-supervisor";
      case "operator": return "role-operator";
      default: return "role-default";
    }
  };

  return (
    <div className="min-h-screen admin-bg">
      {/* Navigation */}
      <nav className="admin-navbar">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="nav-link">
              <Users className="w-4 h-4" />
              Users
            </button>
            <button className="nav-link">
              <Settings className="w-4 h-4" />
              Access
            </button>
            <button className="nav-link text-red-300 hover:text-red-200">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User List */}
          <div className="lg:col-span-1">
            <div className="admin-card">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </h2>
              
              <div className="space-y-3">
                {["admin", "supervisor", "operator"].map((role) => {
                  const RoleIcon = getRoleIcon(role);
                  const roleUsers = users.filter(user => user.role === role);
                  
                  return (
                    <div key={role} className="role-section">
                      <button
                        onClick={() => toggleRole(role)}
                        className="role-header"
                      >
                        <div className="flex items-center gap-2">
                          <RoleIcon className="w-4 h-4" />
                          <span className="capitalize font-medium">{role}s</span>
                          <span className="role-count">({roleUsers.length})</span>
                        </div>
                        {expandedRoles[role] ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                        }
                      </button>
                      
                      {expandedRoles[role] && (
                        <div className="role-content">
                          {roleUsers.map(user => (
                            <button
                              key={user.username}
                              onClick={() => handleSelectUser(user)}
                              className={`user-item ${selectedUser?.username === user.username ? 'user-item-active' : ''}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${getRoleColor(user.role)}`}></div>
                                <span className="font-medium">{user.username}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <div className="admin-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    User Details
                  </h2>
                  <div className={`role-badge ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role.toUpperCase()}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          name="fullName"
                          value={editedUser.fullName}
                          onChange={handleInputChange}
                          className="admin-input"
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          name="email"
                          type="email"
                          value={editedUser.email}
                          onChange={handleInputChange}
                          className="admin-input"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          name="phone"
                          value={editedUser.phone}
                          onChange={handleInputChange}
                          className="admin-input"
                          placeholder="Phone"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                          name="role"
                          value={editedUser.role}
                          className="admin-input bg-gray-50"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button onClick={handleSaveEdit} className="admin-btn-success">
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button onClick={() => setIsEditing(false)} className="admin-btn-secondary">
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="detail-item">
                        <span className="detail-label">Username</span>
                        <span className="detail-value">{selectedUser.username}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Full Name</span>
                        <span className="detail-value">{selectedUser.fullName}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">{selectedUser.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">{selectedUser.phone}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                      <button onClick={handleEditToggle} className="admin-btn-warning">
                        <Edit3 className="w-4 h-4" />
                        Edit User
                      </button>
                      <button onClick={() => handleDeleteUser(selectedUser.username)} className="admin-btn-danger">
                        <Trash2 className="w-4 h-4" />
                        Delete User
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="admin-card text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No User Selected</h3>
                <p className="text-gray-400">Select a user from the list to view their details</p>
              </div>
            )}
          </div>
        </div>

        {/* Create User Form */}
        <div className="mt-8">
          <CreateUserForm />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;