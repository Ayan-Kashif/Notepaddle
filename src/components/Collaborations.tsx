

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader, AlertTriangle, StickyNote, Search, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CollaborationNoteCard from './CollaborationNoteCard';
import { NoteType } from '../types';

type CollaborationsProps = {
    onEditNote: (note: NoteType) => void;
    onDelete: (id: string) => void;
    onTogglePin: (id: string) => Promise<void>;
    onToggleFavorite: (id: string) => Promise<void>;
};

const Collaborations: React.FC<CollaborationsProps> = ({ onEditNote, onDelete, onToggleFavorite, onTogglePin }) => {
    const [notes, setNotes] = useState<NoteType[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<NoteType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [user, setUser] = useState<any>(null);
    const [mode, setMode] = useState<'light' | 'dark'>('light'); // ✅ Mode state

    const navigate = useNavigate();

    useEffect(() => {
        const savedMode = localStorage.getItem('mode');
        if (savedMode === 'dark' || savedMode === 'light') {
            setMode(savedMode);
        }
    }, []);

    useEffect(() => {
        const getUser = async () => {
            const userData = await fetchUserFromToken();
            if (userData) setUser(userData);
        };
        getUser();
    }, []);

    useEffect(() => {
        const fetchCollaborations = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/api/users/collaborations`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                setNotes(res.data);
                setFilteredNotes(res.data);
            } catch (err: any) {
                setError(
                    err.response?.data?.error ||
                    err.message ||
                    'Failed to fetch collaboration notes.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCollaborations();
    }, []);

    const getPermission = (note: NoteType) => {
        const collaborator = note.collaborators.find(
            (c: any) => c.userId === user?._id
        );
        return collaborator?.permission || 'view';
    };

    const handleEdit = (note: NoteType) => navigate(`/edit/${note._id}`);

    const handlePasswordPrompt = (note: NoteType) => {
        console.log('Password prompt for note:', note);
    };

    const fetchUserFromToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users/get-user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    };

    const handleNavigate = (path: string) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(path);
    };

    const handleSearchAndFilter = () => {
        let temp = [...notes];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            temp = temp.filter(
                (note) =>
                    note.title.toLowerCase().includes(query) ||
                    note.content.toLowerCase().includes(query)
            );
        }

        if (selectedTag) {
            temp = temp.filter((note) => note.tags.includes(selectedTag));
        }

        if (selectedCategory) {
            temp = temp.filter((note) => note.category === selectedCategory);
        }

        setFilteredNotes(temp);
    };

    useEffect(() => {
        handleSearchAndFilter();
    }, [searchQuery, selectedTag, selectedCategory, notes]);

    const allTags = Array.from(new Set(notes.flatMap((note) => note.tags || [])));
    const allCategories = ['personal', 'work', 'ideas'];

    const bgColor = mode === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900'
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50';

    const navBg = mode === 'dark' ? 'bg-gray-800/80' : 'bg-white/80';

    const inputBg = mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white';

    const borderColor = mode === 'dark' ? 'border-gray-700' : 'border-gray-300';

    const textColor = mode === 'dark' ? 'text-white' : 'text-gray-700';

    const subTextColor = mode === 'dark' ? 'text-gray-400' : 'text-gray-500';

    const iconColor = mode === 'dark' ? 'text-gray-400' : 'text-gray-600';

    if (loading)
        return (
            <div className={`flex justify-center items-center h-[80vh] ${bgColor}`}>
                <Loader className="animate-spin text-blue-500" size={36} />
            </div>
        );
    if (!localStorage.getItem('token'))
        return (
            <div className={`flex justify-center items-center h-[70vh] ${bgColor}`}>
                <div className="flex flex-col items-center text-red-500">
                    <AlertTriangle size={32} />
                    <p className="mt-2">Please login to access</p>
                </div>
            </div>)


    if (error)
        return (
            <div className={`flex flex-col justify-center items-center h-[80vh] ${bgColor}`}>
                <AlertTriangle size={40} className="text-red-500 mb-4" />
                <p className={`text-red-600 text-lg font-medium mb-2`}>Something went wrong</p>
                <p className={`text-sm ${subTextColor}`}>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                    Retry
                </button>
            </div>
        );



    if (filteredNotes.length === 0)
        return (
            <>
                <nav className={`${navBg} backdrop-blur-md shadow-sm sticky top-0 z-50`}>
                    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
                        <div
                            onClick={() => handleNavigate('/')}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            {/* Logo & Name */}
                            <div
                                onClick={() => navigate('/')}
                                className="flex items-center gap-3 cursor-pointer"
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
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    handleNavigate('/my-collabs');

                                }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Notes Shared By Me</span>
                            </button>
                        </div>
                    </div>
                </nav>
                <div className={`flex flex-col items-center justify-center h-[80vh] ${bgColor}`}>
                    <StickyNote size={48} className="text-blue-400 mb-4" />
                    <p className={`text-lg ${textColor} mb-2`}>No Collaboration Notes Found</p>
                    <p className={`text-sm ${subTextColor}`}>
                        Notes that others share with you will appear here.
                    </p>
                </div>
            </>
        );

    return (
        <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
            <nav className={`${navBg} backdrop-blur-md shadow-sm sticky top-0 z-50`}>
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
                    <div
                        onClick={() => handleNavigate('/')}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        {/* Logo & Name */}
                        <div
                            onClick={() => navigate('/')}
                            className="flex items-center gap-3 cursor-pointer"
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
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleNavigate('/my-collabs')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Notes Shared By Me</span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex gap-2 flex-1">
                        <div className="relative flex-1">
                            <Search className={`absolute left-3 top-2.5 ${iconColor} w-4 h-4`} />
                            <input
                                type="text"
                                placeholder="Search by title or content..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 ${borderColor} ${inputBg} border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                        </div>
                        <div>
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className={`px-3 py-2 ${borderColor} ${inputBg} border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            >
                                <option value="">All Tags</option>
                                {allTags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={`px-3 py-2 ${borderColor} ${inputBg} border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            >
                                <option value="">All Types</option>
                                {allCategories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.1 },
                        },
                    }}
                >
                    {filteredNotes.map((note) => {
                        const permission = getPermission(note);
                        const canEdit = permission === 'edit';

                        return (
                            <motion.div
                                key={note._id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                            >
                                <CollaborationNoteCard
                                    note={note}
                                    permission={permission}
                                    onEdit={canEdit ? () => onEditNote(note) : () => { }}
                                    onPasswordPrompt={handlePasswordPrompt}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};

export default Collaborations;
