export interface Note {
  id: string;
  title: string;
  content: string;
  contentType: 'plain' | 'markdown';
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isFavorite: boolean;
  isShared?: boolean;
  shareId?: string;
  sharePermissions?: 'view' | 'edit';
  sharedWith?: string[];
  collaborators?: Collaborator[];
  version?: number;
  lastEditedBy?: string;
  isPrivate?: boolean;
  password?: string;
  passwordHint?: string;
}

export interface DeletedNote extends Note {
  deletedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
  isDefault?: boolean;
}

export interface ExportFormat {
  type: 'txt' | 'doc' | 'pdf' | 'md';
  label: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  avatar?: string;
  isEmailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationSentAt?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  permission: 'view' | 'edit';
  joinedAt: Date;
  lastActive?: Date;
  avatar?: string;
}

export interface ShareLink {
  id: string;
  noteId: string;
  permission: 'view' | 'edit';
  expiresAt?: Date;
  createdAt: Date;
  accessCount: number;
  isActive: boolean;
}

export interface Comment {
  id: string;
  noteId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  position?: {
    start: number;
    end: number;
  };
  isResolved?: boolean;
}

export interface PasswordPromptState {
  isOpen: boolean;
  noteId: string | null;
  onSuccess: (note: Note) => void;
  onCancel: () => void;
}

export interface EmailVerificationState {
  isOpen: boolean;
  email: string;
  onResend: () => void;
  onClose: () => void;
}