












import React, { useState, useEffect } from 'react';
import { Note, Collaborator, ShareLink } from '../types';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { 
  X, 
  Share2, 
  Copy, 
  Users, 
  Eye, 
  Edit3, 
  Clock, 
  Link as LinkIcon,
  Mail,
  Check,
  UserPlus,
  Settings,
  Trash2,
  Globe,
  ExternalLink,
  UserMinus
} from 'lucide-react';
import axios from 'axios';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  note,
  onUpdateNote,
}) => {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(note.collaborators || []);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [newCollaboratorPermission, setNewCollaboratorPermission] = useState<'view' | 'edit'>('view');
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [autoShareLink, setAutoShareLink] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

useEffect(() => {
  if (isOpen && note && !note.shareId) {
    generateAutoShareLink();
  }

  if (isOpen && note?.shareId) {
    const mockShareLinks: ShareLink[] = [
      {
        id: note.shareId,
        noteId: note.id,
        permission: note.sharePermissions || 'view',
        createdAt: new Date(),
        accessCount: Math.floor(Math.random() * 50),
        isActive: true,
      }
    ];
    setShareLinks(mockShareLinks);
  }

  if (isOpen && note?.collaborators) {
    setCollaborators(note.collaborators);
  }
}, [isOpen, note?.id]); // only track `note.id`, not the whole object
useEffect(()=>{
  if(note.shareId)
    setAutoShareLink(`${window.location.origin}/shared/${note.shareId}`)
})

  // const generateAutoShareLink = async () => {
  //   if (!note.shareId) {
  //     const shareId = `note_${note.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
  //     await axios.put(
  //       `${import.meta.env.VITE_BASE_URL}/api/users/notes/${note.id}`,
  //       { isShared: true },
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     onUpdateNote(note.id, {
  //       isShared: true,
  //       shareId,
  //       sharePermissions: 'view',
  //     });
      
  //     const shareUrl = `${window.location.origin}/shared/${shareId}`;
  //     setAutoShareLink(shareUrl);
  //   } else {
  //     const shareUrl = `${window.location.origin}/shared/${note.shareId}`;
  //     setAutoShareLink(shareUrl);
  //   }
  // };

  const generateAutoShareLink = async () => {
  if (isGenerating) return; // Prevent duplicate calls
  setIsGenerating(true);

  try {
    console.log('Note', note);

    // Already shared? Just use the existing shareId
    if (note.shareId) {
      const shareUrl = `${window.location.origin}/shared/${note.shareId}`;
      setAutoShareLink(shareUrl);
      return;
    }

    // GUEST NOTE LOGIC
    if (note.id.startsWith('local-')) {
      const guestNotes = JSON.parse(localStorage.getItem("guestNotes") || "[]");
      const localNoteIndex = guestNotes.findIndex((n) => n.id === note.id);

      if (localNoteIndex === -1) {
        console.error("❌ Guest note not found in localStorage.");
        return;
      }

      const localNote = guestNotes[localNoteIndex];

      if (localNote.isShared && localNote.shareId) {
        const shareUrl = `${window.location.origin}/shared/${localNote.shareId}`;
        setAutoShareLink(shareUrl);
        return;
      }

      // Create guest note remotely
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/guests/notes`, {
        ...localNote,
        isShared: true,
      });

      const newNoteId = res.data._id;

      // Generate shareId ONCE
      const shareId = `note_${newNoteId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const shareUrl = `${window.location.origin}/shared/${shareId}`;

      // Update remote note with shareId
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/guests/notes/${newNoteId}`, {
        shareId,
      });

      // Save locally
      const updatedNote = {
        ...localNote,
        isShared: true,
        shareId,
        sharePermissions: "view",
      };

      guestNotes[localNoteIndex] = updatedNote;
      localStorage.setItem("guestNotes", JSON.stringify(guestNotes));

      setAutoShareLink(shareUrl);
      onUpdateNote?.(note.id, updatedNote);
    }

    // AUTHENTICATED USER LOGIC
    else {
      const shareId = `note_${note.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const shareUrl = `${window.location.origin}/shared/${shareId}`;

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/users/notes/${note.id}`,
        {
          isShared: true,
          shareId,
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      onUpdateNote?.(note.id, {
        isShared: true,
        shareId,
        sharePermissions: 'view',
      });

      setAutoShareLink(shareUrl);
    }
  } catch (err) {
    console.error("❌ Error generating share link:", err);
  } finally {
    setIsGenerating(false);
  }
};

  
  const copyToClipboard = async (url: string, linkId?: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLinkId(linkId || 'auto');
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedLinkId(linkId || 'auto');
      setTimeout(() => setCopiedLinkId(null), 2000);
    }
  };

  const handleAddCollaborator = async () => {
    if (!newCollaboratorEmail.trim()) {
      setError('Email is required');
      
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/notes/${note.id}/collaborators`,
        {
          email: newCollaboratorEmail,
          permission: newCollaboratorPermission,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const updatedCollaborators = res.data.collaborators;
      setCollaborators(updatedCollaborators);
      onUpdateNote(note.id, { collaborators: updatedCollaborators });
      setNewCollaboratorEmail('');
      toast.success('Collaborater Added!')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add collaborator');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (emailToRemove: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/users/notes/${note.id}/collaborators`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          data: { email: emailToRemove },
        }
      );

      const updatedCollaborators = res.data.collaborators;
      setCollaborators(updatedCollaborators);
      onUpdateNote(note.id, { collaborators: updatedCollaborators });
      toast.success('Collaborator Removed!')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove collaborator');
    } finally {
      setLoading(false);
    }
  };

  const openSharedNote = () => {
    if (autoShareLink) {
      window.open(autoShareLink, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <>
    <Toaster/>
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Share Note
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {note.title || 'Untitled'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Auto-Generated Share Link */}
          {autoShareLink && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-3">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">
                  Share Link
                </h3>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                  Auto-generated
                </span>
              </div>
              
              <div className="flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={autoShareLink}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(autoShareLink, 'auto')}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                  title="Copy link"
                >
                  {copiedLinkId === 'auto' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={openSharedNote}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Collaborators Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Invite Collaborators
            </h3>
            
            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter email address..."
                    value={newCollaboratorEmail}
                    onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <select
                  value={newCollaboratorPermission}
                  onChange={(e) => setNewCollaboratorPermission(e.target.value as 'view' | 'edit')}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="view">View</option>
                  <option value="edit">Edit</option>
                </select>
                <button
                  onClick={handleAddCollaborator}
                  disabled={loading || !newCollaboratorEmail.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : <UserPlus className="w-4 h-4" />}
                </button>
              </div>

              {/* Current Collaborators */}
              {collaborators.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Collaborators ({collaborators.length})
                  </h4>
                  {collaborators.map((collaborator) => (
                    <div
                      key={collaborator.email}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {collaborator.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {collaborator.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {collaborator.permission} access
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={collaborator.permission}
                          onChange={(e) => {
                            const updated = collaborators.map(c => 
                              c.email === collaborator.email 
                                ? {...c, permission: e.target.value as 'view' | 'edit'} 
                                : c
                            );
                            setCollaborators(updated);
                            onUpdateNote(note.id, { collaborators: updated });
                          }}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="view">View</option>
                          <option value="edit">Edit</option>
                        </select>
                        <button
                          onClick={() => handleRemoveCollaborator(collaborator.email)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                          title="Remove collaborator"
                        >
                          <UserMinus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Share Settings */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Settings className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200">
                  Sharing Settings
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Share links are automatically generated for each note. Anyone with the link can access your note according to the permissions you set. Edit permissions allow collaborators to modify the note content.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-6 py-2 relative bottom-10 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors duration-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ShareModal;
