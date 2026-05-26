const ImageViewer = ({ url, name }) => {
  return (
    <div className="flex h-full items-center justify-center p-6 bg-muted/10">
      <div className="relative max-h-full max-w-full overflow-hidden rounded-lg border border-border/50 bg-card shadow-lg p-2 backdrop-blur-sm">
        <img
          src={url}
          alt={name || 'Document image'}
          className="max-h-[70vh] max-w-full object-contain rounded"
        />
      </div>
    </div>
  );
};

export default ImageViewer;
