



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
    FileText,
    Loader,
    AlertTriangle,
    Users,
    Search,
} from 'lucide-react';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Collaborator = {
    userId: string;
    name: string;
    email: string;
    permission: 'view' | 'edit';
};

type Note = {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    category: string;
    createdAt: string;
    updatedAt: string;
    collaborators: Collaborator[];
};

const SharedByMe = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [mode, setMode] = useState<'dark' | 'light'>('light');

    const navigate = useNavigate();

    useEffect(() => {
        const storedMode = localStorage.getItem('mode') as 'dark' | 'light';
        if (storedMode) setMode(storedMode);

        const fetchSharedNotes = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/api/users/shared-by-me`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                setNotes(res.data);
            } catch (err: any) {
                setError(
                    err.response?.data?.error || 'Failed to fetch shared notes'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSharedNotes();
    }, []);

    const allTags = Array.from(new Set(notes.flatMap((note) => note.tags)));
    const allCategories = Array.from(
        new Set(notes.map((note) => note.category))
    );

    const filteredNotes = notes.filter((note) => {
        const matchesSearch =
            note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content.toLowerCase().includes(search.toLowerCase());
        const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;
        const matchesCategory = selectedCategory
            ? note.category === selectedCategory
            : true;

        return matchesSearch && matchesTag && matchesCategory;
    });

    const handleNavigate = (path: string) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(path);
        // window.location.reload();
    };

    const isDark = mode === 'dark';

    // const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-50';
    const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
    // const textPrimary = isDark ? 'text-gray-100' : 'text-gray-800';
    // const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
    // const borderClass = isDark ? 'border-gray-700' : 'border-gray-200';

    const bgColor = mode === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900'
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50';

    const navBg = mode === 'dark' ? 'bg-gray-800' : 'bg-white/80';

    const inputBg = mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white';

    const borderColor = mode === 'dark' ? 'border-gray-700' : 'border-gray-300';

    const textColor = mode === 'dark' ? 'text-white' : 'text-gray-700';

    const subTextColor = mode === 'dark' ? 'text-gray-400' : 'text-gray-500';

    const iconColor = mode === 'dark' ? 'text-gray-400' : 'text-gray-600';

    if (loading)
        return (
            <div className={`flex justify-center items-center h-[70vh] ${bgColor}`}>
                <Loader className="animate-spin text-blue-500" size={32} />
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
            <div className={`flex justify-center items-center h-[70vh] ${bgColor}`}>
                <div className="flex flex-col items-center text-red-500">
                    <AlertTriangle size={32} />
                    <p className="mt-2">{error}</p>
                </div>
            </div>
        );

   if (notes.length === 0)
    return (
        <>
            <nav className={`${navBg} backdrop-blur-md shadow-sm sticky top-0 z-50`}>
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
                    {/* Logo & Name */}
                    <div
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 cursor-pointer"
                    >
                        <img
                            src="/Orange and Purple Modern Gradient Arts and Crafts Service Logo (2).png"
                            alt="Notepadle"
                            className="w-8 h-8 object-contain"
                        />
                        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Notepadle
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleNavigate('/collaborations')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Notes Shared With Me</span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`flex min-h-screen flex-col items-center justify-center h-[70vh] ${subTextColor} ${bgColor}`}>
                <FileText size={36} />
                <p className="mt-3">No notes shared by you.</p>
            </div>
        </>
    );


    return (
        <div className={`min-h-screen transition-colors duration-300  ${bgColor}`}>
            {/* Navbar */}
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
                                handleNavigate('/collaborations');

                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Notes Shared With Me</span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h2 className={`text-3xl font-semibold ${textColor}`}>
                        Notes Shared By You
                    </h2>

                    <div className="flex gap-3 flex-col md:flex-row">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search notes..."
                                className={`pl-10 pr-4 py-2 rounded-lg border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:outline-none ${cardBg} ${textColor} shadow-sm`}
                            />
                        </div>

                        {/* Tag Filter */}
                        {allTags.length > 0 && (
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className={`px-4 py-2 rounded-lg border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:outline-none ${cardBg} ${textColor} shadow-sm`}
                            >
                                <option value="">All Tags</option>
                                {allTags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Category Filter */}
                        {allCategories.length > 0 && (
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={`px-4 py-2 rounded-lg border ${borderColor} focus:ring-2 focus:ring-blue-500 focus:outline-none ${cardBg} ${textColor} shadow-sm`}
                            >
                                <option value="">All Types</option>
                                {allCategories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                        <div
                            key={note._id}
                            className={` shadow-sm border ${borderColor} rounded-2xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all`}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h3 className={`text-lg font-semibold ${textColor}`}>
                                    {note.title}
                                </h3>
                                <Users className="text-blue-500" size={20} />
                            </div>

                            {/* <p className={`text-sm ${subTextColor} line-clamp-3 mb-4`}>
                                {note.content}
                            </p> */}

                            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {note.content}
                                </ReactMarkdown>
                            </div>


                            {note.tags.length > 0 && (
                                <div className="mb-4 flex gap-2 flex-wrap">
                                    {note.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="mb-2">
                                <span className="text-xs font-medium text-gray-500">
                                    Type: {note.category}
                                </span>
                            </div>

                            <div>
                                <h4 className={`text-sm font-medium mb-2 ${textColor}`}>
                                    Collaborators:
                                </h4>
                                {note.collaborators.length > 0 ? (
                                    <ul className="space-y-1">
                                        {note.collaborators.map((col) => (
                                            <li
                                                key={col.userId}
                                                className={`flex justify-between items-center text-xs ${isDark ? 'bg-gray-700' : 'bg-gray-50'} px-3 py-1.5 rounded-lg`}
                                            >
                                                <div>
                                                    <span className="font-semibold">{col.name}</span>{' '}
                                                    <span className="text-gray-500">
                                                        ({col.email})
                                                    </span>
                                                </div>
                                                <span
                                                    className={`px-2 py-0.5 rounded ${col.permission === 'edit'
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-yellow-100 text-yellow-600'
                                                        }`}
                                                >
                                                    {col.permission === 'edit'
                                                        ? 'Can Edit'
                                                        : 'View Only'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-500">
                                        No collaborators.
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SharedByMe;
