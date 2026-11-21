/**
 * Prepares a user-selected document for upload.
 * Images are downscaled/re-encoded as JPEG so they stay far below the serverless body limit;
 * PDFs are passed through (max 3 MB).
 */
const MAX_DIMENSION = 1800;

export async function prepareDocumentForUpload(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    if (file.size > 3 * 1024 * 1024) throw new Error('PDF is too large. Please keep it under 3 MB.');
    return readAsDataUrl(file);
  }
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    throw new Error('Please upload a JPG, PNG, WebP image or a PDF.');
  }
  if (file.size > 15 * 1024 * 1024) throw new Error('Image is too large. Please choose one under 15 MB.');

  const dataUrl = await readAsDataUrl(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error('Could not read this image. Please try another file.'));
    i.src = dataUrl;
  });
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.82);
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error('Failed to read file.'));
    r.readAsDataURL(file);
  });
}
