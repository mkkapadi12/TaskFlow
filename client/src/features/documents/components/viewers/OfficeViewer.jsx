const OfficeViewer = ({ url }) => {
  const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

  return (
    <div className="w-full h-full bg-muted/10 flex flex-col">
      <iframe
        src={officeUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Office Document Preview"
        className="w-full h-full border-0 rounded-b-xl"
      >
        <div className="p-6 text-center text-muted-foreground">
          Your browser does not support inline iframes. Please download the document to view it.
        </div>
      </iframe>
    </div>
  );
};

export default OfficeViewer;
