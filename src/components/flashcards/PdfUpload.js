import { createElement as h, useState } from '../../utils/h.js';
import { flashcardService } from '../../services/flashcardService.js';

export default function PdfUpload({ deckId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await flashcardService.uploadAndGenerate(deckId, file);
      onSuccess?.(result);
    } catch (err) {
      setError(err.message || 'Failed to generate flashcards');
    } finally {
      setIsLoading(false);
    }
  };

  return h('div', { className: 'pdf-upload' }, [
    h('div', { className: 'upload-zone' }, [
      h('input', {
        type: 'file',
        accept: '.pdf',
        onChange: handleFileUpload,
        disabled: isLoading,
        id: 'pdf-input',
        style: 'display: none',
      }),
      h('label', {
        htmlFor: 'pdf-input',
        className: 'upload-label',
      }, [
        h('p', {}, '📄 Upload PDF'),
        h('p', { className: 'text-muted' }, 'Drag and drop or click to select'),
        h('p', { className: 'text-muted', style: 'font-size: 0.85rem' }, 'AI will auto-generate flashcards'),
      ]),
    ]),
    error && h('div', { className: 'error-message' }, error),
    isLoading && h('div', { className: 'loading' }, 'Generating flashcards...'),
  ]);
}
