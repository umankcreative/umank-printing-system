import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

interface ShareTaskButtonProps {
  taskId: string;
}

const ShareTaskButton: React.FC<ShareTaskButtonProps> = ({ taskId }) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { getTask } = useTaskContext();
  
  const task = getTask(taskId);
  const isCompleted = task?.status === 'completed';
  
  const handleShare = () => {
    if (isCompleted) return;
    
    // Use the full task ID for sharing
    const url = `${window.location.origin}/share/${taskId}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => {
          setCopied(true);
          setShowTooltip(true);
          
          setTimeout(() => {
            setCopied(false);
          }, 2000);
          
          setTimeout(() => {
            setShowTooltip(false);
          }, 3000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopied(true);
        setShowTooltip(true);
        
        setTimeout(() => {
          setCopied(false);
        }, 2000);
        
        setTimeout(() => {
          setShowTooltip(false);
        }, 3000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
      
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="relative">
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
          isCompleted 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
        onClick={handleShare}
        disabled={isCompleted}
      >
        {copied ? (
          <Check className="h-5 w-5" />
        ) : (
          <Share2 className="h-5 w-5" />
        )}
        <span>{isCompleted ? 'Berbagi Dinonaktifkan' : 'Bagikan Tugas'}</span>
      </button>
      
      {showTooltip && !isCompleted && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-sm py-1 px-3 rounded shadow-lg mb-1 animate-fadeIn">
          Tautan disalin!
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-gray-800 border-l-transparent border-r-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ShareTaskButton;