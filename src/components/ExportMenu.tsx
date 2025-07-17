import React, { useState } from 'react';
import { Note } from '../types';
import { Download, FileText, File, FileImage, FileCode } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import '../i18n';
import { useTranslation } from 'react-i18next';
interface ExportMenuProps {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ note, isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
 const { t } = useTranslation()
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

  
 

const exportAsPDF = async (title: string, content: string) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const { width, height } = page.getSize();

  const fontSize = 12;
  const wrappedContent = content.match(/.{1,90}/g)?.join('\n') || content;

  page.drawText(`${title}\n\n${wrappedContent}`, {
    x: 50,
    y: height - 50,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
    lineHeight: 14,
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title || 'note'}.pdf`;
  link.click();
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
           {t('exportAsText')}
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
         {t('exportAsDoc')}
        </button>
        <button
          onClick={exportAsPDF}
          disabled={isExporting}
          className="w-full flex items-center px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          <FileImage className="w-4 h-4 mr-3" />
         {isExporting ? 'Exporting...' : t('exportAsPDF')}
        </button>
      </div>
    </div>
  );
};

export default ExportMenu;
