// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.tsx';
// import './index.css';
// import { BrowserRouter } from 'react-router-dom';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <BrowserRouter>  {/* ✅ Wrap your app with Router */}
//       <App />
//     </BrowserRouter>
//   </StrictMode>
// );

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import i18n from './i18n'; // make sure this path is correct

// Wait for i18n to finish initializing before rendering the app
i18n.init().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
});

