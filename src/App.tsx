import React, { useState, useMemo, useEffect } from 'react';
import { useNotes } from './hooks/useNotes';
import { useAuth } from './hooks/useAuth';
import { Note } from './types';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteCard from './components/NoteCard';
const NoteEditor = lazy(() => import('./components/NoteEditor'));
// import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import NoteBin from './components/NoteBin';
import Footer from './components/Footer';
import PasswordPrompt from './components/PasswordPrompt';
import AdminRoute from './components/AdminRoute';
import VerifyEmail from './components/VerifyEmail';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import SharedNote from './components/SharedNote';
import './index.css';


import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

// const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const Collaborations = React.lazy(() => import('./components/Collaborations'));
const SharedByMe = React.lazy(() => import('./components/MyCollaborations'));
import AdminLogin from './components/AdminLogin';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import './i18n';
import { useTranslation } from "react-i18next";


function App() {
   const { t } = useTranslation();
  const {

    isLoading,
    login,
    register,
    logout,
    resendVerificationEmail,
    verifyEmail,
    sendPasswordReset,
  } = useAuth();

  // Check if we should show admin dashboard
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  //Fetching User
  useEffect(() => {
    const getUser = async () => {
      const userData = await fetchUserFromToken();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    };
    getUser();
  }, []);

  //Recent Notes Handler
  const getRecentNotes = useCallback((notes: Note[]): Note[] => {
    const now = Date.now();
    return notes.filter(note => {
      const createdAt = new Date(note.createdAt).getTime();
      const diffInDays = (now - createdAt) / (1000 * 60 * 60 * 24);
      return diffInDays <= 7 && !note.isDeleted;
    });
  }, []);

  //Filtering Notes



  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash);
    };
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded.isVerified); // true or false
      setIsAuthenticated(decoded.isVerified)
    }


    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  // Managing States


  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isNoteBinOpen, setIsNoteBinOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState({
    isOpen: false,
    noteId: null as string | null,
    onSuccess: null as ((note: Note) => void) | null,
    onCancel: null as (() => void) | null,
  });
  const [passwordError, setPasswordError] = useState('');

  const filteredNotes = useMemo(() => {
    let filtered = notes.filter(note => !note.isDeleted);

    console.log(notes)
    // Filter by category
    if (selectedCategory === 'recent') {
      filtered = getRecentNotes(notes);
    } else if (selectedCategory === 'pinned') {
      filtered = filtered.filter(note => note.isPinned && !note.isDeleted);
    } else if (selectedCategory === 'favorites') {
      filtered = filtered.filter(note => note.isFavorite && !note.isDeleted);
    } else if (selectedCategory !== 'all') {
      filtered = filtered.filter(note => note.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(note => {
        // For private notes, only search in title and tags, not content
        if (note.isPrivate) {
          return note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      });
    }

    // Sort by pinned first, then by updated date (except for recent which is already sorted)
    if (selectedCategory !== 'recent') {
      return filtered.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    }

    return filtered;
  }, [notes, selectedCategory, searchQuery, getRecentNotes]);

  // Apply dark mode
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mode', 'dark')
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mode', 'light')
    }
  }, [isDark]);

