
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, accept }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
        ${isDragging ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 bg-gray-800 hover:bg-gray-700'}`}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
        <p className="mb-2 text-sm text-gray-400">
          <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">Audio or Video file</p>
      </div>
      <input
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept={accept}
      />
    </label>
  );
};

export default FileUploader;
