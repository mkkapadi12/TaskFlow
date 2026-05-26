const OfficeViewer = ({ url }) => {
  const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

  return (
    <div className="bg-muted/10 flex h-full w-full flex-col">
      <iframe
        src={officeUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Office Document Preview"
        className="h-full w-full rounded-b-xl border-0"
      >
        <div className="text-muted-foreground p-6 text-center">
          Your browser does not support inline iframes. Please download the
          document to view it.
        </div>
      </iframe>
    </div>
  );
};

export default OfficeViewer;
