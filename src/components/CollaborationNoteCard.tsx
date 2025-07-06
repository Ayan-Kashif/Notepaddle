import React, { useState, useRef, useEffect } from 'react';
import { Note, CollaboratorPermission } from '../types';
import { Edit3, Download, Lock, Shield } from 'lucide-react';
import ExportMenu from './ExportMenu';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CollaborationNoteCardProps {
    note: Note;
    permission: CollaboratorPermission; // 'edit' | 'view'
    onEdit: (note: Note) => void;
    onPasswordPrompt?: (note: Note) => void;
}
export  function HtmlRenderer({ htmlContent }) {
    return (
        <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}

const CollaborationNoteCard: React.FC<CollaborationNoteCardProps> = ({
    note,
    permission,
    onEdit,
    onPasswordPrompt,
}) => {
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const exportButtonRef = useRef<HTMLDivElement>(null);

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

    const formatDate = (dateInput: Date | string | undefined): string => {
        if (!dateInput) return 'No date';
        try {
            const date = new Date(dateInput);
            if (isNaN(date.getTime())) return 'Invalid date';
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return 'Invalid date';
        }
    };

    const getPreview = (content: string) => {
        if (note.isPrivate) {
            return '🔒 This note is password protected. Click to unlock and view content.';
        }
        return content?.length > 120 ? content.substring(0, 120) + '...' : content;
    };

    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;
        if (note.isPrivate && onPasswordPrompt) {
            onPasswordPrompt(note);
        } else {
            onEdit(note);
        }
    };

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    return (
        <div
            className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200/20 dark:border-gray-700/20 hover:border-indigo-200 dark:hover:border-indigo-800 cursor-pointer ${note.isPrivate ? 'ring-1 ring-amber-200 dark:ring-amber-800' : ''
                }`}
            onClick={handleCardClick}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg line-clamp-1">
                            {note.title || 'Untitled'}
                        </h3>
                        {note.isPrivate && (
                            <div className="flex items-center space-x-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs flex-shrink-0">
                                <Lock className="w-3 h-3" />
                                <span className="hidden sm:inline">Private</span>
                            </div>
                        )}
                        <div
                            className={`flex items-center space-x-1 px-2 py-0.5 ${permission === 'edit'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                } rounded-full text-xs flex-shrink-0`}
                        >
                            <Shield className="w-3 h-3" />
                            <span className="hidden sm:inline">
                                {permission === 'edit' ? 'Edit Access' : 'View Only'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDate(note?.updatedAt)}</span>
                        {note?.tags?.length > 0 && (
                            <>
                                <span>•</span>
                                <div className="flex space-x-1 overflow-hidden">
                                    {note.tags.slice(0, 1).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs truncate max-w-20"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {note.tags.length > 1 && (
                                        <span className="text-gray-400">+{note.tags.length - 1}</span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    <div className="relative" ref={exportButtonRef}>
                        <button
                            onClick={(e) => handleActionClick(e, () => setIsExportMenuOpen(!isExportMenuOpen))}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                            title="Export note"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <ExportMenu
                            note={note}
                            isOpen={isExportMenuOpen}
                            onClose={() => setIsExportMenuOpen(false)}
                        />
                    </div>

                    <button
                        onClick={(e) =>
                            handleActionClick(e, () => {
                                if (note.isPrivate && onPasswordPrompt) {
                                    onPasswordPrompt(note);
                                } else {
                                    onEdit(note);
                                }
                            })
                        }
                        disabled={permission !== 'edit'}
                        className={`p-1.5 rounded-lg transition-colors duration-200 ${permission === 'edit'
                                ? 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                        title={permission === 'edit' ? 'Edit note' : 'View Only'}
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* <p
        className={`text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3 ${
          note.isPrivate ? 'italic' : ''
        }`}
      >
        {getPreview(note.content)}
      </p> */}
           <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                                                              <HtmlRenderer htmlContent={note.content} />
                                                          </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <span
                        className="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
                        style={{
                            backgroundColor: `${note.category === 'personal'
                                    ? '#6366F1'
                                    : note.category === 'work'
                                        ? '#8B5CF6'
                                        : note.category === 'ideas'
                                            ? '#10B981'
                                            : '#F59E0B'
                                }20`,
                            color:
                                note.category === 'personal'
                                    ? '#6366F1'
                                    : note.category === 'work'
                                        ? '#8B5CF6'
                                        : note.category === 'ideas'
                                            ? '#10B981'
                                            : '#F59E0B',
                        }}
                    >
                        {note.category}
                    </span>
                    {note.isShared && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs flex-shrink-0">
                            Shared
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollaborationNoteCard;
