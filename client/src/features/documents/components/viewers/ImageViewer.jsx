const ImageViewer = ({ url, name }) => {
  return (
    <div className="bg-muted/10 flex h-full items-center justify-center p-6">
      <div className="border-border/50 bg-card relative max-h-full max-w-full overflow-hidden rounded-lg border p-2 shadow-lg backdrop-blur-sm">
        <img
          src={url}
          alt={name || 'Document image'}
          className="max-h-[70vh] max-w-full rounded object-contain"
        />
      </div>
    </div>
  );
};

export default ImageViewer;
