


// components/NoteEditor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { X, Save, Tag, Folder, Clock, Check, Download, Share2, Users, Shield, Link as LinkIcon } from 'lucide-react';
import { useAutoSave } from '../hooks/useAutoSave';
import ExportMenu from './ExportMenu';
import RichTextEditor from './RichTextEditor';
import ShareModal from './ShareModal';
import CollaborationPanel from './CollaborationPanel';
import PrivacySettings from './PrivacySettings';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface NoteEditorProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  onUpdate: (updatedNote: Note) => void;

  currentUser?: any;
}

interface ApiError {
  message: string;
  response?: {
    data?: {
      success?: boolean;
      error?: string;
      details?: any;
    };
  };
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  isOpen,
  onClose,
  onSave,
  onUpdate,

  currentUser,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'plain' | 'markdown'>('plain');
  const [category, setCategory] = useState('personal');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCollaborationPanelOpen, setIsCollaborationPanelOpen] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordHint, setPasswordHint] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [message, setMessage] = useState('')
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState<Category[]>([]);

  const isUserLoggedIn = () => {
    if (localStorage.getItem('token'))
      return true
    else
      return false
  };
  const DEFAULT_CATEGORIES = [
    { id: 'personal', name: 'Personal', color: '#6366F1', count: 0, isDefault: true },
    { id: 'work', name: 'Work', color: '#8B5CF6', count: 0, isDefault: true },
    { id: 'ideas', name: 'Ideas', color: '#10B981', count: 0, isDefault: true },
    { id: 'todo', name: 'To-Do', color: '#F59E0B', count: 0, isDefault: true },
  ]
  // Fetching User using TOKEN
  const fetchUserFromToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const userData = await fetchUserFromToken();
      if (userData) {
        setUser(userData);

      }
    };
    getUser();
  }, []);
  const saveNoteToBackend = async (noteData: any, isUpdate: boolean): Promise<string> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      if (isUpdate && !note) {
        throw new Error("Cannot update - no existing note");
      }


      // Prepare payload with only allowed fields
      const payload = {
        title: noteData.title || 'Untitled',
        content: noteData.content || '',
        contentType: noteData.contentType || 'plain',
        category: noteData.category || 'personal',
        tags: noteData.tags || [],
        isPinned: noteData.isPinned || false,
        isFavorite: noteData.isFavorite || false,
        isPrivate: noteData.isPrivate || false,
        ...(noteData.password && { password: noteData.password }),
        ...(noteData.passwordHint && { passwordHint: noteData.passwordHint })
      };

      console.debug('Saving note payload:', payload);

      const endpoint = isUpdate
        ? `${import.meta.env.VITE_BASE_URL}/api/users/notes/${note?._id}`
        : `${import.meta.env.VITE_BASE_URL}/api/users/notes`;

      const method = isUpdate ? 'put' : 'post';

      const response = await axios[method](endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data?.data?._id) {
        throw new Error('Invalid response format from server');
      }

      return response.data.data._id;
    } catch (error: any) {
      console.error('API Request Failed:', {
        endpoint: error.config?.url,
        method: error.config?.method,
        payload: error.config?.data,
        status: error.response?.status,
        response: error.response?.data
      });

      const apiError: ApiError = error;
      let errorMessage = 'Failed to save note';

      if (apiError.response?.data?.error) {
        errorMessage = apiError.response.data.error;
        if (apiError.response.data.details) {
          errorMessage += `: ${JSON.stringify(apiError.response.data.details)}`;
        }
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      throw new Error(errorMessage);
    }
  };
  const loadGuestCategories = () => {
    const saved = localStorage.getItem('guest_categories');
    const customCategories = saved ? JSON.parse(saved) : [];

    // Always merge with default categories, removing any duplicates
    const mergedCategories = [
      ...DEFAULT_CATEGORIES,
      ...customCategories.filter(
        (custom: Category) => !DEFAULT_CATEGORIES.some(defaultCat => defaultCat.id === custom.id))
    ];

    setCategories(mergedCategories);

    // If no saved categories exist yet, initialize storage with defaults
    // if (!saved) {
    //   localStorage.setItem('guest_categories', JSON.stringify(mergedCategories));
    // }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {

        setMessage('');

        if (user) {
          // Fetch from API for authenticated users
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/categories`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (!response.ok) throw new Error('Failed to fetch categories');

          const data = await response.json();
          console.log(data.categories)
           setCategories([...DEFAULT_CATEGORIES, ...data.categories]);
        } else {
          // Load from localStorage for guests
          loadGuestCategories()
        }
      } catch (err) {
        setMessage('Failed to load categories');
        console.error(err);
      }
    };

    fetchCategories();
  }, [user]); // Re-run when auth status change


  const handleAutoSave = async (data: any) => {
    // Don't save if no note exists or empty content
    if (!note || (!data.title.trim() && !data.content.trim())) return;
    console.log(note)
    const noteData = {
      title: data.title || 'Untitled',
      content: data.content,
      contentType: data.contentType,
      category: data.category,
      tags: data.tags,
      isPinned: note.isPinned || false,
      isFavorite: note.isFavorite || false,
      isShared: note.isShared || false,
      shareId: note.shareId,
      sharePermissions: note.sharePermissions,
      sharedWith: note.sharedWith || [],
      collaborators: note.collaborators || [],
      version: (note.version || 0) + 1,
      lastEditedBy: currentUser?.name || 'You',
      isPrivate: data.isPrivate,
      password: data.password,
      passwordHint: data.passwordHint,
      updatedAt: new Date()
    };

    try {
      if (isUserLoggedIn()) {
        // Update existing note in backend
        await axios.put(`${import.meta.env.VITE_BASE_URL}/api/users/notes/${note._id}`, noteData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Update local note
        onUpdate({
          ...note,
          ...noteData
        });
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save error:', error);
      // Optional: Show subtle error indication without interrupting user
    }
  };

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setContentType(note.contentType || 'plain');
      setCategory(note.category);
      setTags(note.tags);
      setIsPrivate(note.isPrivate || false);
      setPassword(note.password || '');
      setPasswordHint(note.passwordHint || '');
      setLastSaved(note.updatedAt);
      setHasUnsavedChanges(false);

      // Generate share link if note has shareId
      if (note.shareId) {
        setShareLink(`${window.location.origin}/shared/${note.shareId}`);
      }
    } else {
      setTitle('');
      setContent('');
      setContentType('plain');
      setCategory('personal');
      setTags([]);
      setIsPrivate(false);
      setPassword('');
      setPasswordHint('');
      setLastSaved(null);
      setHasUnsavedChanges(false);
      setShareLink('');
    }
  }, [note]);

  // Auto-generate share link when note content exists
  useEffect(() => {
    if ((title?.trim() || content?.trim()) && !shareLink && !isPrivate) {
      generateShareLink();
    }
  }, [title, content, isPrivate]);

  const generateShareLink = () => {
    if (!note && (title.trim() || content.trim())) {
      // For new notes, we'll generate the link after saving
      return;
    }




    if (note && !note.shareId && !isPrivate) {
      const shareId = `note_${note.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newShareLink = `${window.location.origin}/shared/${shareId}`;
      setShareLink(newShareLink);

      // Update the note with share information
      onUpdate(note.id, {
        isShared: true,
        shareId,
        sharePermissions: 'view',
      });
    }
  };






  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportButtonRef.current && !exportButtonRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };

    if (isExportMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExportMenuOpen]);

  // Track changes to mark as unsaved
  useEffect(() => {
    if (note) {
      const hasChanges =
        title !== note.title ||
        content !== note.content ||
        contentType !== (note.contentType || 'plain') ||
        category !== note.category ||
        JSON.stringify(tags) !== JSON.stringify(note.tags) ||
        isPrivate !== (note.isPrivate || false) ||
        password !== (note.password || '') ||
        passwordHint !== (note.passwordHint || '');
      setHasUnsavedChanges(hasChanges);
    } else {
      setHasUnsavedChanges(title.trim() !== '' || content.trim() !== '');
    }
  }, [title, content, contentType, category, tags, isPrivate, password, passwordHint, note]);

  // const handleAutoSave = (data: any) => {
  //   if (!data.title.trim() && !data.content.trim()) return;

  //   const noteData = {
  //     title: data.title || 'Untitled',
  //     content: data.content,
  //     contentType: data.contentType,
  //     category: data.category,
  //     tags: data.tags,
  //     isPinned: note?.isPinned || false,
  //     isFavorite: note?.isFavorite || false,
  //     isShared: note?.isShared || false,
  //     shareId: note?.shareId,
  //     sharePermissions: note?.sharePermissions,
  //     sharedWith: note?.sharedWith || [],
  //     collaborators: note?.collaborators || [],
  //     version: (note?.version || 0) + 1,
  //     lastEditedBy: currentUser?.name || 'You',
  //     isPrivate: data.isPrivate,
  //     password: data.password,
  //     passwordHint: data.passwordHint,
  //   };

  //   if (note) {
  //     onUpdate(note.id, noteData);
  //   } else {
  //     const newNoteId = onSave(noteData);
  //     // Generate share link for new note if not private
  //     if (!data.isPrivate && newNoteId) {
  //       setTimeout(() => {
  //         const shareId = `note_${newNoteId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  //         const newShareLink = `${window.location.origin}/shared/${shareId}`;
  //         setShareLink(newShareLink);
  //         onUpdate(newNoteId, {
  //           isShared: true,
  //           shareId,
  //           sharePermissions: 'view',
  //         });
  //       }, 100);
  //     }
  //   }

  //   setLastSaved(new Date());
  //   setHasUnsavedChanges(false);
  // };

  const { forceSave } = useAutoSave({
    data: { title, content, contentType, category, tags, isPrivate, password, passwordHint },
    onSave: handleAutoSave,
    delay: 2000,
    enabled: autoSaveEnabled && isOpen,
  });

  const handleManualSave = async () => {
    if (!title.trim() && !content.trim()) return;


    const noteData = {
      title: title || 'Untitled',
      content,
      contentType,
      category,
      tags,
      isDeleted: note?.isDeleted || false,
      isPinned: note?.isPinned || false,
      isFavorite: note?.isFavorite || false,
      isShared: note?.isShared || false,
      shareId: note?.shareId,
      sharePermissions: note?.sharePermissions,
      sharedWith: note?.sharedWith || [],
      collaborators: note?.collaborators || [],
      version: (note?.version || 0) + 1,
      lastEditedBy: currentUser?.name || 'You',
      isPrivate,
      password,
      passwordHint,
    };

    try {
      let newNoteId;

      if (isUserLoggedIn()) {
        // For new notes (no existing note)
        if (!note) {
          newNoteId = await saveNoteToBackend(noteData, false);
        } else {
          // For existing notes
          newNoteId = await saveNoteToBackend(noteData, true);
        }
      } else {
        // Local storage handling
        const newNote = {
          ...noteData,
          id: note?.id || `local-${Date.now()}`, // New ID only if creating
          createdAt: note?.createdAt || new Date(),
          updatedAt: new Date(),
        };

        if (note) {
          onUpdate(newNote);
        } else {
          onSave(newNote);
        }
        newNoteId = newNote.id;
      }

      // Reset states and close
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      onClose();
      window.location.reload()
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to save note'
      });
    }
  };



  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleManualSave();
    }
  };

  const handlePrivacyChange = async (
    newIsPrivate: boolean,
    newPassword?: string,
    newPasswordHint?: string
  ) => {
    setIsPrivate(newIsPrivate);
    setPassword(newPassword || '');
    setPasswordHint(newPasswordHint || '');

    const noteId = note._id ?? note.id;
    console.log(newIsPrivate)
    const updatedFields = {
      isPrivate: newIsPrivate,
      isShared: !newIsPrivate,
      password: newIsPrivate ? newPassword || '' : '',
      passwordHint: newIsPrivate ? newPasswordHint || '' : '',
      shareId: newIsPrivate ? undefined : note.shareId,
      sharePermissions: newIsPrivate ? undefined : note.sharePermissions,
      updatedAt: new Date().toISOString(),
    };

    if (isUserLoggedIn()) {
      // 🔗 Logged-in user — update in backend
      try {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/users/notes/${noteId}`,
          updatedFields,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // 🔥 Update local state
        onUpdate(noteId, updatedFields);
      } catch (error) {
        console.error('Failed to update privacy', error);
      }
    } else {
      // 🔗 Guest user — update localStorage
      const updatedNotes = notes.map(n =>
        (n.id === noteId)
          ? { ...n, ...updatedFields }
          : n
      );

      setNotes(updatedNotes);
      localStorage.setItem('guestNotes', JSON.stringify(updatedNotes));

      // 🔥 Update local component state if needed
      onUpdate(noteId, updatedFields);
    }

    // 🔒 Handle share link cleanup if making private
    if (newIsPrivate) {
      setShareLink('');
    } else if (!newIsPrivate && (title.trim() || content.trim())) {
      // 🌐 Generate share link when making public
      generateShareLink();
    }
  };


  const copyShareLink = async () => {
    if (shareLink) {
      try {
        await navigator.clipboard.writeText(shareLink);
        // You could add a toast notification here
      } catch (error) {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = shareLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    }
  };

  const formatLastSaved = (date: unknown) => {
    // Check if date is falsy or invalid
    if (!date) return "Never saved";

    // Convert to Date object if it isn't one
    const parsedDate = date instanceof Date ? date : new Date(date as string);

    // Verify the date is valid
    if (isNaN(parsedDate.getTime())) return "Invalid date";

    // Now safely calculate time difference
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000);

    // Your formatting logic here...
    return `${diffInSeconds} seconds ago`; // or your preferred format
  };
  // Create a temporary note object for export and collaboration
  const getCurrentNoteForExport = (): Note => {
    console.log(note?._id)
    return {
      id: note?._id || note?.id,
      title: title || 'Untitled',
      content,
      contentType,
      category,
      tags,
      createdAt: note?.createdAt || new Date(),
      updatedAt: new Date(),
      isPinned: note?.isPinned || false,
      isFavorite: note?.isFavorite || false,
      isShared: note?.isShared || false,
      shareId: note?.shareId,
      sharePermissions: note?.sharePermissions,
      sharedWith: note?.sharedWith || [],
      collaborators: note?.collaborators || [
        // Add some mock collaborators for demo
        {
          id: 'collab_1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          permission: 'edit' as const,
          joinedAt: new Date(Date.now() - 86400000), // 1 day ago
          lastActive: new Date(Date.now() - 300000), // 5 minutes ago
        },
        {
          id: 'collab_2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          permission: 'view' as const,
          joinedAt: new Date(Date.now() - 172800000), // 2 days ago
          lastActive: new Date(Date.now() - 1800000), // 30 minutes ago
        }
      ],
      version: note?.version || 1,
      lastEditedBy: currentUser?.name || 'You',
      isPrivate,
      password,
      passwordHint,
    };
  };

  const navigate = useNavigate()
  const handleCollaborationToggle = () => {
    // If it's a new note, save it first before enabling collaboration
    if (!note && (title.trim() || content.trim())) {
      handleManualSave();
      // The collaboration panel will be available after the note is saved

    }
    setTimeout(() => {
      navigate('/my-collabs')
      window.location.reload()
    }, 100);
  };

  if (!isOpen) return null;
  console.log(isOpen)
  const isCollaborationsPage = window.location.pathname === '/collaborations';
  // Check if collaboration should be available
  const canCollaborate = !isPrivate && (note || (title.trim() || content.trim()));
  if (isOpen) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden transition-all duration-300 ${isCollaborationPanelOpen ? 'lg:mr-80' : ''
            }`}>
            {!isCollaborationsPage && (
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    {note ? 'Edit Note' : 'New Note'}
                  </h2>

                  {/* Privacy indicator */}
                  {isPrivate && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs">
                      <Shield className="w-3 h-3" />
                      <span className="hidden sm:inline">Private</span>
                    </div>
                  )}

                  {/* Share link indicator */}
                  {shareLink && !isPrivate && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                      <LinkIcon className="w-3 h-3" />
                      <span className="hidden sm:inline">Shareable</span>
                    </div>
                  )}

                  {/* Collaboration indicators */}
                  {note?.isShared && (
                    <div className="hidden sm:flex items-center space-x-2">
                      <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                        <Share2 className="w-3 h-3" />
                        <span>Shared</span>
                      </div>
                      {isUserLoggedIn() && note.collaborators && note.collaborators.length > 0 && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
                          <Users className="w-3 h-3" />
                          <span>{note.collaborators.length}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Auto-save status */}
                  <div className="hidden md:flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <input
                          type="checkbox"
                          checked={autoSaveEnabled}
                          onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Auto-save</span>
                      </label>
                    </div>

                    {autoSaveEnabled && (
                      <div className="flex items-center space-x-1 text-xs">
                        {hasUnsavedChanges ? (
                          <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                            <Clock className="w-3 h-3" />
                            <span>Saving...</span>
                          </div>
                        ) : lastSaved ? (
                          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                            <Check className="w-3 h-3" />
                            <span>Saved {formatLastSaved(lastSaved)}</span>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  {/* Privacy settings button */}
                  <button
                    onClick={() => setShowPrivacySettings(!showPrivacySettings)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${showPrivacySettings || isPrivate
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                      }`}
                    title="Privacy Settings"
                  >
                    <Shield className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>

                  {/* Collaboration button - now available for all notes that can be collaborated on */}
                  {canCollaborate && (
                    <button
                      onClick={() => handleCollaborationToggle()}
                      className={`p-2 rounded-lg transition-colors duration-200 ${isCollaborationPanelOpen
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                        }`}
                      title="Collaboration"
                    >
                      <Users className="w-4 sm:w-5 h-4 sm:h-5" />
                    </button>
                  )}

                  {/* Share button */}
                  
                    <button
                      onClick={() => setIsShareModalOpen(true)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                      title="Share note"
                    >
                      <Share2 className="w-4 sm:w-5 h-4 sm:h-5" />
                    </button>
                  

                  {/* Quick copy share link button */}
                  {/* {shareLink && !isPrivate && (
                <button
                  onClick={copyShareLink}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                  title="Copy share link"
                >
                  <LinkIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              )} */}

                  {/* Download button */}
                  <div className="relative" ref={exportButtonRef}>
                    <button
                      onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                      title="Download note"
                    >
                      <Download className="w-4 sm:w-5 h-4 sm:h-5" />
                    </button>
                    <ExportMenu
                      note={getCurrentNoteForExport()}
                      isOpen={isExportMenuOpen}
                      onClose={() => setIsExportMenuOpen(false)}
                    />
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <X className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>
                </div>
              </div>
            )}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-200px)] sm:max-h-[calc(90vh-200px)]">
              <input
                type="text"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full text-xl sm:text-2xl font-semibold bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                autoFocus
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <Folder className="w-4 h-4 text-gray-400" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2 flex-1 w-full sm:w-auto">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Add tags..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-indigo-400 hover:text-indigo-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Privacy Settings */}
              {showPrivacySettings && (
                <PrivacySettings
                  isPrivate={isPrivate}
                  password={password}
                  passwordHint={passwordHint}
                  onPrivacyChange={handlePrivacyChange}
                />
              )}

              {/* Share Link Display */}
              {shareLink && !isPrivate && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <LinkIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Share Link Generated
                      </span>
                    </div>
                    {/* <button
                    onClick={copyShareLink}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Copy Link
                  </button> */}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Anyone with this link can view your note
                  </p>
                </div>
              )}

              <RichTextEditor
                content={content}
                contentType={contentType}
                onChange={(newContent, newContentType) => {
                  setContent(newContent);
                  setContentType(newContentType);
                }}
                placeholder="Start writing your note..."
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-3 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Press Ctrl+Enter to save quickly
                </p>
                {!autoSaveEnabled && hasUnsavedChanges && (
                  <span className="text-sm text-amber-600 dark:text-amber-400">
                    • Unsaved changes
                  </span>
                )}
                {note?.version && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Version {note.version}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualSave}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {!isPrivate && (
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            note={getCurrentNoteForExport()}
            onUpdateNote={onUpdate}
          />
        )}

        {/* Collaboration Panel */}
        {canCollaborate && (
          <CollaborationPanel
            note={getCurrentNoteForExport()}
            isOpen={isCollaborationPanelOpen}
            onClose={() => setIsCollaborationPanelOpen(false)}
            currentUser={currentUser}
          />
        )}
      </>
    );
  }
};

export default NoteEditor;
