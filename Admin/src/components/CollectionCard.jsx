import React, { useState } from 'react';
import { Building2, Briefcase, Calendar, FileText, MoreVertical, Eye, Trash2, ChevronRight } from 'lucide-react';

function CollectionCard({ collection, onView, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">{collection.company}</h3>
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
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center space-x-2"
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
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {collection.domain}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            collection.status === 'Active' 
              ? 'bg-green-100 text-green-700' 
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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200"
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default CollectionCard;