import { useState, useEffect } from 'react';
import { Note, Category, DeletedNote } from '../types';

const GUEST_STORAGE_KEY = 'notepad-notes-guest';
const GUEST_CATEGORIES_KEY = 'notepad-categories-guest';
const GUEST_DELETED_NOTES_KEY = 'notepad-deleted-notes-guest';

const getUserStorageKey = (userId: string | null, key: string) => {
  if (!userId) {
    return key.replace('notepad-', 'notepad-guest-');
  }
  return `${key}-user-${userId}`;
};

export const useNotes = (userId?: string | null) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<DeletedNote[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'personal', name: 'Personal', color: '#6366F1', count: 0, isDefault: true },
    { id: 'work', name: 'Work', color: '#8B5CF6', count: 0, isDefault: true },
    { id: 'ideas', name: 'Ideas', color: '#10B981', count: 0, isDefault: true },
    { id: 'todo', name: 'To-Do', color: '#F59E0B', count: 0, isDefault: true },
  ]);

  // Get storage keys based on user authentication status
  const getStorageKeys = () => {
    const baseKeys = {
      notes: 'notepad-notes',
      categories: 'notepad-categories',
      deletedNotes: 'notepad-deleted-notes'
    };

    return {
      notes: getUserStorageKey(userId, baseKeys.notes),
      categories: getUserStorageKey(userId, baseKeys.categories),
      deletedNotes: getUserStorageKey(userId, baseKeys.deletedNotes)
    };
  };

  useEffect(() => {
    const storageKeys = getStorageKeys();
    
    const savedNotes = localStorage.getItem(storageKeys.notes);
    const savedCategories = localStorage.getItem(storageKeys.guest_categories);
    const savedDeletedNotes = localStorage.getItem(storageKeys.deletedNotes);
    
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
        contentType: note.contentType || 'plain',
      }));
      setNotes(parsedNotes);
    } else {
      setNotes([]);
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Reset to default categories for new user/guest session
      setCategories([
        { id: 'personal', name: 'Personal', color: '#6366F1', count: 0, isDefault: true },
        { id: 'work', name: 'Work', color: '#8B5CF6', count: 0, isDefault: true },
        { id: 'ideas', name: 'Ideas', color: '#10B981', count: 0, isDefault: true },
        { id: 'todo', name: 'To-Do', color: '#F59E0B', count: 0, isDefault: true },
      ]);
    }

    if (savedDeletedNotes) {
      const parsedDeletedNotes = JSON.parse(savedDeletedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
        deletedAt: new Date(note.deletedAt),
        contentType: note.contentType || 'plain',
      }));
      setDeletedNotes(parsedDeletedNotes);
    } else {
      setDeletedNotes([]);
    }

    // Clean up old deleted notes (older than 30 days)
    cleanupOldDeletedNotes();
  }, [userId]); // Re-run when userId changes

  useEffect(() => {
    const storageKeys = getStorageKeys();
    localStorage.setItem(storageKeys.notes, JSON.stringify(notes));
    updateCategoryCounts();
  }, [notes, userId]);

  useEffect(() => {
    const storageKeys = getStorageKeys();
    localStorage.setItem(storageKeys.categories, JSON.stringify(categories));
  }, [categories, userId]);

  useEffect(() => {
    const storageKeys = getStorageKeys();
    localStorage.setItem(storageKeys.deletedNotes, JSON.stringify(deletedNotes));
  }, [deletedNotes, userId]);

  const cleanupOldDeletedNotes = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    setDeletedNotes(prev => {
      const filtered = prev.filter(note => new Date(note.deletedAt) > thirtyDaysAgo);
      if (filtered.length !== prev.length) {
        const storageKeys = getStorageKeys();
        localStorage.setItem(storageKeys.deletedNotes, JSON.stringify(filtered));
      }
      return filtered;
    });
  };

  const updateCategoryCounts = () => {
    setCategories(prev => prev.map(category => ({
      ...category,
      count: notes.filter(note => note.category === category.id).length,
    })));
  };

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      contentType: noteData.contentType || 'plain',
      version: 1,
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote.id;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    const noteToDelete = notes.find(note => note.id === id);
    if (!noteToDelete) return;

    const deletedNote: DeletedNote = {
      ...noteToDelete,
      deletedAt: new Date(),
    };

    setDeletedNotes(prev => [deletedNote, ...prev]);
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const restoreNote = (id: string) => {
    const noteToRestore = deletedNotes.find(note => note.id === id);
    if (!noteToRestore) return;

    const { deletedAt, ...restoredNote } = noteToRestore;
    const noteWithUpdatedTime = {
      ...restoredNote,
      updatedAt: new Date(),
    };

    setNotes(prev => [noteWithUpdatedTime, ...prev]);
    setDeletedNotes(prev => prev.filter(note => note.id !== id));
  };

  const permanentlyDeleteNote = (id: string) => {
    setDeletedNotes(prev => prev.filter(note => note.id !== id));
  };

  const emptyNoteBin = () => {
    setDeletedNotes([]);
  };

  const togglePin = (id: string) => {
    updateNote(id, { isPinned: !notes.find(n => n.id === id)?.isPinned });
  };

  const toggleFavorite = (id: string) => {
    updateNote(id, { isFavorite: !notes.find(n => n.id === id)?.isFavorite });
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color,
      count: 0,
      isDefault: false,
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory.id;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category =>
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const deleteCategory = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category?.isDefault) return;
    
    setNotes(prev => prev.map(note =>
      note.category === id ? { ...note, category: 'personal' } : note
    ));
    
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  const getRecentNotes = () => {
    return [...notes]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);
  };

  const getDaysUntilDeletion = (deletedAt: Date) => {
    const now = new Date();
    const deletionDate = new Date(deletedAt);
    deletionDate.setDate(deletionDate.getDate() + 30);
    const diffTime = deletionDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return {
    notes,
    deletedNotes,
    categories,
    addNote,
    updateNote,
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
    emptyNoteBin,
    togglePin,
    toggleFavorite,
    addCategory,
    updateCategory,
    deleteCategory,
    getRecentNotes,
    getDaysUntilDeletion,
    cleanupOldDeletedNotes,
  };
};