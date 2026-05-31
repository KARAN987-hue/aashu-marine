import './LoadingSpinner.css';

export function LoadingSpinner({ size = 'medium', fullScreen = false }) {
  const spinner = (
    <div
      className={`loading-spinner loading-spinner-${size}`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return <div className="loading-spinner-fullscreen">{spinner}</div>;
  }

  return spinner;
}

export default LoadingSpinner;
