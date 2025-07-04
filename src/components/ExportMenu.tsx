import React, { useState } from 'react';
import { Note } from '../types';
import { Download, FileText, File, FileImage, FileCode } from 'lucide-react';
 import html2pdf from 'html2pdf.js';
interface ExportMenuProps {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ note, isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportAsText = () => {
    const content = `${note.title}\n\n${note.content}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title || 'Untitled'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  const exportAsMarkdown = () => {
    const content = `# ${note.title || 'Untitled'}\n\n${note.content}`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title || 'Untitled'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  const exportAsDoc = () => {
    const content = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>${note.title}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              margin: 40px;
              color: #333;
            }
            h1 { 
              color: #333; 
              border-bottom: 2px solid #6366F1; 
              padding-bottom: 10px; 
              margin-bottom: 30px;
            }
            .content { 
              margin: 20px 0; 
              white-space: pre-wrap; 
              font-size: 14px;
              line-height: 1.8;
            }
          </style>
        </head>
        <body>
          <h1>${note.title || 'Untitled'}</h1>
          <div class="content">${note.content}</div>
        </body>
      </html>
    `;
    
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title || 'Untitled'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  // const exportAsPDF = async () => {
  //   setIsExporting(true);
    
  //   // Create a clean PDF-like HTML structure with only title and content
  //   const content = `
  //     <html>
  //       <head>
  //         <meta charset="utf-8">
  //         <title>${note.title}</title>
  //         <style>
  //           @page { margin: 1in; }
  //           body { 
  //             font-family: 'Times New Roman', serif; 
  //             line-height: 1.8; 
  //             color: #333;
  //             max-width: 8.5in;
  //             margin: 0;
  //             padding: 0;
  //           }
  //           h1 { 
  //             color: #000; 
  //             border-bottom: 2px solid #000; 
  //             padding-bottom: 15px; 
  //             margin-bottom: 30px;
  //             font-size: 24px;
  //             font-weight: bold;
  //           }
  //           .content { 
  //             white-space: pre-wrap; 
  //             text-align: justify;
  //             font-size: 12px;
  //             line-height: 1.8;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <h1>${note.title || 'Untitled'}</h1>
  //         <div class="content">${note.content}</div>
  //       </body>
  //     </html>
  //   `;
    
  //   // Open in new window for printing to PDF
  //   const printWindow = window.open('', '_blank');
  //   if (printWindow) {
  //     printWindow.document.write(content);
  //     printWindow.document.close();
  //     printWindow.focus();
      
  //     setTimeout(() => {
  //       printWindow.print();
  //       printWindow.close();
  //     }, 500);
  //   }
    
  //   setIsExporting(false);
  //   onClose();
  // };

 

const exportAsPDF = async () => {
  setIsExporting(true);

  const element = document.createElement('div');
  element.innerHTML = `
    <div style="font-family: 'Times New Roman', serif; padding: 1in; color: #333; line-height: 1.8;">
      <h1 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 30px; font-size: 24px; font-weight: bold;">
        ${note.title || 'Untitled'}
      </h1>
      <div style="white-space: pre-wrap; text-align: justify; font-size: 12px; line-height: 1.8;">
        ${note.content}
      </div>
    </div>
  `;

  // Convert to PDF and download directly
  await html2pdf()
    .set({
      margin:       0,
      filename:     `${note.title || 'note'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    })
    .from(element)
    .save();

  setIsExporting(false);
  onClose();
};


  if (!isOpen) return null;

  return (
    <div className="absolute z-auto right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ">
      <div className="p-2">
        <button
          onClick={exportAsText}
          className="w-full flex items-center px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <FileText className="w-4 h-4 mr-3" />
          Export as Text
        </button>
        {note.contentType === 'markdown' && (
          <button
            onClick={exportAsMarkdown}
            className="w-full flex items-center px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <FileCode className="w-4 h-4 mr-3" />
            Export as Markdown
          </button>
        )}
        <button
          onClick={exportAsDoc}
          className="w-full flex items-center px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <File className="w-4 h-4 mr-3" />
          Export as Doc
        </button>
        <button
          onClick={exportAsPDF}
          disabled={isExporting}
          className="w-full flex items-center px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          <FileImage className="w-4 h-4 mr-3" />
          {isExporting ? 'Exporting...' : 'Export as PDF'}
        </button>
      </div>
    </div>
  );
};

export default ExportMenu;