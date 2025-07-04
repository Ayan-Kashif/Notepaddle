import React, { useState, useEffect } from 'react';
import { Note, Collaborator, Comment } from '../types';
import { 
  Users, 
  MessageCircle, 
  Clock, 
  Eye, 
  Edit3,
  Send,
  MoreVertical,
  Check,
  X
} from 'lucide-react';

interface CollaborationPanelProps {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  note,
  isOpen,
  onClose,
  currentUser,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [activeCollaborators, setActiveCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    // Mock real-time collaborator presence
    const mockActiveCollaborators = (note.collaborators || []).map(collaborator => ({
      ...collaborator,
      lastActive: new Date(Date.now() - Math.random() * 300000), // Random activity within 5 minutes
    }));
    setActiveCollaborators(mockActiveCollaborators);

    // Mock comments
    const mockComments: Comment[] = [
      {
        id: 'comment_1',
        noteId: note.id,
        userId: 'user_1',
        userName: 'Alice Johnson',
        content: 'Great insights in this section! Could we expand on the implementation details?',
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        id: 'comment_2',
        noteId: note.id,
        userId: 'user_2',
        userName: 'Bob Smith',
        content: 'I agree with Alice. Also, we should consider the performance implications.',
        createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
      },
    ];
    setComments(mockComments);
  }, [note]);

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment_${Date.now()}`,
      noteId: note.id,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Guest User',
      content: newComment,
      createdAt: new Date(),
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const getCollaboratorStatus = (collaborator: Collaborator) => {
    if (!collaborator.lastActive) return 'offline';
    const timeDiff = Date.now() - collaborator.lastActive.getTime();
    if (timeDiff < 60000) return 'active'; // Active within 1 minute
    if (timeDiff < 300000) return 'idle'; // Idle within 5 minutes
    return 'offline';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Collaboration</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Active Collaborators */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Active Collaborators ({activeCollaborators.length})
          </h4>
          <div className="space-y-2">
            {activeCollaborators.map((collaborator) => {
              const status = getCollaboratorStatus(collaborator);
              return (
                <div key={collaborator.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {collaborator.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                      status === 'active' ? 'bg-green-500' :
                      status === 'idle' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {collaborator.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      {collaborator.permission === 'edit' ? (
                        <Edit3 className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                      <span>{collaborator.permission}</span>
                      {collaborator.lastActive && (
                        <>
                          <span>•</span>
                          <span>{formatTimeAgo(collaborator.lastActive)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            Comments ({comments.length})
          </h4>
          
          <div className="space-y-4 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {comment.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.userName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none"
              rows={3}
            />
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Send className="w-4 h-4 mr-2" />
              Add Comment
            </button>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>Version {note.version || 1}</span>
            <span>Last edited by {note.lastEditedBy || 'You'}</span>
          </div>
          <div>
            Updated {formatTimeAgo(note.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;