console.log(import.meta.env.VITE_BASE_URL)


  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/announcement`);
        setAnnouncement(data.message);
      } catch {
        console.log('No announcement available');
      }
    };
    const timeout = setTimeout(() => {
    fetchAnnouncement();
  }, 2000); // delay by 2 seconds

  return () => clearTimeout(timeout);
  }, []);

  // Load notes based on auth status// In your App component, modify the loadNotes effect
  useEffect(() => {

    loadNotes();
  }, [isAuthenticated, user]); // Add user as dependency

  // Conditional Route Checks
  const isAdminLogin = currentRoute === '#admin' || window.location.pathname === '/admin/login';
  const isAdminDashboard = currentRoute === '#admin' || window.location.pathname === '/admin/dashboard';
  const isAdminPassword = currentRoute === '#admin' || window.location.pathname === '/admin/change-password';
  const isVerifyRoute = window.location.pathname === '/verify' && user?.isBanned !== true;
  const isSharedRoute = window.location.pathname.startsWith('/shared');
  const isCollaborationRoute = window.location.pathname === '/collaborations' && user?.isBanned !== true;
  const isMyCollabRoute = window.location.pathname === '/my-collabs' && user?.isBanned !== true;
  const isForgotRoute = window.location.pathname === '/forgot-password' && user?.isBanned !== true;
  const isResetRoute = window.location.pathname === '/reset-password' && user?.isBanned !== true;

  //Edit Handler

  const handleEditNote = (note: Note) => {

    console.log('Fnx Edit Called')
    console.log("Editing Note:", note)
    setEditingNote(note);
    setIsEditorOpen(true);
    console.log(editingNote)
    console.log(isEditorOpen)
    setIsSidebarOpen(false);



    // Close sidebar on mobile when opening editor
  };


  // Pass user ID to useNotes to ensure proper data isolation
  const {

    categories,
    addNote,
    updateNote,
    deleteNote,



    togglePin,
    toggleFavorite,
    addCategory,
    updateCategory,
    deleteCategory,

  } = useNotes(user?.id);






  //Load Handler
  const loadNotes = async () => {
    if (isAuthenticated) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users/notes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setNotes(response.data);
        console.log(response.data)
        console.log(notes)
      } catch (error) {
        console.error('Error loading notes:', error);
        // Fallback to empty array if fetch fails
        setNotes([]);
      }
    } else {
      // Load from localStorage for guest mode
      const savedNotes = localStorage.getItem('guestNotes');
      setNotes(savedNotes ? JSON.parse(savedNotes) : []);
      console.log(notes)
    }
  };

  // Save handler for parent component
  const handleSave = async (newNote: Note) => {
    if (isAuthenticated) {
      try {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(newNote)
        });

        if (!response.ok) throw new Error('Failed to create note');

        const data = await response.json();
        setNotes(prevNotes => [...prevNotes, data.data]);
      } catch (error) {
        console.error('Error creating note:', error);
      }
    } else {
      // For guests, update both state and localStorage
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      localStorage.setItem('guestNotes', JSON.stringify(updatedNotes));
    }
  };

  // Update Handler
  const handleUpdate = async (updatedNote: Note) => {
    if (isAuthenticated) {
      try {
        // Make API call to update note in backend
        const response = await fetch(`/api/notes/${updatedNote?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(updatedNote)
        });

        if (!response.ok) throw new Error('Failed to update note');

        const data = await response.json();

        // Update local state with the response from backend
        setNotes(prevNotes =>
          prevNotes.map(n => n?.id === data.data.id ? data.data : n)
        );
      } catch (error) {
        console.error('Error updating note:', error);
        // Optionally show error to user
      }
    } else {
      // For guests, update both state and localStorage
      const updatedNotes = notes.map(n =>
        n?.id === updatedNote.id ? updatedNote : n
      );
      setNotes(updatedNotes);
      localStorage.setItem('guestNotes', JSON.stringify(updatedNotes));
    }
  };









  //Pin Handler
  const handleTogglePin = async (noteId: string) => {
    const noteToUpdate = notes.find(note => (note._id === noteId) || (note.id === noteId));

    if (!noteToUpdate) return;
    console.log(noteToUpdate.isPinned)
    console.log(!noteToUpdate.isPinned)
    const updatedPin = !noteToUpdate.isPinned;

    if (isAuthenticated) {
      try {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/users/notes/${noteId}`,
          { isPinned: updatedPin },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (updatedPin)
           toast.success(t('notePinned'))
        else
          toast.success(t('noteUnpinned'))

        // ✅ Update local state directly (skip loadNotes for instant UI)
        setNotes(prev =>
          prev.map(note =>
            note._id === noteId
              ? { ...note, isPinned: updatedPin, updatedAt: new Date().toISOString() }
              : note
          )
        );

      } catch (error) {
        console.error('Failed to update pin status', error);
      }
    } else {
      // ✅ Guest logic
      if (updatedPin)
        toast.success(t('notePinned'))
      else
       toast.success(t('noteUnpinned'))
      const updatedNotes = notes.map(note =>
        note.id === noteId ? { ...note, isPinned: updatedPin, updatedAt: new Date().toISOString() } : note
      );
      setNotes(updatedNotes);
      localStorage.setItem('guestNotes', JSON.stringify(updatedNotes));
    }
  };

  //Favorite Handler
  const handleToggleFavorite = async (noteId: string) => {

    console.log('fnx called')

    const noteToUpdate = notes.find(note => (note._id === noteId) || (note.id === noteId));
    console.log(noteToUpdate)

    if (!noteToUpdate) return;


    console.log('Debug')

    const updatedFavorite = !noteToUpdate.isFavorite;

    if (isAuthenticated) {
      try {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/users/notes/${noteId}`,
          { isFavorite: updatedFavorite },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (updatedFavorite)
         toast.success(t('addedToFavorites'))
        else
         toast.success(t('removedFromFavorites'))
        // ✅ Update local state directly

        setNotes(prev =>
          prev.map(note =>
            note._id === noteId
              ? { ...note, isFavorite: updatedFavorite, updatedAt: new Date().toISOString() }
              : note
          )
        );
      } catch (error) {
        console.error('Failed to update favorite status', error);
      }
    } else {
      const updatedNotes = notes.map(note =>
        note.id === noteId ? { ...note, isFavorite: updatedFavorite, updatedAt: new Date().toISOString() } : note
      );
      setNotes(updatedNotes);
      localStorage.setItem('guestNotes', JSON.stringify(updatedNotes));
      if (updatedFavorite)
        toast.success(t('addedToFavorites'))
      else
       toast.success(t('removedFromFavorites'))
    }
  };















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

  //Logout
  const handleLogout = () => {
    // Close any open modals/editors before logout
    setIsEditorOpen(false);
    setIsNoteBinOpen(false);
    setIsSidebarOpen(false);
    setIsAuthModalOpen(false);
    setPasswordPrompt({ isOpen: false, noteId: null, onSuccess: null, onCancel: null });

    // Reset selected category to 'all'
    setSelectedCategory('all');
    setSearchQuery('');

    // Perform logout
    logout();
  };





  // Conditional Routing
  if (isAdminLogin) {
    return <AdminLogin />;
  }
