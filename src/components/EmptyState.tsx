import React from 'react';
import { FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  onNewNote: () => void;
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  onNewNote, 
  message = "No notes found. Create your first note to get started!" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 sm:h-96 text-center px-4">
      <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4 sm:mb-6">
        <img 
          src="/Orange and Purple Modern Gradient Arts and Crafts Service Logo (2).png" 
          alt="Notepadle" 
          className="w-8 sm:w-12 h-8 sm:h-12 object-contain"
        />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {message}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
        Organize your thoughts, ideas, and tasks in beautiful, searchable notes.
      </p>
      <button
        onClick={onNewNote}
        className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
      >
        <Plus className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
        Create Your First Note
      </button>
    </div>
  );
};

export default EmptyState;