import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Briefcase, Calendar, Building2, FileText, Search, Filter, MoreVertical, 
  Eye, Trash2, ChevronRight, X, Upload, Building2 as BuildingIcon 
} from 'lucide-react';

// StatCard Component
function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-2 border-blue-200',
    green: 'bg-green-50 border-2 border-green-200',
    indigo: 'bg-indigo-50 border-2 border-indigo-200',
    slate: 'bg-slate-50 border-2 border-slate-200'
  };

  const iconColorClasses = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
    indigo: 'bg-indigo-600 text-white',
    slate: 'bg-slate-600 text-white'
  };


  return (
    <div className={`rounded-lg border p-6 hover:shadow-sm transition-shadow ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconColorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// CollectionCard Component
function CollectionCard({ collection, onView, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const domainColors = {
    'Computer Science': 'bg-blue-100 text-blue-700 border border-blue-200',
    'Role Based': 'bg-purple-100 text-purple-700 border border-purple-200'
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <BuildingIcon className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-900">{collection.company}</h3>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Briefcase className="w-4 h-4" />
              <p className="font-medium">{collection.role}</p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-10">
                <button
                  onClick={() => {
                    onView(collection);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center space-x-2 text-slate-700"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(collection.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{collection.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${domainColors[collection.domain]}`}>
            {collection.domain}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            collection.status === 'Active' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-slate-100 text-slate-700'
          }`}>
            {collection.status}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{collection.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>{collection.applicants} applicants</span>
          </div>
        </div>

        <button
          onClick={() => onView(collection)}
          className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </button>
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
    fileName: ''
  });

  const handleSubmit = () => {
    if (formData.company && formData.role && formData.description) {
      onCreate(formData);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, fileName: file.name });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-semibold">Create New Collection</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role *
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter role title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Job Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter job description"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Domain *
            </label>
            <select
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Role Based">Role Based</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload File (Excel)
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".xlsx,.xls"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-center space-x-2 text-slate-600 hover:text-blue-600"
              >
                <Upload className="w-5 h-5" />
                <span>{formData.fileName || 'Choose Excel file'}</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/30"
            >
              Create Collection
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
  const [collections, setCollections] = useState([
    {
      id: 1,
      company: 'Google',
      role: 'Software Developer',
      date: '25-09-2025',
      description: 'Full-stack development position focusing on cloud services',
      domain: 'Computer Science',
      fileName: 'candidates.xlsx',
      status: 'Active',
      applicants: 45
    },
    {
      id: 2,
      company: 'Microsoft',
      role: 'Product Manager',
      date: '20-09-2025',
      description: 'Lead product strategy for Azure services',
      domain: 'Role Based',
      fileName: 'applications.xlsx',
      status: 'Active',
      applicants: 32
    },
    {
      id: 3,
      company: 'Amazon',
      role: 'Data Scientist',
      date: '18-09-2025',
      description: 'ML/AI research and implementation',
      domain: 'Computer Science',
      fileName: 'data_candidates.xlsx',
      status: 'Closed',
      applicants: 67
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');

  const handleCreateCollection = (newCollection) => {
    const collection = {
      ...newCollection,
      id: collections.length + 1,
      date: new Date().toLocaleDateString('en-GB').split('/').join('-'),
      status: 'Active',
      applicants: 0
    };
    setCollections([collection, ...collections]);
    setIsPopupOpen(false);
  };

  const handleDeleteCollection = (id) => {
    setCollections(collections.filter(c => c.id !== id));
  };

  const handleViewCollection = (collection) => {
    navigate('/Details', { state: { collection } });
  };

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === 'all' || collection.domain === filterDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50/30">
      {/* Professional Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-xl shadow-sm">
                ADMIN
              </div>
              <div className="hidden md:flex items-center space-x-2 text-slate-600">
                <span className="text-sm">Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm font-medium text-slate-900">Collections</span>
              </div>
            </div>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              <Plus className="w-5 h-5" />
              <span>Create Collection</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Collections" value={collections.length} icon={Briefcase} color="blue" />
          <StatCard title="Active Jobs" value={collections.filter(c => c.status === 'Active').length} icon={FileText} color="blue" />
          <StatCard title="Total Applicants" value={collections.reduce((sum, c) => sum + c.applicants, 0)} icon={Building2} color="blue" />
          <StatCard title="Closed Jobs" value={collections.filter(c => c.status === 'Closed').length} icon={Calendar} color="blue" />
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by company or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-slate-400 w-5 h-5" />
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Domains</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Role Based">Role Based</option>
              </select>
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onView={handleViewCollection}
              onDelete={handleDeleteCollection}
            />
          ))}
        </div>

        {filteredCollections.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-600 mb-2">No collections found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Create Collection Popup */}
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