







import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { motion } from 'framer-motion';
import {
    Tag, Users, Pin, Star, Lock, Share2, FileText, Calendar,ChevronDown,ChevronUp
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

type Note = {
    id: string;
    title: string;
    content: string;
    contentType: string;
    category: string;
    tags: string[];
    isPinned: boolean;
    isFavorite: boolean;
    isShared: boolean;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
};

export  function HtmlRenderer({ htmlContent }) {
    return (
        <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}

const SharedNote = () => {
    const shareId = window.location.pathname.slice(8);
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

   useEffect(() => {
  const pathParts = window.location.pathname.split('/');
  const shareId = pathParts[pathParts.length - 1];


        if (!shareId || shareId.length < 6) {
            setError('🔗 Invalid share link.');
            setLoading(false);
            return;
        }

        console.log("Short ID:", shareId);


  const fetchNote = async () => {
    if (shareId.startsWith('local-')) {
      const localNote = localStorage.getItem(shareId);
      if (localNote) {
        try {
          const parsed = JSON.parse(localNote);
          setNote(parsed);
        } catch {
          setError('⚠️ Failed to parse local note.');
        }
      } else {
        setError('❌ Local note not found.');
      }
      setLoading(false);
      return;
    }

    // Fetch from backend for registered user note
    try {
      const res = await axios.get(`${BASE_URL}/api/users/shared/${shareId}`);
      setNote(res.data);
    } catch {
      setError('❌ Note not found or no longer shared.');
    } finally {
      setLoading(false);
    }
  };

  fetchNote();
}, []);


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
            {/* ✅ Navbar */}
            <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center">

                <div className="flex items-center space-x-3">
                    <img
                        src="/Orange and Purple Modern Gradient Arts and Crafts Service Logo (2).png"
                        alt="Notepadle"
                        className="w-8 h-8 object-contain"
                    />
                    <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Notepadle
                    </h1>
                </div>
            </nav>

            {/* ✅ Content */}
            <div className="flex-grow flex items-center justify-center px-4">
                {loading ? (
                    <div className="text-center text-gray-600 text-lg animate-pulse">
                        ⏳ Loading note...
                    </div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white shadow-xl rounded-2xl p-8 text-center"
                    >
                        <div className="text-5xl mb-4">😕</div>
                        <div className="text-xl text-red-500 font-semibold">{error}</div>
                        <div className="text-gray-500 mt-2">Please check the link or contact the owner.</div>
                    </motion.div>
                ) : !note ? (
                    <div className="text-center text-gray-600">Note not found.</div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <h1 className="text-3xl font-bold text-gray-800">{note.title}</h1>
                            <div className="flex space-x-3">
                                {note.isPinned && <Pin size={20} className="text-yellow-500" title="Pinned" />}
                                {note.isFavorite && <Star size={20} className="text-yellow-500" title="Favorite" />}
                                {note.isPrivate ? (
                                    <Lock size={20} className="text-gray-500" title="Private" />
                                ) : (
                                    note.isShared && <Share2 size={20} className="text-green-500" title="Shared" />
                                )}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <FileText size={16} />
                                <span className="font-medium">Content Type:</span> {note.contentType}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={16} />
                                <span className="font-medium">Category:</span> {note.category}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span className="font-medium">Created:</span>{' '}
                                {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span className="font-medium">Updated:</span>{' '}
                                {new Date(note.updatedAt).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Tags */}
                        {note.tags.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2 text-gray-700">
                                    <Tag size={18} />
                                    <span className="font-medium">Tags:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {note.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Content */}
                       <div className={`prose max-w-none text-gray-800 transition-all duration-300`}>
  {note.contentType === 'plain' ? (
    <>
      <div
        className={`${
          isExpanded ? '' : 'line-clamp-5'
        } overflow-hidden`}
      >
        <HtmlRenderer htmlContent={note.content} />
      </div>

      {/* Show more / less toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-blue-600 hover:underline text-sm flex items-center gap-1"
      >
        {isExpanded ? (
          <>
            Show less <ChevronUp size={16} />
          </>
        ) : (
          <>
            Show more <ChevronDown size={16} />
          </>
        )}
      </button>
    </>
  ) : (
    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
      <HtmlRenderer htmlContent={note.content} />
    </div>
  )}
</div>

                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SharedNote;
