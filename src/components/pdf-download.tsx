import React, { useState } from 'react';
import { marked } from 'marked';
import { pdfMake } from 'pdfmake/build/pdfmake';
import { vfsFonts } from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = vfsFonts.pdfMake.vfs; // Add embedded font files to pdfMake

const MarkdownToPdf = () => {
  const [markdownContent, setMarkdownContent] = useState('# Markdown Example\nThis is an example of Markdown content.\n\n- Item 1\n- Item 2');
  
  // Convert Markdown to HTML using the marked library
  const renderMarkdown = (markdown) => {
    return marked(markdown);
  };

  const generatePdf = () => {
    // Create a document definition for PDFMake
    const docDefinition = {
      content: [
        {
          text: 'Markdown to PDF Example',
          style: 'header'
        },
        {
          text: 'This is your markdown content rendered in a PDF.',
          margin: [0, 10]
        },
        {
          html: renderMarkdown(markdownContent), // Render Markdown as HTML
          margin: [0, 10],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
      }
    };

    // Generate PDF
    pdfMake.createPdf(docDefinition).download('markdown_content.pdf');
  };

  return (
    <div>
      <h1>Markdown to PDF</h1>
      <textarea 
        value={markdownContent} 
        onChange={(e) => setMarkdownContent(e.target.value)} 
        rows="10" 
        cols="50" 
      />
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
};

export default MarkdownToPdf;
