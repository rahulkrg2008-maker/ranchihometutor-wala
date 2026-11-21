import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface SecureDocumentProps {
  /** Either a private proxy URL (/api/storage/file?...) or an inline data URL */
  src: string;
  alt: string;
  /** 'thumb' renders an image preview; 'link' renders a text button */
  variant?: 'thumb' | 'link';
  label?: string;
  className?: string;
}

/**
 * Private documents are served from an admin-only endpoint, which needs the Authorization
 * header. <img src> and <a href> cannot send headers, so we fetch the file with the header
 * and show it through a short-lived blob URL.
 */
export function SecureDocument({ src, alt, variant = 'thumb', label, className }: SecureDocumentProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [mime, setMime] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let revoked: string | null = null;
    let cancelled = false;
    setFailed(false);
    setBlobUrl(null);

    if (!src.startsWith('/api/')) {
      // Inline data URL (database fallback): usable as-is
      setBlobUrl(src);
      setMime(src.slice(5, src.indexOf(';')));
      return;
    }

    fetch(src, { headers: StorageService.getAuthHeaders() })
      .then((r) => {
        if (!r.ok) throw new Error('not ok');
        return r.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        revoked = URL.createObjectURL(blob);
        setMime(blob.type);
        setBlobUrl(revoked);
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [src]);

  if (failed) return <span className="text-[11px] text-rose-400">Could not load document (session expired?)</span>;
  if (!blobUrl) return <span className="text-[11px] text-slate-500">Loading document…</span>;

  const isImage = mime.startsWith('image/');
  if (variant === 'link' || !isImage) {
    return (
      <a
        href={blobUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className || 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-400 text-xs font-medium transition-colors'}
      >
        <FileText className="w-3.5 h-3.5" />
        <span>{label || 'Open document'}</span>
      </a>
    );
  }
  return (
    <a href={blobUrl} target="_blank" rel="noopener noreferrer" className="block">
      <img
        src={blobUrl}
        alt={alt}
        className={className || 'w-full h-32 object-contain bg-slate-950 rounded-lg border border-slate-800 hover:opacity-90'}
      />
    </a>
  );
}
