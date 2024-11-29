import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

const MarkDownDisplay = ({ text, title = "Generated market Plan", btnText = "Download as Markdown" }) => {

  const [markdownText, setMarkdownText] = useState(text);
  const handleChange = (event) => {
    setMarkdownText(event.target.value);
  };


  const handleExportToTxt = () => {
    // Create a Blob with the markdown content
    const blob = new Blob([markdownText], { type: "text/plain" });

    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "example.txt"; // Set the filename for the download
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up the URL and remove the link
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl mt-4'>{title}</h1>
        <div>
          <Button onClick={handleExportToTxt}>
            <Download /> {btnText}
          </Button>
        </div>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', margin: "20px 0 50px 0" }}>
        <ReactMarkdown>{markdownText}</ReactMarkdown>
      </div>

      <textarea
        value={markdownText}
        onChange={handleChange}
        rows={7}
        cols={50}
        style={{ width: '100%', marginBottom: '20px', padding: "30px" }}
        className='border-2 rounded-md'
      ></textarea>
    </div>
  );
};

export default MarkDownDisplay;
