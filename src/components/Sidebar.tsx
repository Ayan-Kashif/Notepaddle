import React, { useState } from 'react';
import { Category } from '../types';
import { Folder, Star, Pin, Clock, Settings, Plus, Trash2, X } from 'lucide-react';
import CategoryManager from './CategoryManager';
import { Link } from 'react-router-dom';
import Portal from './Portal';
import { User } from 'lucide-react';
interface SidebarProps {
  notes:Notes[];
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  pinnedCount: number;
  favoriteCount: number;
  recentCount: number;
  deletedCount: number;
  onAddCategory: (name: string, color: string) => void;
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
  onOpenNoteBin: () => void;
}



const Sidebar: React.FC<SidebarProps> = ({
  notes,
  categories,
  selectedCategory,
  onCategorySelect,
  pinnedCount,
  favoriteCount,
  recentCount,
  deletedCount,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onOpenNoteBin,
}) => {
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  console.log(categories)

const categoriesWithCounts = categories.map((category) => ({
  ...category,
  count: notes.filter(
    (note) => note.category === category.id
  ).length,
}));

  const menuItems = [
    { id: 'all', name: 'All Notes', icon: Folder, count: notes.filter(note => !note.isDeleted).length},
    { id: 'recent', name: 'Recent', icon: Clock, count: recentCount },
    { id: 'pinned', name: 'Pinned', icon: Pin, count: pinnedCount },
    { id: 'favorites', name: 'Favorites', icon: Star, count: favoriteCount },
  ];

  return (
    <>
      <aside className="w-full h-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-r border-gray-200/20 dark:border-gray-700/20 lg:border-r-0 lg:border-none">
        <div className="p-4 h-full overflow-y-auto">
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('closeSidebar'))}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          


          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onCategorySelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-xl transition-all duration-200 ${
                  selectedCategory === item.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium truncate">{item.name}</span>
                </div>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full flex-shrink-0">
                  {item.count}
                </span>
              </button>
            ))}

            {/* Note Bin */}
            <button
              onClick={onOpenNoteBin}
              className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
            >
              <div className="flex items-center space-x-3">
                <Trash2 className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium truncate">Note Bin</span>
              </div>
              {deletedCount > 0 && (
                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full flex-shrink-0">
                  {deletedCount}
                </span>
              )}
            </button>
          </nav>

          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Categories
              </h3>
              <button
                onClick={() => setIsCategoryManagerOpen(true)}
                className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors duration-200"
                title="Manage Categories"
              >
                <Settings className="w-3 h-3" />
              </button>
            </div>
          <nav className="space-y-1">
  {categoriesWithCounts.map((category) => (
    <button
      key={category.id}
      onClick={() => onCategorySelect(category.id)}
      className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-xl transition-all duration-200 ${
        selectedCategory === category.id
          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
      }`}
    >
      <div className="flex items-center space-x-3 min-w-0">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <span className="font-medium truncate">{category.name}</span>
      </div>
      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full flex-shrink-0">
        {category.count}
      </span>
    </button>
  ))}

  {localStorage.getItem('token') && (
        <div>
            <Link to="/collaborations"
  className="flex items-center text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800/50 gap-2 px-4 py-2  relative right-2 hover:bg-gray-100 rounded-md"
>
  <User size={18} /> <span className=''>Collaborations</span>
</Link>

          </div>
  ) 
}
</nav>

          </div>

        </div>
          
      </aside>

      

{isCategoryManagerOpen && (
  <Portal>
    <CategoryManager
      isOpen={isCategoryManagerOpen}
      onClose={() => setIsCategoryManagerOpen(false)}
      categories={categories}
      onAddCategory={onAddCategory}
      onUpdateCategory={onUpdateCategory}
      onDeleteCategory={onDeleteCategory}
    />
  </Portal>
)}
    </>
  );
};

export default Sidebar;
































// import React, { useEffect, useState } from 'react';
// import { Note } from '../types';

// interface SidebarProps {
//   isAuthenticated: boolean;
//   userId?: string;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isAuthenticated, userId }) => {
//   const [stats, setStats] = useState({
//     recent: 0,
//     pinned: 0,
//     favorites: 0,
//     personal: 0,
//     work: 0,
//     ideas: 0,
//     todo: 0,
//   });

//   const loadNotes = () => {
//     if (isAuthenticated && userId) {
//       // Fetch notes from backend for authenticated user
//       fetch(`http://localhost:5000/api/users/notes`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       )

//         .then(res => res.json())
//         .then(notes => setStats(calculateStats(notes)))
//         .catch(err => console.error('Error fetching notes:', err));
//     } else {
//       // Get notes from localStorage for guest
//       const guestNotes = JSON.parse(localStorage.getItem('guestNotes')) || [];
//       setStats(calculateStats(guestNotes));
//     }
//   }
//   const calculateStats = (notes: Note[]) => {
//     const now = new Date();
//     const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

//     return {
//       recent: notes.filter(note =>
//         new Date(note.updatedAt) > oneWeekAgo
//       ).length,
//       pinned: notes.filter(note => note.isPinned).length,
//       favorites: notes.filter(note => note.isFavorite).length,
//       personal: notes.filter(note => note.category === 'personal').length,
//       work: notes.filter(note => note.category === 'work').length,
//       ideas: notes.filter(note => note.category === 'ideas').length,
//       todo: notes.filter(note => note.category === 'todo').length,
//     };
//   };
//   useEffect(() => {

   
//     loadNotes()
//   }, [isAuthenticated, userId]);

//   return (
//     <div className="sidebar w-64 bg-gray-50 dark:bg-gray-800 h-screen p-4 border-r border-gray-200 dark:border-gray-700">
//       <div className="mb-8">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">All Notes</h2>

//         <div className="space-y-2">
//           <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
//             <span>Recent</span>
//             <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-xs">
//               {stats.recent}
//             </span>
//           </div>

//           <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
//             <span>Pinned</span>
//             <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-xs">
//               {stats.pinned}
//             </span>
//           </div>

//           <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
//             <span>Favorites</span>
//             <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-xs">
//               {stats.favorites}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="mb-8">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Note Bin</h2>
//         {/* Add your bin/deleted notes functionality here */}
//       </div>

//       <div>
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">CATEGORIES</h2>

//         <div className="space-y-2">
//           <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
//             <span>Personal</span>
//             <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-xs">
//               {stats.personal}
//             </span>
//           </div>

//           <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
//             <span>Work</span>
//             <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-xs">
//               {stats.work}
//             </span>
//           </div>

//           <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
//             <span>Ideas</span>
//             <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-xs">
//               {stats.ideas}
//             </span>
//           </div>

//           <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
//             <span>To-Do</span>
//             <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-xs">
//               {stats.todo}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;