import './Button.css';

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${isLoading ? 'btn-loading' : ''}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="btn-spinner"></span>
          <span className="btn-text">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
