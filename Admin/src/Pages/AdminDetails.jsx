import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Calendar, FileText, Building2, Upload, Edit, Trash2, Mail, 
  Phone, User, Search, Filter, Eye, Ban, CheckCircle, Hash, X, Save, Plus, Clock,
  Star, Loader2, Download, ArrowUp, ArrowDown, CheckCircle2, Clock as ClockIcon,
  Timer
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

function AdminDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const collection = location.state?.collection;

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedCollection, setEditedCollection] = useState(collection);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddApplicant, setShowAddApplicant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // Combined filter options
  const [applicantFilter, setApplicantFilter] = useState('all'); // 'all', 'completed', 'incomplete', 'high-to-low', 'low-to-high'
  const [newApplicant, setNewApplicant] = useState({
    name: '',
    loginId: '',
    password: '',
    score: 0
  });

  const levelConfig = {
    'Beginner': { color: 'green', icon: '★', bgColor: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-200' },
    'Intermediate': { color: 'yellow', icon: '★★', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' },
    'Advanced': { color: 'red', icon: '★★★', bgColor: 'bg-red-100', textColor: 'text-red-700', borderColor: 'border-red-200' }
  };

  useEffect(() => {
    if (collection) {
      fetchUsers();
    }
  }, [collection]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/collections/${collection._id}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortStudents = () => {
    let filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.password.includes(searchTerm)
    );

    // Apply combined filter
    switch (applicantFilter) {
      case 'completed':
        filtered = filtered.filter(student => student.completionStatus === 'Completed');
        break;
      case 'incomplete':
        filtered = filtered.filter(student => student.completionStatus === 'Incomplete');
        break;
      case 'high-to-low':
        filtered = [...filtered].sort((a, b) => b.score - a.score);
        break;
      case 'low-to-high':
        filtered = [...filtered].sort((a, b) => a.score - b.score);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    return filtered;
  };

  const filteredStudents = filterAndSortStudents();

  const downloadExcel = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Mobile', 'Score', 'Interview Status', 'Completion Date'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => [
        `"${student.name}"`,
        `"${student.loginId}"`,
        `"${student.password}"`,
        student.score,
        student.completionStatus,
        student.completedAt ? new Date(student.completedAt).toLocaleString() : 'N/A'
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${collection.company}_${collection.role}_applicants.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDisplayDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    const [datePart, timePart] = dateTimeStr.split(' ');
    return (
      <div className="flex flex-col">
        <span className="font-medium">{datePart}</span>
        <span className="text-xs text-slate-500 flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{timePart}</span>
        </span>
      </div>
    );
  };

  const getDateTimeLocalValue = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDateTimeFromInput = (datetimeLocalValue) => {
    if (!datetimeLocalValue) return '';
    const [datePart, timePart] = datetimeLocalValue.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const toggleBlockStudent = async (studentId) => {
    try {
      const student = students.find(s => s._id === studentId);
      const newStatus = student.status === 'Active' ? 'Blocked' : 'Active';

      const response = await fetch(`${API_URL}/collections/${collection._id}/users/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update user status');

      setStudents(students.map(s =>
        s._id === studentId ? { ...s, status: newStatus } : s
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status');
    }
  };

  const toggleCompletionStatus = async (studentId) => {
    try {
      const student = students.find(s => s._id === studentId);
      const newCompletionStatus = student.completionStatus === 'Completed' ? 'Incomplete' : 'Completed';

      const response = await fetch(`${API_URL}/collections/${collection._id}/users/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completionStatus: newCompletionStatus }),
      });

      if (!response.ok) throw new Error('Failed to update completion status');

      const updatedStudents = students.map(s =>
        s._id === studentId ? { 
          ...s, 
          completionStatus: newCompletionStatus,
          completedAt: newCompletionStatus === 'Completed' ? new Date() : null
        } : s
      );
      
      setStudents(updatedStudents);

      // Update collection stats
      const completedCount = updatedStudents.filter(s => s.completionStatus === 'Completed').length;
      setEditedCollection(prev => ({
        ...prev,
        completedApplicants: completedCount
      }));
    } catch (err) {
      console.error('Error updating completion status:', err);
      alert('Failed to update completion status');
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        setIsSaving(true);
        const response = await fetch(`${API_URL}/collections/${collection._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedCollection),
        });

        if (!response.ok) throw new Error('Failed to update collection');

        alert('Collection updated successfully!');
      } catch (err) {
        console.error('Error updating collection:', err);
        alert('Failed to update collection');
      } finally {
        setIsSaving(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditedCollection(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateTimeChange = (field, e) => {
    const formattedDateTime = formatDateTimeFromInput(e.target.value);
    setEditedCollection(prev => ({
      ...prev,
      [field]: formattedDateTime
    }));
  };

  const handleDeleteCollection = async () => {
    try {
      const response = await fetch(`${API_URL}/collections/${collection._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete collection');

      navigate('/');
    } catch (err) {
      console.error('Error deleting collection:', err);
      alert('Failed to delete collection');
    }
  };

  const handleNewApplicantChange = (field, value) => {
    setNewApplicant(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddApplicant = async () => {
    if (!newApplicant.name || !newApplicant.loginId || !newApplicant.password) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/collections/${collection._id}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newApplicant,
          status: 'Active',
          completionStatus: 'Incomplete'
        }),
      });

      if (!response.ok) throw new Error('Failed to add applicant');

      await fetchUsers();
      
      setNewApplicant({
        name: '',
        loginId: '',
        password: '',
        score: 0
      });
      setShowAddApplicant(false);

      setEditedCollection(prev => ({
        ...prev,
        applicants: prev.applicants + 1
      }));
    } catch (err) {
      console.error('Error adding applicant:', err);
      alert('Failed to add applicant');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this applicant?')) return;

    try {
      const response = await fetch(`${API_URL}/collections/${collection._id}/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      await fetchUsers();
      
      setEditedCollection(prev => ({
        ...prev,
        applicants: Math.max(0, prev.applicants - 1),
        completedApplicants: Math.max(0, prev.completedApplicants - 1)
      }));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const getInterviewStatus = (startDateTime, endDateTime) => {
    const now = new Date();
    const start = parseCustomDateTime(startDateTime);
    const end = parseCustomDateTime(endDateTime);
    
    if (now < start) return { status: 'Upcoming', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (now >= start && now <= end) return { status: 'Live', color: 'bg-green-100 text-green-700 border-green-200' };
    return { status: 'Completed', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  const parseCustomDateTime = (dateTimeStr) => {
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
  };

  // Check if collection is Quiz or Code Test domain
  const isTimedTest = ['Quiz', 'Code Test'].includes(editedCollection?.domain);
  // Check if collection is Computer Science or Role Based domain
  const isLevelBased = ['Computer Science', 'Role Based'].includes(editedCollection?.domain);

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">No Collection Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  const interviewStatus = getInterviewStatus(editedCollection.startDateTime, editedCollection.endDateTime);
  const completedCount = students.filter(s => s.completionStatus === 'Completed').length;
  const incompleteCount = students.filter(s => s.completionStatus === 'Incomplete').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-slate-600 hover:text-blue-600"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="bg-blue-600 text-white px-3 py-1 rounded-md font-bold text-lg">
              ADMIN
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="text-sm">Collections</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-sm font-medium text-slate-900">Details</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Collection details section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editedCollection.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="text-2xl font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={editedCollection.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="text-blue-700 font-medium bg-white border border-slate-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">{editedCollection.company}</h1>
                    <p className="text-blue-700 font-medium">{editedCollection.role}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${interviewStatus.color}`}>
                  {interviewStatus.status}
                </span>
                {isEditing ? (
                  isLevelBased ? (
                    <select
                      value={editedCollection.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="px-3 py-1 rounded-full text-sm font-medium border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  ) : null
                ) : (
                  isLevelBased && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      levelConfig[editedCollection.level].bgColor
                    } ${levelConfig[editedCollection.level].textColor} ${
                      levelConfig[editedCollection.level].borderColor
                    }`}>
                      {levelConfig[editedCollection.level].icon} {editedCollection.level}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <ColorDetailItem 
                icon={Hash} 
                label="Interview ID" 
                value={editedCollection.interviewId} 
                color="blue" 
              />
              
              <ColorDetailItem 
                icon={Calendar} 
                label="Start Date & Time" 
                value={
                  isEditing ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="datetime-local"
                          value={getDateTimeLocalValue(editedCollection.startDateTime)}
                          onChange={(e) => handleDateTimeChange('startDateTime', e)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    formatDisplayDateTime(editedCollection.startDateTime)
                  )
                } 
                color="green" 
              />
              
              <ColorDetailItem 
                icon={Calendar} 
                label="End Date & Time" 
                value={
                  isEditing ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="datetime-local"
                          value={getDateTimeLocalValue(editedCollection.endDateTime)}
                          onChange={(e) => handleDateTimeChange('endDateTime', e)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    formatDisplayDateTime(editedCollection.endDateTime)
                  )
                } 
                color="red" 
              />
              
              <ColorDetailItem 
                icon={FileText} 
                label="Domain" 
                value={
                  isEditing ? (
                    <select
                      value={editedCollection.domain}
                      onChange={(e) => handleInputChange('domain', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Role Based">Role Based</option>
                      <option value="Quiz">Quiz</option>
                      <option value="Code Test">Code Test</option>
                    </select>
                  ) : (
                    editedCollection.domain
                  )
                } 
                color="indigo" 
              />
              
              <ColorDetailItem 
                icon={Building2} 
                label="Total Applicants" 
                value={
                  <div>
                    <div className="font-semibold text-slate-900">
                      {students.length} total
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {completedCount} completed • {incompleteCount} incomplete
                    </div>
                  </div>
                } 
                color="green" 
              />
              
              <ColorDetailItem 
                icon={Upload} 
                label="Uploaded File" 
                value={editedCollection.fileName || 'N/A'} 
                color="purple" 
              />

              {/* Conditional rendering for Level or Time Limit */}
              {isLevelBased ? (
                <ColorDetailItem 
                  icon={Star} 
                  label="Interview Level" 
                  value={
                    isEditing ? (
                      <select
                        value={editedCollection.level}
                        onChange={(e) => handleInputChange('level', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        levelConfig[editedCollection.level].bgColor
                      } ${levelConfig[editedCollection.level].textColor} ${
                        levelConfig[editedCollection.level].borderColor
                      }`}>
                        {levelConfig[editedCollection.level].icon} {editedCollection.level}
                      </span>
                    )
                  } 
                  color="yellow" 
                />
              ) : isTimedTest ? (
                <ColorDetailItem 
                  icon={Timer} 
                  label="Time Limit" 
                  value={
                    isEditing ? (
                      <div className="relative">
                        <input
                          type="number"
                          value={editedCollection.timeLimit || ''}
                          onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter time limit"
                          min="1"
                          max="300"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-slate-600" />
                        <span className="font-semibold">{editedCollection.timeLimit} minutes</span>
                      </div>
                    )
                  } 
                  color="orange" 
                />
              ) : null}
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Job Description</span>
              </h3>
              {isEditing ? (
                <textarea
                  value={editedCollection.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-700 leading-relaxed text-sm bg-white"
                  rows={4}
                />
              ) : (
                <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {editedCollection.description}
                </p>
              )}
            </div>

            <div className="border-t border-slate-200 pt-6 mt-6">
              <div className="flex space-x-3">
                <button 
                  onClick={handleEditToggle}
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      <span>Edit Collection</span>
                    </>
                  )}
                </button>
                
                {isEditing ? (
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setEditedCollection(collection);
                    }}
                    className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2.5 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Applicant Details Section with Updated Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Applicant Details</span>
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  {completedCount} completed • {incompleteCount} incomplete • {students.length} total applicants
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search applicants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  
                  {/* Combined Filter Dropdown */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <select
                      value={applicantFilter}
                      onChange={(e) => setApplicantFilter(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white min-w-[180px]"
                    >
                      <option value="all">All Applicants</option>
                      <option value="completed">Completed Interviews</option>
                      <option value="incomplete">Incomplete Interviews</option>
                      <option value="high-to-low">Score: High to Low</option>
                      <option value="low-to-high">Score: Low to High</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={downloadExcel}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Excel</span>
                  </button>
                  
                  <button
                    onClick={() => setShowAddApplicant(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Applicant</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Email (Login ID)</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Password (Mobile)</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>Score</span>
                        {applicantFilter === 'high-to-low' && <ArrowDown className="w-3 h-3" />}
                        {applicantFilter === 'low-to-high' && <ArrowUp className="w-3 h-3" />}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Interview Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Account Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-blue-50 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-slate-900 text-sm group-hover:text-blue-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{student.loginId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{student.password}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2 flex-shrink-0">
                            <div 
                              className={`h-2 rounded-full ${
                                student.score >= 90 ? 'bg-green-500' :
                                student.score >= 80 ? 'bg-blue-500' :
                                student.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(student.score, 100)}%` }}
                            ></div>
                          </div>
                          <span className={`font-medium text-sm ${
                            student.score >= 90 ? 'text-green-700' :
                            student.score >= 80 ? 'text-blue-700' :
                            student.score >= 70 ? 'text-yellow-700' : 'text-red-700'
                          }`}>
                            {student.score}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleCompletionStatus(student._id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 shadow-sm ${
                            student.completionStatus === 'Completed'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200'
                          }`}
                        >
                          {student.completionStatus === 'Completed' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <ClockIcon className="w-3 h-3 flex-shrink-0" />
                              <span>Incomplete</span>
                            </>
                          )}
                        </button>
                        {student.completedAt && (
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(student.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === 'Blocked'
                            ? 'bg-red-100 text-red-700 border border-red-200' 
                            : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => toggleBlockStudent(student._id)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1 shadow-sm ${
                              student.status === 'Blocked'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {student.status === 'Blocked' ? 
                              <CheckCircle className="w-3 h-3 flex-shrink-0" /> : 
                              <Ban className="w-3 h-3 flex-shrink-0" />
                            }
                            <span>{student.status === 'Blocked' ? 'Unblock' : 'Block'}</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(student._id)}
                            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-colors flex items-center space-x-1 shadow-sm"
                          >
                            <Trash2 className="w-3 h-3 flex-shrink-0" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600">
                Showing {filteredStudents.length} of {students.length} applicants
                {applicantFilter !== 'all' && ` • Filtered by: ${
                  applicantFilter === 'completed' ? 'Completed Interviews' :
                  applicantFilter === 'incomplete' ? 'Incomplete Interviews' :
                  applicantFilter === 'high-to-low' ? 'Score (High to Low)' :
                  'Score (Low to High)'
                }`}
              </p>
              <div className="flex items-center space-x-4 text-xs text-slate-600">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{completedCount} Completed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>{incompleteCount} Incomplete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Collection</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete the collection "{collection.company} - {collection.role}"? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCollection}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Applicant Modal */}
      {showAddApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-semibold">Add New Applicant</h2>
              <button
                onClick={() => setShowAddApplicant(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newApplicant.name}
                  onChange={(e) => handleNewApplicantChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter applicant's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address (Login ID) *
                </label>
                <input
                  type="email"
                  value={newApplicant.loginId}
                  onChange={(e) => handleNewApplicantChange('loginId', e.target.value.toLowerCase())}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile Number (Password) *
                </label>
                <input
                  type="tel"
                  value={newApplicant.password}
                  onChange={(e) => handleNewApplicantChange('password', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter mobile number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Initial Score (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newApplicant.score}
                  onChange={(e) => handleNewApplicantChange('score', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter score (0-100)"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowAddApplicant(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddApplicant}
                  disabled={!newApplicant.name || !newApplicant.loginId || !newApplicant.password}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/30"
                >
                  Add Applicant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorDetailItem({ icon: Icon, label, value, color = "blue" }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-600 mb-1">{label}</p>
        <div className="text-sm font-semibold text-slate-900">
          {value}
        </div>
      </div>
    </div>
  );
}

export default AdminDetails;