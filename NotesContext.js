import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    const res = await axios.get('http://localhost:5000/api/users/notes', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setNotes(res.data);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <NotesContext.Provider value={{ notes, setNotes, loadNotes }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