if (isAdminDashboard) {
  return (
    <Suspense fallback={<Loading />}>
      <AdminDashboard/>
    </Suspense>
  );
}

     
  if (isAdminPassword)
    return <ChangePassword />
  if (isVerifyRoute) {
    return <VerifyEmail />;
  }
  if (isMyCollabRoute) {
     return (
        <Suspense fallback={<Loading />}>
     <SharedByMe />;
        </Suspense>
           )
  }

  if (isResetRoute) {
    return <ResetPassword/>
  }
  if (isForgotRoute) {
    return <ForgotPassword/>
  }

  if (isSharedRoute) {
    return <SharedNote />
  }
  // if (isCollaborationRoute) {
  //   return <Collaborations onEditNote={handleEditNote} />
  // }
  const deletedNotes = notes.filter(note => note.isDeleted);

  { console.log('ban status: ', user?.isBanned) }
  if (user?.isBanned) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-500">
        {/* Navbar */}
        <header className="flex items-center bg-white/60 dark:bg-gray-900/60 backdrop-blur border-b border-gray-200/20 dark:border-gray-800/30 sticky top-0 z-30 px-5 py-3 shadow-sm">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer transition-transform hover:scale-105"
          >
            <img
              src="/Orange and Purple Modern Gradient Arts and Crafts Service Logo (2).png"
              alt="Notepadle"
              className="w-10 h-10 object-contain rounded-md shadow"
            />
            <h1
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
              style={{ fontFamily: `'Playfair Display', serif` }}
            >
              Notepadle
            </h1>
          </div>
        </header>

        {/* Banned Content */}
        <main className="flex-1 flex items-center justify-center px-4 text-center animate-fadeIn">
          <div className="bg-red-100 dark:bg-red-900/30 p-8 sm:p-10 rounded-xl border border-red-300 dark:border-red-700 max-w-md w-full shadow-md transition-all duration-300">

            {/* Icon */}
            <div className="mb-5">
              <svg
                className="w-16 h-16 mx-auto text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 4h.01M3.055 11a9 9 0 1 1 17.89 0 9 9 0 0 1-17.89 0z"
                />
              </svg>
            </div>

            {/* Headline */}
            <h1 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-3">
              You are banned
            </h1>

            {/* Message */}
            <p className="text-gray-800 dark:text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
              Your account has been suspended due to violations of our terms of service.
              Please contact support if you believe this is a mistake.
            </p>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 active:scale-95 transition duration-200"
            >
              Logout
            </button>
          </div>
        </main>
      </div>

    );
  }







  const pinnedCount = notes.filter(note => note.isPinned && !note.isDeleted).length;
  const favoriteCount = notes.filter(note => note.isFavorite && !note.isDeleted).length;
  const recentCount = Math.min(10, notes.filter(note => !note.isDeleted).length);
  const deletedCount = deletedNotes.length;


  // Adding new note
  const handleNewNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
    setIsSidebarOpen(false); // Close sidebar on mobile when opening editor
  };


  // Handling Password Prompt
  const handlePasswordPrompt = (note: Note) => {
    setPasswordPrompt({
      isOpen: true,
      noteId: note.id,
      onSuccess: (unlockedNote: Note) => {
        setPasswordPrompt({ isOpen: false, noteId: null, onSuccess: null, onCancel: null });
        setPasswordError('');
        handleEditNote(unlockedNote);
      },
      onCancel: () => {
        setPasswordPrompt({ isOpen: false, noteId: null, onSuccess: null, onCancel: null });
        setPasswordError('');
      },
    });
    setPasswordError('');
  };


  //Submitting Password
  const handlePasswordSubmit = (password: string) => {
    const note = notes.find(n => n.id === passwordPrompt.noteId);
    if (!note) return;
    console.log(note)

    if (note.password === password) {
      passwordPrompt.onSuccess?.(note);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };



  // Handlers

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    return addNote(noteData);
  };

  const handleDeleteNote = async (id: string) => {

    console.log('Entered Delete Fnx')
    const confirmDelete = window.confirm('Are you sure you want to move this note to the bin?');

    if (!confirmDelete) return;
    console.log('Id: ', id)
    console.log('Notes: ', notes)
    const noteToUpdate = notes.find(note => (note._id || note.id) === id);

    if (!noteToUpdate) return;
    console.log('note available to update')
    const updatedNote = {
      ...noteToUpdate,
      isDeleted: true,
      updatedAt: new Date().toISOString(),
    };

    if (isAuthenticated) {
      // 🔗 For logged-in users — send request to backend
      try {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/api/users/notes/${id}`,
          { isDeleted: true },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // ⬇️ Update local state
        setNotes(prev => prev.filter(n => n._id !== id));
       toast.success(t('noteMovedToBin'))
        window.location.reload()

      } catch (error) {
        console.error('Failed to move note to bin', error);
      }
    } else {
      // 🔗 For guest users — update localStorage
      const updatedNotes = notes.map(n => n.id === id ? updatedNote : n);
      setNotes(updatedNotes);
      console.log('in guest part')

      console.log('Updated NOtes', updatedNotes)
      localStorage.setItem('guestNotes', JSON.stringify(updatedNotes));
    toast.success(t('noteMovedToBin'))
    }
  };


  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };


  const handleOpenAuthModal = (x) => {
    setIsAuthModalOpen(true);
     setIsLogin(x)
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setCurrentRoute('#admin');
  };

  const getCategoryDisplayName = () => {
    if (selectedCategory === 'all') return t('all_notes');
    if (selectedCategory === 'recent') return t('recents');
    if (selectedCategory === 'pinned') return t('pinned');
    if (selectedCategory === 'favorites') return t('favorites');

    const category = categories.find(cat => cat.id === selectedCategory);
    return category?.name || 'Unknown Category';
  };



  //Loading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <img
            src="/Orange and Purple Modern Gradient Arts and Crafts Service Logo (2).png"
            alt="Notepadle"
            className="w-16 h-16 object-contain mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const currentNote = passwordPrompt.noteId ? notes.find(n => n.id === passwordPrompt.noteId) : null;



  //Bin functions

  // Restore note handler
  const restoreNote = async (noteId: string) => {
    console.log(noteId)
    const noteToRestore = notes.find(note => (note._id || note.id) === noteId);
    if (!noteToRestore) return;

    const updatedNote = {
      ...noteToRestore,
      isDeleted: false,
      updatedAt: new Date().toISOString(),
    };

    if (isAuthenticated) {
      try {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/api/users/notes/${noteId}`,
          { isDeleted: false },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setNotes(prev => prev.map(n => n._id === noteId ? updatedNote : n));
         toast.success(t('noteRestoredSuccessfully'))
      } catch (error) {
        console.error('Failed to restore note', error);
      }
    } else {
      const updatedNotes = notes.map(n => n.id === noteId ? updatedNote : n);
      setNotes(updatedNotes);
      console.log(updatedNotes)
      localStorage.setItem('guestNotes', JSON.stringify(updatedNotes));
       toast.success(t('noteRestoredSuccessfully'))
    }
  };



  // Delete note from bin handler

  const permanentlyDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this note?')) return;

    if (isAuthenticated) {
      try {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/users/notes/${noteId}/permanent`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setNotes(prev => prev.filter(n => n._id !== noteId));
      } catch (error) {
        console.error('Failed to permanently delete note', error);
      }
    } else {
      const updatedNotes = notes.filter(n => n.id !== noteId);
      setNotes(updatedNotes);
      localStorage.setItem('guestNotes', JSON.stringify(updatedNotes));
    }
  };




  //Empty bin handler
  const emptyNoteBin = async () => {
    if (!window.confirm('Are you sure you want to permanently delete all notes in the bin?')) return;

    if (isAuthenticated) {
      try {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/users/notes/bin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Remove deleted notes from local state
        setNotes(prev => prev.filter(n => !n.isDeleted));
      } catch (error) {
        console.error('Failed to empty bin', error);
      }
    } else {
      // For guest users — delete from localStorage
      const updatedNotes = notes.filter(n => !n.isDeleted);
      setNotes(updatedNotes);
      localStorage.setItem('guestNotes', JSON.stringify(updatedNotes));
    }
  };

  // Get Remaining Days for restoring notes

  const getDaysUntilDeletion = (note: Note) => {
    const deletedAt = new Date(note.updatedAt);
    const now = new Date();
    const diffInMs = now.getTime() - deletedAt.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const daysUntilPermanentDelete = 30 - diffInDays; // Assuming 30 days retention

    return daysUntilPermanentDelete > 0 ? daysUntilPermanentDelete : 0;
  };









  return (
    <>
      <Toaster />
      <div className="min-h-[127vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900 transition-colors duration-300 flex flex-col">

        {/* Top alert if there's an announcement */}
        {announcement && announcement.length>2 && (
          <div className="bg-amber-50 border border-amber-300 text-amber-800 p-4 rounded-md mb-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-amber-500 mt-0.5">
                {/* You can use an icon component instead of emoji if using something like Heroicons */}
                <span role="img" aria-label="Announcement">📣</span>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Announcement</p>
                <p className="text-sm leading-5">{announcement}</p>
              </div>
            </div>
          </div>
        )}

        {isCollaborationRoute ? (
          <Collaborations
            onEditNote={(note) => {
              setEditingNote(note);
              setIsEditorOpen(true);
            }}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDeleteNote}
            onTogglePin={handleTogglePin}

          />
        ) : (<>

          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDark={isDark}
            onThemeToggle={() => setIsDark(!isDark)}
            onNewNote={handleNewNote}
            user={user}
            isAuthenticated={isAuthenticated}
            onLogin={login}
            isLogin={isLogin}
            onRegister={register}
            onLogout={handleLogout}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            onResendVerification={resendVerificationEmail}
            onVerifyEmail={verifyEmail}
            onResetPassword={sendPasswordReset}
            isAuthModalOpen={isAuthModalOpen}
            onOpenAuthModal={handleOpenAuthModal}
            onCloseAuthModal={handleCloseAuthModal}
          />

          <div className="flex flex-1 relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <div className={`
          fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 lg:z-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64 h-full lg:h-auto
        `}>
              <Sidebar
                notes={notes}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                pinnedCount={pinnedCount}
                favoriteCount={favoriteCount}
                recentCount={recentCount}
                deletedCount={deletedCount}
                onAddCategory={addCategory}
                onUpdateCategory={updateCategory}
                onDeleteCategory={deleteCategory}
                onOpenNoteBin={() => {
                  setIsNoteBinOpen(true);
                  setIsSidebarOpen(false);
                }}
              />
            </div>

            <main className="flex-1 overflow-auto flex flex-col min-w-0">
              <div className="flex-1 p-4 sm:p-6">
                {!isAuthenticated && (
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div>
                        <h3 className="font-medium text-blue-900 dark:text-blue-100">
                         {t('guest_usage')}
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                         {t("local_storage_info")}
                        </p>
                      </div>
                      <button
                        onClick={()=>handleOpenAuthModal(false)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                      >
                      {t('sign_up')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Admin Access for authenticated admin users */}
                {isAuthenticated && user?.email === 'admin@notepadle.com' && (
                  <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div>
                        <h3 className="font-medium text-purple-900 dark:text-purple-100">
                          Super Admin Access
                        </h3>
                        <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                          You have administrative privileges. Access the admin dashboard to manage users and content.
                        </p>
                      </div>
                      <button
                        onClick={handleOpenAdmin}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                      >
                        Admin Dashboard
                      </button>
                    </div>
                  </div>
                )}

                {filteredNotes.length === 0 ? (
                  <EmptyState
                    onNewNote={handleNewNote}
                    message={
                      searchQuery
                        ? `No notes found for "${searchQuery}"`
                        : selectedCategory === 'all'
                          ? "No notes found. Create your first note to get started!"
                          : `No notes found in ${getCategoryDisplayName().toLowerCase()}.`
                    }
                  />
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {getCategoryDisplayName()}
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                         {filteredNotes.length} {filteredNotes.length === 1 ? t('notes') : t('notes')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredNotes.map((note) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          onEdit={handleEditNote}
                          onDelete={handleDeleteNote}
                          onTogglePin={handleTogglePin}
                          onToggleFavorite={handleToggleFavorite}
                          onPasswordPrompt={handlePasswordPrompt}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className='z-0'>
                <Footer />
              </div>
            </main>
          </div>
        </>
        )}

        {isEditorOpen && (
         <Suspense fallback={<div>Loading Editor...</div>}>
          <NoteEditor
            note={editingNote}
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSave}
            onUpdate={handleUpdate}
            categories={categories}
            currentUser={user}
          />
   </Suspense>
        )}
        <NoteBin
          isOpen={isNoteBinOpen}
          onClose={() => setIsNoteBinOpen(false)}
          deletedNotes={deletedNotes}
          onRestore={restoreNote}
          onPermanentDelete={permanentlyDeleteNote}
          onEmptyBin={emptyNoteBin}
          getDaysUntilDeletion={getDaysUntilDeletion}
        />

        <PasswordPrompt
          isOpen={passwordPrompt.isOpen}
          onClose={passwordPrompt.onCancel || (() => { })}
          onSubmit={handlePasswordSubmit}
          noteTitle={currentNote?.title || 'Untitled'}
          passwordHint={currentNote?.passwordHint}
          error={passwordError}
        />
      </div>
    </>
  );
}

export default App;
