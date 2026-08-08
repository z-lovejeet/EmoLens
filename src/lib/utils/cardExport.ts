import html2canvas from 'html2canvas';

export async function exportCardAsPng(element: HTMLElement, filename?: string): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#141418',
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const link = document.createElement('a');
    link.download = filename ?? `emolens-card-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('[cardExport] Failed to export card as PNG:', error);
    throw error;
  }
}

export async function exportCardAsBlob(element: HTMLElement): Promise<Blob | null> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#141418',
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  } catch (error) {
    console.error('[cardExport] Failed to create blob:', error);
    return null;
  }
}
