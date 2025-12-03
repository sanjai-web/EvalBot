import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  Plus, Briefcase, Calendar, Building2, FileText, Search, Filter, MoreVertical, 
  Eye, Trash2, ChevronRight, X, Upload, Hash, Clock,
  Star, Loader2, Timer, Cpu, Brain, Code, Users, Download
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

// Function to generate alphanumeric interview ID
function generateInterviewId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Function to format date with time
function formatDateTime(date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

// Function to parse custom date time string
function parseCustomDateTime(dateTimeStr) {
  if (!dateTimeStr) return new Date();
  const [datePart, timePart] = dateTimeStr.split(' ');
  const [day, month, year] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');
  return new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
}

// Simplified StatCard Component
function StatCard({ title, value, icon: Icon, color = "blue" }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    indigo: 'bg-indigo-50 border-indigo-100',
    purple: 'bg-purple-50 border-purple-100',
    orange: 'bg-orange-50 border-orange-100',
    red: 'bg-red-50 border-red-100'
  };

  const iconColors = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    indigo: 'text-indigo-600 bg-indigo-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    red: 'text-red-600 bg-red-100'
  };

  return (
    <div className={`border rounded-xl p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${iconColors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// Simplified CollectionCard Component
function CollectionCard({ collection, onView, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const getInterviewStatus = (startDateTime, endDateTime) => {
    const now = new Date();
    const start = parseCustomDateTime(startDateTime);
    const end = parseCustomDateTime(endDateTime);
    
    if (now < start) return { status: 'Upcoming', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (now >= start && now <= end) return { status: 'Live', color: 'bg-green-100 text-green-700 border-green-200' };
    return { status: 'Completed', color: 'bg-red-100 text-red-700 border-red-200' };
  };

  const interviewStatus = getInterviewStatus(collection.startDateTime, collection.endDateTime);
  const isTimedTest = ['Quiz', 'Code Test'].includes(collection.domain);

  const getDomainIcon = (domain) => {
    switch(domain) {
      case 'Computer Science': return <Cpu className="w-4 h-4" />;
      case 'Role Based': return <Briefcase className="w-4 h-4" />;
      case 'Quiz': return <Brain className="w-4 h-4" />;
      case 'Code Test': return <Code className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  const formatDate = (dateStr) => {
    const [datePart] = dateStr.split(' ');
    return datePart;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-200 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">{collection.company}</h3>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              {getDomainIcon(collection.domain)}
              <p className="font-medium">{collection.role}</p>
            </div>
          </div>
          
          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      onView(collection);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center gap-2 text-gray-700"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(collection._id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ID and Status */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
            <Hash className="w-3 h-3 text-gray-500" />
            <span className="text-xs font-mono font-medium text-gray-700">
              {collection.interviewId}
            </span>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium border ${interviewStatus.color}`}>
            {interviewStatus.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {collection.description}
        </p>

        {/* Domain and Level/Time */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            collection.domain === 'Computer Science' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
            collection.domain === 'Role Based' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
            collection.domain === 'Quiz' ? 'bg-green-100 text-green-700 border border-green-200' :
            'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {collection.domain}
          </span>
          
          {collection.domain === 'Computer Science' || collection.domain === 'Role Based' ? (
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              collection.level === 'Beginner' ? 'bg-green-100 text-green-700 border border-green-200' :
              collection.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
              'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {collection.level}
            </span>
          ) : isTimedTest ? (
            <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
              <Timer className="w-3 h-3 inline mr-1" />
              {collection.timeLimit} min
            </span>
          ) : null}
        </div>

        {/* Timeline */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Start: {formatDate(collection.startDateTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{collection.startDateTime.split(' ')[1]}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>End: {formatDate(collection.endDateTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{collection.endDateTime.split(' ')[1]}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">{collection.applicants} applicants</span>
          </div>
          
          <button
            onClick={() => onView(collection)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <span>View Details</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// CreateCollectionPopup Component
function CreateCollectionPopup({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    description: '',
    domain: 'Computer Science',
    level: 'Intermediate',
    timeLimit: 30,
    fileName: '',
    interviewId: generateInterviewId(),
    startDateTime: formatDateTime(),
    endDateTime: formatDateTime(new Date(Date.now() + 2 * 60 * 60 * 1000))
  });
  const [excelFile, setExcelFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!formData.company || !formData.role || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    const start = parseCustomDateTime(formData.startDateTime);
    const end = parseCustomDateTime(formData.endDateTime);
    
    if (start >= end) {
      setError('End date & time must be after start date & time');
      return;
    }

    if ((formData.domain === 'Quiz' || formData.domain === 'Code Test') && 
        (!formData.timeLimit || formData.timeLimit <= 0)) {
      setError('Please enter a valid time limit (in minutes)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let users = [];

      if (excelFile) {
        const data = await excelFile.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        users = jsonData.map(row => ({
          name: row.Name || row.name || '',
          loginId: (row.Email || row.email || '').toLowerCase(),
          password: String(row['Mobile.no'] || row['Mobile no'] || row.Mobile || row.mobile || ''),
          score: 0,
          status: 'Active',
          completionStatus: 'Incomplete'
        })).filter(user => user.name && user.loginId && user.password);
      }

      const collectionData = {
        interviewId: formData.interviewId,
        company: formData.company,
        role: formData.role,
        description: formData.description,
        domain: formData.domain,
        level: formData.domain === 'Computer Science' || formData.domain === 'Role Based' ? formData.level : null,
        timeLimit: formData.domain === 'Quiz' || formData.domain === 'Code Test' ? formData.timeLimit : null,
        startDateTime: formData.startDateTime,
        endDateTime: formData.endDateTime,
        fileName: formData.fileName,
        users: users
      };

      await onCreate(collectionData);
      onClose();
    } catch (err) {
      console.error('Error creating collection:', err);
      setError('Failed to create collection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFile(file);
      setFormData({ ...formData, fileName: file.name });
    }
  };

  const regenerateInterviewId = () => {
    setFormData({ ...formData, interviewId: generateInterviewId() });
  };

  const handleDateTimeChange = (field, e) => {
    const selectedDateTime = new Date(e.target.value);
    setFormData({ ...formData, [field]: formatDateTime(selectedDateTime) });
  };

  const getDateTimeLocalValue = (dateTimeStr) => {
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const isTimedTest = formData.domain === 'Quiz' || formData.domain === 'Code Test';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-semibold">Create New Collection</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview ID *
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.interviewId}
                  onChange={(e) => setFormData({ ...formData, interviewId: e.target.value.toUpperCase() })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="Enter interview ID"
                  maxLength={8}
                  disabled={isLoading}
                />
              </div>
              <button
                type="button"
                onClick={regenerateInterviewId}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                disabled={isLoading}
              >
                Regenerate
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter company name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter role title"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  value={getDateTimeLocalValue(formData.startDateTime)}
                  onChange={(e) => handleDateTimeChange('startDateTime', e)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  value={getDateTimeLocalValue(formData.endDateTime)}
                  onChange={(e) => handleDateTimeChange('endDateTime', e)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter job description"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain *
              </label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Role Based">Role Based</option>
                <option value="Quiz">Quiz</option>
                <option value="Code Test">Code Test</option>
              </select>
            </div>

            <div>
              {isTimedTest ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes) *
                  </label>
                  <div className="relative">
                    <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.timeLimit}
                      onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 0 })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter time limit in minutes"
                      min="1"
                      max="300"
                      disabled={isLoading}
                    />
                  </div>
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Level *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File (Excel) - Optional
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".xlsx,.xls"
                className="hidden"
                id="file-upload"
                disabled={isLoading}
              />
              <label
                htmlFor="file-upload"
                className={`w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className="w-5 h-5" />
                <span>{formData.fileName || 'Choose Excel file'}</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Excel format: Name, Email, Mobile.no
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                !formData.interviewId || 
                !formData.company || 
                !formData.role || 
                !formData.description || 
                !formData.startDateTime || 
                !formData.endDateTime || 
                (isTimedTest && (!formData.timeLimit || formData.timeLimit <= 0)) ||
                isLoading
              }
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Collection</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main AdminHome Component
function AdminHome() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/collections`);
      if (!response.ok) throw new Error('Failed to fetch collections');
      const data = await response.json();
      setCollections(data);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError('Failed to load collections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCollection = async (newCollection) => {
    try {
      const response = await fetch(`${API_URL}/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCollection),
      });

      if (!response.ok) throw new Error('Failed to create collection');
      
      await fetchCollections();
    } catch (err) {
      console.error('Error creating collection:', err);
      throw err;
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;

    try {
      const response = await fetch(`${API_URL}/collections/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete collection');
      
      await fetchCollections();
    } catch (err) {
      console.error('Error deleting collection:', err);
      alert('Failed to delete collection');
    }
  };

  const handleViewCollection = (collection) => {
    navigate('/Details', { state: { collection } });
  };

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.interviewId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === 'all' || collection.domain === filterDomain;
    const matchesLevel = filterLevel === 'all' || collection.level === filterLevel;
    return matchesSearch && matchesDomain && matchesLevel;
  });

  const totalApplicants = collections.reduce((sum, c) => sum + (c.applicants || 0), 0);
  const closedJobs = collections.filter(c => c.status === 'Closed').length;
const activeJobs = collections.filter(c => c.status === 'Active').length;
  // Calculate domain-wise statistics
  const domainStats = {
    'Computer Science': collections.filter(c => c.domain === 'Computer Science').length,
    'Role Based': collections.filter(c => c.domain === 'Role Based').length,
    'Quiz': collections.filter(c => c.domain === 'Quiz').length,
    'Code Test': collections.filter(c => c.domain === 'Code Test').length
  };

  // Calculate completed interviews
  const completedInterviews = collections.filter(c => {
    const now = new Date();
    const end = parseCustomDateTime(c.endDateTime);
    return now > end;
  }).length;

  const handleExportStats = () => {
    const stats = {
      'Total Collections': collections.length,
      'Active Jobs': activeJobs,
      'Closed Jobs': closedJobs,
      'Total Applicants': totalApplicants,
      'Completed Interviews': completedInterviews,
      'Computer Science Tests': domainStats['Computer Science'],
      'Role Based Tests': domainStats['Role Based'],
      'Quiz Tests': domainStats['Quiz'],
      'Code Tests': domainStats['Code Test']
    };

    const csvContent = Object.entries(stats)
      .map(([key, value]) => `${key},${value}`)
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'collection_statistics.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-xl">
                ADMIN
              </div>
              <div className="hidden md:flex items-center space-x-2 text-gray-600">
                <span className="text-sm">Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-900">Collections</span>
              </div>
            </div>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Collection</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Interview Collections</h1>
          <p className="text-gray-600">Manage and monitor all your interview processes</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Collections" 
            value={collections.length} 
            icon={Briefcase} 
            color="blue" 
          />
          <StatCard 
            title="Active Jobs" 
            value={activeJobs} 
            icon={FileText} 
            color="green" 
          />
          <StatCard 
            title="Total Applicants" 
            value={totalApplicants} 
            icon={Users} 
            color="indigo" 
          />
          <StatCard 
            title="Completed" 
            value={completedInterviews} 
            icon={Calendar} 
            color="purple" 
          />
        </div>

        {/* Quick Domain Stats */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-900">Domain Distribution</h2>
            <button
              onClick={handleExportStats}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{domainStats['Computer Science']}</div>
              <div className="text-xs text-gray-600">Computer Science</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{domainStats['Role Based']}</div>
              <div className="text-xs text-gray-600">Role Based</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{domainStats['Quiz']}</div>
              <div className="text-xs text-gray-600">Quiz</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">{domainStats['Code Test']}</div>
              <div className="text-xs text-gray-600">Code Test</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by company, role, or interview ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
              >
                <option value="all">All Domains</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Role Based">Role Based</option>
                <option value="Quiz">Quiz</option>
                <option value="Code Test">Code Test</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="text-gray-400 w-5 h-5" />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">All Collections</h2>
            <div className="text-sm text-gray-600">
              Showing {filteredCollections.length} of {collections.length} collections
            </div>
          </div>

          {filteredCollections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollections.map((collection) => (
                <CollectionCard
                  key={collection._id}
                  collection={collection}
                  onView={handleViewCollection}
                  onDelete={handleDeleteCollection}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No collections found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterDomain('all');
                  setFilterLevel('all');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {isPopupOpen && (
        <CreateCollectionPopup
          onClose={() => setIsPopupOpen(false)}
          onCreate={handleCreateCollection}
        />
      )}
    </div>
  );
}

export default AdminHome;