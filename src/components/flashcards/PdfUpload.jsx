import React, { useState, useRef } from 'react';
import { flashcardService } from '../../services/flashcardService.js';

export default function PdfUpload({ deckId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await flashcardService.uploadAndGenerate(deckId, file);
      onSuccess?.(result);
    } catch (err) {
      setError(err.message || 'Failed to generate flashcards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="pdf-upload">
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${isLoading ? 'loading' : ''}`}
        onClick={() => !isLoading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        aria-label="Upload PDF"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isLoading}
          style={{ display: 'none' }}
        />

        {isLoading ? (
          <div className="upload-loading">
            <div className="spinner" />
            <p>Generating flashcards with AI…</p>
            <p className="text-muted">This may take a moment</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📄</div>
            <p className="upload-title">
              {isDragging ? 'Drop your PDF here' : 'Upload PDF'}
            </p>
            <p className="text-muted">Drag & drop or click to select</p>
            <p className="upload-hint">AI will auto-generate flashcards</p>
          </>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
