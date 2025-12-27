import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthenticationPrompt from "../components/AuthenticationPrompt";

export default function Dashboard() {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userQueries, setUserQueries] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // Changed from allUsers to allStudents
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", email: "", role: "student" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUserRole(userData.role);
      
      if (userData.role === "admin") {
        loadAllStudents(); // Changed to loadAllStudents
        loadAllQueries();
      } else {
        loadUserQueries(userData);
      }
    } else {
      setShowLoginPrompt(true);
    }
  }, []);

  const loadUserQueries = (userData) => {
    const user = userData;
    const allQueries = JSON.parse(localStorage.getItem("userQueries") || "[]");
    
    // Filter queries for current user
    const userSpecificQueries = allQueries.filter(
      query => query.userId === user.email
    );
    
    // Sort by timestamp (newest first)
    userSpecificQueries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setUserQueries(userSpecificQueries);
  };

  const loadAllQueries = () => {
    const allQueries = JSON.parse(localStorage.getItem("userQueries") || "[]");
    // Sort by timestamp (newest first)
    allQueries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setUserQueries(allQueries);
  };

  // Fetch only students from backend (Admin only)
  const loadAllStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Filter only students (exclude admins)
      const students = response.data.filter(user => user.role === "student");
      setAllStudents(students);
    } catch (error) {
      console.error("Error loading students:", error);
      setMessage(error.response?.data?.message || "Error loading students");
      
      // Fallback to demo data if API fails (only students)
      
     
    } finally {
      setLoading(false);
    }
  };

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  // Delete query function
  const deleteQuery = (queryId) => {
    if (window.confirm("Are you sure you want to delete this query? This action cannot be undone.")) {
      const allQueries = JSON.parse(localStorage.getItem("userQueries") || "[]");
      
      // Filter out the query to be deleted
      const updatedQueries = allQueries.filter(query => query.id !== queryId);
      
      // Save back to localStorage
      localStorage.setItem("userQueries", JSON.stringify(updatedQueries));
      
      // Update state
      if (userRole === "admin") {
        loadAllQueries();
      } else {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userSpecificQueries = updatedQueries.filter(
          query => query.userId === user.email
        );
        userSpecificQueries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setUserQueries(userSpecificQueries);
      }
      
      alert("Query deleted successfully!");
    }
  };

  // Delete student function (admin only) - Calls backend API
  const deleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        
        await axios.delete(`http://localhost:5000/api/users/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Remove student from local state
        setAllStudents(prevStudents => prevStudents.filter(student => student._id !== studentId));
        setMessage("Student deleted successfully!");
        
      } catch (error) {
        console.error("Error deleting student:", error);
        setMessage(error.response?.data?.message || "Error deleting student");
      }
      
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Start editing student (admin only)
  const startEditStudent = (student) => {
    setEditingUser(student._id);
    setEditForm({
      fullName: student.fullName,
      email: student.email,
      role: student.role
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({ fullName: "", email: "", role: "student" });
  };

  // Update student (admin only) - Calls backend API
  const updateStudent = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        `http://localhost:5000/api/users/${studentId}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update student in local state
      setAllStudents(prevStudents => 
        prevStudents.map(student => 
          student._id === studentId ? response.data.user : student
        )
      );
      
      setEditingUser(null);
      setMessage("Student updated successfully!");
      
    } catch (error) {
      console.error("Error updating student:", error);
      setMessage(error.response?.data?.message || "Error updating student");
    }
    
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Manual refresh to check for new replies
  const refreshData = () => {
    if (userRole === "admin") {
      loadAllQueries();
      loadAllStudents(); // Also refresh students
    } else {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      loadUserQueries(user);
    }
    alert("Data refreshed!");
  };

  // Mark as replied manually
  const markAsReplied = (queryId) => {
    const allQueries = JSON.parse(localStorage.getItem("userQueries") || "[]");
    const updatedQueries = allQueries.map(query => {
      if (query.id === queryId) {
        return {
          ...query,
          status: "replied",
          lastUpdated: new Date().toISOString()
        };
      }
      return query;
    });
    
    localStorage.setItem("userQueries", JSON.stringify(updatedQueries));
    
    if (userRole === "admin") {
      loadAllQueries();
    } else {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      loadUserQueries(user);
    }
    alert("Query marked as replied!");
  };

  // Add admin reply manually
  const addAdminReply = (queryId) => {
    if (!replyMessage.trim()) {
      alert("Please enter a reply message.");
      return;
    }

    const allQueries = JSON.parse(localStorage.getItem("userQueries") || "[]");
    const updatedQueries = allQueries.map(query => {
      if (query.id === queryId) {
        const newReply = {
          id: Date.now().toString(),
          message: replyMessage,
          timestamp: new Date().toISOString(),
          responder: "Support Team",
          type: "admin_reply"
        };
        
        return {
          ...query,
          status: "replied",
          adminReplies: [...(query.adminReplies || []), newReply],
          lastUpdated: new Date().toISOString()
        };
      }
      return query;
    });
    
    localStorage.setItem("userQueries", JSON.stringify(updatedQueries));
    
    if (userRole === "admin") {
      loadAllQueries();
    } else {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      loadUserQueries(user);
    }
    
    setShowReplyForm(null);
    setReplyMessage("");
    alert("Reply added successfully!");
  };

  if (!isLoggedIn) {
    return (
      <>
        <AuthenticationPrompt 
          show={showLoginPrompt}
          onClose={closeLoginPrompt}
          title="Authentication Required"
          message="Please login first to access your Dashboard."
          redirectPath="/login?from=protected"
        />
      </>
    );
  }

  // --- DASHBOARD LOGIC ---
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getDisplayName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.email) return user.email.split('@')[0];
    return "User";
  };

  const displayName = getDisplayName();

  const getMemberSince = () => {
    const loginTime = user?.loginTime ? new Date(user.loginTime) : new Date();
    return loginTime.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMemberDuration = () => {
    const loginTime = user?.loginTime ? new Date(user.loginTime) : new Date();
    const now = new Date();
    const diffTime = Math.abs(now - loginTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Reset all user-specific state
    setIsLoggedIn(false);
    setUserQueries([]);
    setShowReplyForm(null);
    setReplyMessage("");
    setShowLoginPrompt(true);
    
    // Navigate to login page
    navigate("/login");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "⏳ Waiting for Response" },
      replied: { color: "bg-green-100 text-green-800", text: "✅ Replied" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render different dashboard based on role
  if (userRole === "admin") {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Admin Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-lg text-purple-100">
                  Welcome back, {displayName}! Manage all students and system queries.
                </p>
                <p className="text-sm text-purple-200 mt-2">
                  Role: Administrator | Member since: {getMemberSince()}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards for Admin */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-xl">👥</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{allStudents.length}</p>
                  <p className="text-gray-600 text-sm">Total Students</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold text-xl">📝</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{userQueries.length}</p>
                  <p className="text-gray-600 text-sm">Total Queries</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-yellow-600 font-bold text-xl">⏳</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {userQueries.filter(q => q.status === "pending").length}
                  </p>
                  <p className="text-gray-600 text-sm">Pending Queries</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold text-xl">✅</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {userQueries.filter(q => q.status === "replied").length}
                  </p>
                  <p className="text-gray-600 text-sm">Replied Queries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-center font-semibold ${
              message.includes("successfully") 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : "bg-red-100 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          {/* Student Management Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Student Management</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Manage all registered students from the database
                </p>
              </div>
              <button
                onClick={loadAllStudents}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300 font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </>
                )}
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading students from database...</p>
              </div>
            ) : allStudents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👥</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">No students found</h4>
                <p className="text-gray-500">Students will appear here once they register in the system.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Student</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allStudents.map((student) => (
                      <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          {editingUser === student._id ? (
                            <input
                              type="text"
                              name="fullName"
                              value={editForm.fullName}
                              onChange={handleEditChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-bold text-sm">
                                  {student.fullName?.charAt(0).toUpperCase() || student.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-gray-800">
                                {student.fullName || "No Name"}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {editingUser === student._id ? (
                            <input
                              type="email"
                              name="email"
                              value={editForm.email}
                              onChange={handleEditChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="text-gray-600">{student.email}</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm">
                          {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            {editingUser === student._id ? (
                              <>
                                <button
                                  onClick={() => updateStudent(student._id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-300"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium transition duration-300"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditStudent(student)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-300"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => deleteStudent(student._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-300"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* All Queries Section for Admin */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">All Student Queries</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Monitor and manage all student queries
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={refreshData}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {userQueries.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📝</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">No queries yet</h4>
                <p className="text-gray-500">Student queries will appear here once submitted.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userQueries.map((query) => (
                  <div key={query.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300 relative">
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteQuery(query.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition duration-300"
                      title="Delete Query"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    <div className="flex justify-between items-start mb-4 pr-12">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-1">
                          {query.subject}
                        </h4>
                        <p className="text-sm text-gray-600">
                          From: {query.first_name} {query.last_name} | 
                          Email: {query.email} | 
                          Type: <span className="font-medium capitalize">{query.query_type}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(query.status)}
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(query.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{query.message}</p>
                    
                    {/* Admin Action Buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                      {query.status === "pending" && (
                        <>
                          <button
                            onClick={() => markAsReplied(query.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300"
                          >
                            Mark as Replied
                          </button>
                          <button
                            onClick={() => setShowReplyForm(query.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300"
                          >
                            Add Reply
                          </button>
                        </>
                      )}
                    </div>

                    {/* Reply Form */}
                    {showReplyForm === query.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-semibold text-gray-800 mb-2">Add Reply as Admin</h5>
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Enter your reply message..."
                          rows="3"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => addAdminReply(query.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
                          >
                            Save Reply
                          </button>
                          <button
                            onClick={() => {
                              setShowReplyForm(null);
                              setReplyMessage("");
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
                            >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Admin Replies Section */}
                    {query.adminReplies && query.adminReplies.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Responses from Support Team ({query.adminReplies.length})
                        </h5>
                        {query.adminReplies.map((reply, index) => (
                          <div key={reply.id} className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-green-800">{reply.responder}</span>
                              <span className="text-xs text-green-600">{formatDate(reply.timestamp)}</span>
                            </div>
                            <p className="text-green-700 whitespace-pre-wrap">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard (original dashboard content)
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#003366] to-[#004080] rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome to Your Dashboard, {displayName}!
              </h1>
              <p className="text-lg text-blue-100">
                We're excited to have you here. Explore your academic journey and get the support you need.
              </p>
              <p className="text-sm text-blue-200 mt-2">
                Member since: {getMemberSince()} ({getMemberDuration()})
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Rest of the original student dashboard remains the same */}
        {/* Dashboard Content - Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold text-lg">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Profile Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600"><strong>Full Name:</strong></span>
                <span className="text-gray-800">{user?.fullName || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600"><strong>Email:</strong></span>
                <span className="text-gray-800">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600"><strong>Member Since:</strong></span>
                <span className="text-gray-800">{getMemberSince()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600"><strong>Duration:</strong></span>
                <span className="text-gray-800">{getMemberDuration()}</span>
              </div>
            </div>
          </div>

          {/* CS Chatbot Service */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold text-lg">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">CS AI Assistant</h3>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                Our intelligent chatbot is here to help you 24/7 with:
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Course prerequisites and requirements
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Faculty office hours and contact information
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Final project guidelines and submission dates
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Academic calendar and important deadlines
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Technical support and troubleshooting
                </li>
              </ul>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-3">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Click the chat icon in the bottom right to start a conversation!
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-purple-600 font-bold text-lg">📞</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Contact Support</h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Need personalized assistance? Our support team is here to help:
              </p>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-800 text-sm">Email Support</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    We'll respond to your email and update the status here.
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-800 text-sm">Response Time</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-800 text-sm">Track Responses</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    All email replies will appear in your queries section below.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/contactus')}
                className="w-full bg-[#003366] hover:bg-[#00509e] text-white py-2 px-4 rounded-lg transition duration-300 text-sm font-medium"
              >
                Submit New Query
              </button>
            </div>
          </div>
        </div>

        {/* Your Queries Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-[#003366]">Your Support Queries</h3>
              <p className="text-gray-600 text-sm mt-1">
                Track all your queries and our responses here
              </p>
            </div>
            <div className="flex gap-3">
              
              <button
                onClick={() => navigate('/contactus')}
                className="bg-[#003366] hover:bg-[#00509e] text-white px-6 py-2 rounded-lg transition duration-300 font-medium"
              >
                + New Query
              </button>
            </div>
          </div>

          {userQueries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📝</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">No queries yet</h4>
              <p className="text-gray-500 mb-6">Submit your first query and we'll help you out!</p>
              <button
                onClick={() => navigate('/contactus')}
                className="bg-[#003366] hover:bg-[#00509e] text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
              >
                Submit Your First Query
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {userQueries.map((query) => (
                <div key={query.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300 relative">
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteQuery(query.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition duration-300"
                    title="Delete Query"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <div className="flex justify-between items-start mb-4 pr-12">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        {query.subject}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Regarding: <span className="font-medium capitalize">{query.query_type}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(query.status)}
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(query.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{query.message}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                      Submitted by: {query.first_name} {query.last_name}
                    </span>
                    <div className="flex gap-4">
                      <span>📧 {query.email}</span>
                      <span>📞 {query.mobile}</span>
                    </div>
                  </div>

                  {/* Admin Replies Section */}
                  {query.adminReplies && query.adminReplies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Responses from Support Team ({query.adminReplies.length})
                      </h5>
                      {query.adminReplies.map((reply, index) => (
                        <div key={reply.id} className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-green-800">{reply.responder}</span>
                            <span className="text-xs text-green-600">{formatDate(reply.timestamp)}</span>
                          </div>
                          <p className="text-green-700 whitespace-pre-wrap">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Support Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-[#003366] mb-6">Need More Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-[#003366] mb-3">🤖 CS AI Assistant</h4>
              <p className="text-gray-700 mb-4">
                Get instant answers to common questions about courses, faculty, deadlines, and academic policies.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Available 24/7</li>
                <li>• Instant responses</li>
                <li>• Course-specific information</li>
                <li>• Deadline reminders</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-[#003366] mb-3">📞 Email Support</h4>
              <p className="text-gray-700 mb-4">
                For complex issues or personalized guidance, our support team is ready to assist you via email.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Detailed query form</li>
                <li>• Email responses</li>
                <li>• Status tracking</li>
                <li>• Response history</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Remember: The chatbot is perfect for quick questions, while email support is better for detailed issues requiring personal attention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}