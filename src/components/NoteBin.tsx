import React, { useState,useEffect } from 'react';
import { DeletedNote } from '../types';
import { X, Trash2, RotateCcw, AlertTriangle, Calendar, Search } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import '../i18n';
import { useTranslation } from 'react-i18next';
interface NoteBinProps {
  isOpen: boolean;
  onClose: () => void;
  deletedNotes: DeletedNote[];
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onEmptyBin: () => void;
  getDaysUntilDeletion: (deletedAt: Date) => number;
}

const NoteBin: React.FC<NoteBinProps> = ({
  isOpen,
  onClose,
  deletedNotes,
  onRestore,
  onPermanentDelete,
  onEmptyBin,
  getDaysUntilDeletion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const { t } = useTranslation()
  const filteredNotes = deletedNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // const formatDate = (date: Date) => {
  //   return new Intl.DateTimeFormat('en-US', {
  //     month: 'short',
  //     day: 'numeric',
  //     year: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   }).format(date);
  // };
  useEffect(() => {
    deletedNotes.forEach((note) => {
      const daysLeft = getDaysUntilDeletion(note);

      if (daysLeft === 0) {
        onPermanentDelete(note._id || note.id);
        toast.error(`Note "${note.title}" auto-deleted!`);
      }
    });
  }, [deletedNotes, getDaysUntilDeletion, onPermanentDelete]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };


  const getPreview = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  const handlePermanentDelete = (id: string, title: string) => {
    toast.error('Note Deleted from bin!')
    onPermanentDelete(id);

  };

  const handleEmptyBin = () => {

    onEmptyBin();
    setShowEmptyConfirm(false);
    toast.error('Bin Emptied!')

  };

  if (!isOpen) return null;

  return (
    <>
      <Toaster />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                 <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("note_bin")}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t(deletedNotes.length === 1 ? "note_bin_count" : "note_bin_count_plural", { count: deletedNotes.length })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {deletedNotes.length > 0 && (
                <button
                  onClick={() => setShowEmptyConfirm(true)}
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  {t("empty_bin")}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {deletedNotes.length > 0 && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                placeholder={t("search_deleted_notes")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          )}

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {deletedNotes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t("note_bin_empty")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t("note_bin_empty_desc")}
                </p>
              </div>
            ) : (
              <>
                {/* Info banner */}
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-200">
                        {t("auto_cleanup_title")}
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        {t("auto_cleanup_desc")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredNotes.map((note) => {
                    const daysLeft = getDaysUntilDeletion(note);
                    return (
                      <div
                        key={note.id}
                        className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                              {note.title === 'Untitled' ? t("untitled") : note.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {console.log(note?.deletedAt)}
                              {console.log(note?._id)}
                             <span>{t("deleted_on", { date: formatDate(note?.deletedAt) })}</span>  
                              <span>•</span>
                              <span className={`font-medium ${daysLeft <= 7 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                {daysLeft === 0 ? t("deletes_today") : t("deletes_in_days", { count: daysLeft })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onRestore(note._id || note.id)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                              title="Restore note"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(note._id || note.id, note.title)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                              title={t("delete_permanently")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">
                          {getPreview(note.content)}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${note.category === 'personal' ? '#6366F1' :
                                  note.category === 'work' ? '#8B5CF6' :
                                    note.category === 'ideas' ? '#10B981' : '#F59E0B'}20`,
                                color: note.category === 'personal' ? '#6366F1' :
                                  note.category === 'work' ? '#8B5CF6' :
                                    note.category === 'ideas' ? '#10B981' : '#F59E0B'
                              }}
                            >
                              {note.category}
                            </span>
                            {note.tags.length > 0 && (
                              <div className="flex space-x-1">
                                {note.tags.slice(0, 2).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {note.tags.length > 2 && (
                                  <span className="text-xs text-gray-400">+{note.tags.length - 2}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                           {t("created_on", { date: formatDate(note?.createdAt) })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Empty bin confirmation modal */}
          {showEmptyConfirm && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                   {t("confirm_empty_bin_title")}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t("confirm_empty_bin_desc", { count: deletedNotes.length })}
                </p>
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowEmptyConfirm(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  >
                   {t("cancel")}
                  </button>
                  <button
                    onClick={handleEmptyBin}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                   {t("confirm")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NoteBin;
