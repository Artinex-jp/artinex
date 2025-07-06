export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center">
      <div className="loader"></div>
    </div>
  );
}