'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Download, Eye, FileText, Image, File } from 'lucide-react';

interface AttachmentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  attachmentUrl: string;
  attachmentName: string;
}

export default function AttachmentPreview({ isOpen, onClose, attachmentUrl, attachmentName }: AttachmentPreviewProps) {
  const [imageError, setImageError] = useState(false);

  if (!isOpen) return null;

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    }
    
    if (['pdf'].includes(extension || '')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    
    return <File className="w-8 h-8 text-slate-400" />;
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return 'image';
    }
    
    if (['pdf'].includes(extension || '')) {
      return 'pdf';
    }
    
    return 'document';
  };

  const fileType = getFileType(attachmentName);
  const isImage = fileType === 'image';
  const isPdf = fileType === 'pdf';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = attachmentUrl;
    link.download = attachmentName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-800 border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            {getFileIcon(attachmentName)}
            <div>
              <CardTitle className="text-white text-lg">{attachmentName}</CardTitle>
              <p className="text-slate-400 text-sm">Attachment Preview</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="bg-slate-600 hover:bg-slate-700 text-white border-slate-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 overflow-auto max-h-[calc(90vh-120px)]">
          {isImage && !imageError ? (
            <div className="flex items-center justify-center bg-slate-900">
              <img
                src={attachmentUrl}
                alt={attachmentName}
                className="max-w-full max-h-full object-contain"
                onError={handleImageError}
              />
            </div>
          ) : isPdf ? (
            <div className="w-full h-[600px]">
              <iframe
                src={attachmentUrl}
                className="w-full h-full border-0"
                title={attachmentName}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 bg-slate-900 text-slate-400">
              {getFileIcon(attachmentName)}
              <p className="mt-4 text-lg">Preview not available</p>
              <p className="text-sm">This file type cannot be previewed in the browser</p>
              <Button
                onClick={handleDownload}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download to view
              </Button>
            </div>
          )}
          
          {isImage && imageError && (
            <div className="flex flex-col items-center justify-center h-96 bg-slate-900 text-slate-400">
              <Image className="w-16 h-16 mb-4" />
              <p className="text-lg">Image failed to load</p>
              <p className="text-sm">The image may be corrupted or the URL is invalid</p>
              <Button
                onClick={handleDownload}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download to view
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
