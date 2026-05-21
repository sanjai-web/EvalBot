import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  Plus, Briefcase, Calendar, Building2, FileText, Search, Filter, MoreVertical, 
  Eye, Trash2, ChevronRight, X, Upload, Hash, Clock,
  Star, Loader2, Timer, Cpu, Brain, Code, Users, Download, ShieldCheck
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

// Modern StatCard Component
function StatCard({ title, value, icon: Icon, gradient = "from-blue-500 to-indigo-600" }) {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 -mr-10 -mt-10`} />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">{title}</p>
          <p className="text-4xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className={`p-4 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 backdrop-blur-md border border-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.05)]`}>
          <Icon className="w-7 h-7 text-slate-900" />
        </div>
      </div>
    </div>
  );
}

// Modern CollectionCard Component
function CollectionCard({ collection, onView, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const getInterviewStatus = (startDateTime, endDateTime) => {
    const now = new Date();
    const start = parseCustomDateTime(startDateTime);
    const end = parseCustomDateTime(endDateTime);
    
    if (now < start) return { status: 'Upcoming', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
    if (now >= start && now <= end) return { status: 'Live', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' };
    return { status: 'Completed', color: 'bg-gray-500/10 text-slate-500 border-gray-500/20' };
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
    <div className="glass-card rounded-2xl hover:-translate-y-1 transition-transform duration-300 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/90 rounded-lg border border-slate-200">
                <Building2 className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 tracking-wide">{collection.company}</h3>
            </div>
            <div className="flex items-center gap-2 text-indigo-300/80">
              {getDomainIcon(collection.domain)}
              <p className="font-medium text-sm tracking-wide">{collection.role}</p>
            </div>
          </div>
          
          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white rounded-xl transition-colors backdrop-blur-md"
            >
              <MoreVertical className="w-5 h-5 text-slate-500" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 glass-panel rounded-xl py-1 z-50 transform origin-top-right transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-slate-300">
                  <button
                    onClick={() => {
                      onView(collection);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-white/90 flex items-center gap-3 text-slate-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium">View Details</span>
                  </button>
                  <div className="h-px bg-white my-1 mx-2"></div>
                  <button
                    onClick={() => {
                      onDelete(collection._id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-red-500/10 text-red-400 flex items-center gap-3 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="font-medium">Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ID and Status */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 border border-slate-200 rounded-lg">
            <Hash className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-mono font-medium text-slate-600">
              {collection.interviewId}
            </span>
          </div>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${interviewStatus.color}`}>
            {interviewStatus.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-500 text-sm mb-5 line-clamp-2 leading-relaxed">
          {collection.description}
        </p>

        {/* Domain and Level/Time */}
        <div className="flex items-center gap-2 mb-5">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
            collection.domain === 'Computer Science' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
            collection.domain === 'Role Based' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
            collection.domain === 'Quiz' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
            'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {collection.domain}
          </span>
          
          {collection.domain === 'Computer Science' || collection.domain === 'Role Based' ? (
            <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
              collection.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              collection.level === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              {collection.level}
            </span>
          ) : isTimedTest ? (
            <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center">
              <Timer className="w-3.5 h-3.5 mr-1.5" />
              {collection.timeLimit} min
            </span>
          ) : null}
        </div>

        {/* Timeline */}
        <div className="space-y-3 mb-6 bg-white/90 border border-slate-100 rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Start: <span className="text-slate-600">{formatDate(collection.startDateTime)}</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{collection.startDateTime.split(' ')[1]}</span>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>End: <span className="text-slate-600">{formatDate(collection.endDateTime)}</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{collection.endDateTime.split(' ')[1]}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 bg-white/90 px-3 py-1.5 rounded-lg border border-slate-100">
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium">{collection.applicants} applicants</span>
          </div>
          
          <button
            onClick={() => onView(collection)}
            className="group/btn relative overflow-hidden bg-white hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 border border-slate-200 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
          >
            <span className="relative z-10 text-sm" style={{color: '#64abfcff',borderBlockColor: '#004089ff'}}>Manage</span>
            <ChevronRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
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
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="glass-panel rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-300 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
              <Plus className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-wide">Create New Collection</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-xl transition-colors text-slate-500 hover:text-slate-900"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-xl flex items-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-600 tracking-wide uppercase mb-2">
              Interview ID <span className="text-rose-400">*</span>
            </label>
            <div className="flex space-x-3">
              <div className="relative flex-1">
                <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  value={formData.interviewId}
                  onChange={(e) => setFormData({ ...formData, interviewId: e.target.value.toUpperCase() })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/90 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-slate-900 placeholder-gray-500 transition-all outline-none"
                  placeholder="Enter interview ID"
                  maxLength={8}
                  disabled={isLoading}
                />
              </div>
              <button
                type="button"
                onClick={regenerateInterviewId}
                className="px-6 py-3.5 bg-white/90 border border-slate-200 rounded-xl hover:bg-white transition-colors text-sm font-semibold tracking-wide text-slate-600 hover:text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                Regenerate
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 tracking-wide uppercase mb-2">
              Company Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-white/90 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-gray-500 transition-all outline-none"
                placeholder="Enter company name"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 tracking-wide uppercase mb-2">
              Role <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-white/90 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-gray-500 transition-all outline-none"
                placeholder="Enter role title"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-600 tracking-wide uppercase mb-2">
                Start Date & Time <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
                <input
                  type="datetime-local"
                  value={getDateTimeLocalValue(formData.startDateTime)}
                  onChange={(e) => handleDateTimeChange('startDateTime', e)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/90 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 transition-all outline-none [color-scheme:dark]"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 tracking-wide uppercase mb-2">
                End Date & Time <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
                <input
                  type="datetime-local"
                  value={getDateTimeLocalValue(formData.endDateTime)}
                  onChange={(e) => handleDateTimeChange('endDateTime', e)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/90 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 transition-all outline-none [color-scheme:dark]"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 tracking-wide uppercase mb-2">
              Job Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-5 py-4 bg-white/90 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-slate-900 placeholder-gray-500 transition-all outline-none"
              placeholder="Enter job description"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/90 p-6 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-sm font-semibold text-slate-600 tracking-wide uppercase mb-3">
                Domain <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-4 py-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 transition-all outline-none appearance-none"
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
                  <label className="block text-sm font-semibold text-slate-600 tracking-wide uppercase mb-3">
                    Time Limit (min) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Timer className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.timeLimit}
                      onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 0 })}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder-gray-500 transition-all outline-none"
                      placeholder="e.g. 60"
                      min="1"
                      max="300"
                      disabled={isLoading}
                    />
                  </div>
                </>
              ) : (
                <>
                  <label className="block text-sm font-semibold text-slate-600 tracking-wide uppercase mb-3">
                    Interview Level <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 transition-all outline-none appearance-none"
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
            <label className="block text-sm font-semibold text-slate-600 tracking-wide uppercase mb-2">
              Upload Candidates List (Excel)
            </label>
            <div className="relative mt-2">
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
                className={`w-full px-6 py-8 border-2 border-dashed border-slate-300 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 text-slate-500 hover:text-indigo-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="p-4 bg-white/90 rounded-full">
                  <Upload className="w-8 h-8 text-indigo-400" />
                </div>
                <span className="font-medium text-lg">{formData.fileName || 'Browse Excel File'}</span>
                <span className="text-xs text-slate-500">Columns required: Name, Email, Mobile.no</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-4 pt-6 mt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-white/90 border border-slate-200 text-slate-600 rounded-xl font-bold tracking-wide hover:bg-white hover:text-slate-900 transition-all outline-none focus:ring-2 focus:ring-white/20"
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
              className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center space-x-3 outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Collection</span>
                </>
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

  if (isLoading && collections.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-20 animate-pulse" />
        <Loader2 className="w-16 h-16 text-indigo-400 animate-spin relative z-10 mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
        <h2 className="text-3xl font-bold text-slate-900 relative z-10 tracking-wider">Loading System...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] opacity-10" />
      </div>

      {/* Header */}
      <header className="glass-panel sticky top-0 z-40 border-b border-slate-200 mb-10 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-xl tracking-widest shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-slate-200">
                EVAL<span className="font-light">BOT</span>
              </div>
              <div className="hidden md:flex items-center space-x-3 text-slate-500 text-sm font-medium">
                <span className="hover:text-indigo-400 cursor-pointer transition-colors">Admin Hub</span>
                <ChevronRight className="w-4 h-4 text-slate-900/30" />
                <span className="text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">Collections Console</span>
              </div>
            </div>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Create Collection</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6">
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 mb-3 tracking-tight text-gradient">System Overview</h1>
            <p className="text-slate-500 text-lg">Command and monitor intelligent assessment pipelines.</p>
          </div>
        </div>

        {/* Middle Section: Domain Matrix + Stat Cards side by side */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          {/* Left: Domain Matrix */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-200 lg:w-[340px] shrink-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase">Domain Matrix</h2>
              <button
                onClick={handleExportStats}
                className="text-xs bg-white/90 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                EXPORT DATA
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/90 rounded-xl border border-slate-100 text-center group hover:bg-white transition-colors">
                <div className="text-2xl font-bold text-blue-400 mb-1 group-hover:scale-110 transition-transform">{domainStats['Computer Science']}</div>
                <div className="text-xs text-slate-500 font-medium tracking-wide">CS Core</div>
              </div>
              <div className="p-4 bg-white/90 rounded-xl border border-slate-100 text-center group hover:bg-white transition-colors">
                <div className="text-2xl font-bold text-purple-400 mb-1 group-hover:scale-110 transition-transform">{domainStats['Role Based']}</div>
                <div className="text-xs text-slate-500 font-medium tracking-wide">Role-Based</div>
              </div>
              <div className="p-4 bg-white/90 rounded-xl border border-slate-100 text-center group hover:bg-white transition-colors">
                <div className="text-2xl font-bold text-emerald-400 mb-1 group-hover:scale-110 transition-transform">{domainStats['Quiz']}</div>
                <div className="text-xs text-slate-500 font-medium tracking-wide">Quiz</div>
              </div>
              <div className="p-4 bg-white/90 rounded-xl border border-slate-100 text-center group hover:bg-white transition-colors">
                <div className="text-2xl font-bold text-rose-400 mb-1 group-hover:scale-110 transition-transform">{domainStats['Code Test']}</div>
                <div className="text-xs text-slate-500 font-medium tracking-wide">Code Test</div>
              </div>
            </div>
          </div>

          {/* Right: 2×2 Stat Cards */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            <StatCard
              title="Total Frameworks"
              value={collections.length}
              icon={Briefcase}
              gradient="from-blue-500 to-indigo-600"
            />
            <StatCard
              title="Active Modules"
              value={activeJobs}
              icon={FileText}
              gradient="from-emerald-400 to-teal-500"
            />
            <StatCard
              title="Total Candidates"
              value={totalApplicants}
              icon={Users}
              gradient="from-purple-500 to-pink-500"
            />
            <StatCard
              title="Completed Evals"
              value={completedInterviews}
              icon={Calendar}
              gradient="from-amber-400 to-orange-500"
            />
          </div>
        </div>

        {/* Collections Grid */}
        <div>
          {/* Database Filters — inline above collection list */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5 z-10" />
              <input
                type="text"
                placeholder="Search frameworks, IDs, roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="relative w-full pl-12 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:border-indigo-500 text-slate-900 placeholder-gray-500 transition-all outline-none"
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="text-indigo-400 w-4 h-4" />
                </div>
                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:border-indigo-500 text-slate-900 outline-none min-w-[150px] appearance-none"
                >
                  <option value="all">All Domains</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Role Based">Role Based</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Code Test">Code Test</option>
                </select>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Star className="text-amber-400 w-4 h-4" />
                </div>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:border-amber-500 text-slate-900 outline-none min-w-[150px] appearance-none"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.6)]"></div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-wide">Active Collections</h2>
            </div>
            <div className="bg-white/90 border border-slate-200 px-4 py-2 rounded-lg text-sm text-slate-500 font-medium">
              Showing <span className="text-slate-900">{filteredCollections.length}</span> of {collections.length} results
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
            <div className="glass-panel border border-slate-200 rounded-2xl p-16 text-center mt-10">
              <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200">
                <Briefcase className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No collections found</h3>
              <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">The system couldn't locate any matching records in the database. Try adjusting your query parameters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterDomain('all');
                  setFilterLevel('all');
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] tracking-wide"
              >
                RESET FILTERS
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