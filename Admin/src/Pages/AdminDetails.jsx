import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, FileText, Building2, Upload, Edit, Trash2, Mail, Phone, User } from 'lucide-react';

function AdminDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const collection = location.state?.collection;

  // Mock student data - replace with actual data from your API
  const students = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', mobile: '+1 (555) 123-4567', overallScore: 85 },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', mobile: '+1 (555) 987-6543', overallScore: 92 },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', mobile: '+1 (555) 456-7890', overallScore: 78 },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', mobile: '+1 (555) 234-5678', overallScore: 88 },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com', mobile: '+1 (555) 876-5432', overallScore: 95 },
  ];

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Collection Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-b border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">{collection.company}</h1>
                <p className="text-blue-700 font-medium">{collection.role}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                collection.status === 'Active' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {collection.status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ColorDetailItem icon={Calendar} label="Created Date" value={collection.date} color="blue" />
              <ColorDetailItem icon={FileText} label="Domain" value={collection.domain} color="indigo" />
              <ColorDetailItem icon={Building2} label="Total Applicants" value={collection.applicants} color="green" />
              <ColorDetailItem icon={Upload} label="Uploaded File" value={collection.fileName} color="purple" />
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Job Description</span>
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
                {collection.description}
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6 mt-6">
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm">
                  <Edit className="w-4 h-4" />
                  <span>Edit Collection</span>
                </button>
                <button className="px-4 py-2.5 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center space-x-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Student Details Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Applicant Details</span>
            </h2>
            <p className="text-slate-600 text-sm mt-1">List of all applicants for this position</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Mobile</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-slate-900 text-sm group-hover:text-blue-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span className="text-slate-700 text-sm">{student.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-green-500" />
                        <span className="text-slate-700 text-sm">{student.mobile}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              student.overallScore >= 90 ? 'bg-green-500' :
                              student.overallScore >= 80 ? 'bg-blue-500' :
                              student.overallScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${student.overallScore}%` }}
                          ></div>
                        </div>
                        <span className={`font-medium text-sm ${
                          student.overallScore >= 90 ? 'text-green-700' :
                          student.overallScore >= 80 ? 'text-blue-700' :
                          student.overallScore >= 70 ? 'text-yellow-700' : 'text-red-700'
                        }`}>
                          {student.overallScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors flex items-center space-x-1 shadow-sm">
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-colors flex items-center space-x-1 shadow-sm">
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600">
                Showing {students.length} of {students.length} applicants
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-600 hover:bg-white hover:border-blue-300 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-600 hover:bg-white hover:border-blue-300 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Color Detail Item Component
function ColorDetailItem({ icon: Icon, label, value, color = "blue" }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-slate-600 mb-1">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

// Add the missing Eye icon component
const Eye = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default AdminDetails;