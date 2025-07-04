// Portal.tsx
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted
    ? createPortal(children, document.body)
    : null;
};

export default Portal;