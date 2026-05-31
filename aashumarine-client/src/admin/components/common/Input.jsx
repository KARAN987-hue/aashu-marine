import './Input.css';

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  helpText,
  required = false,
  disabled = false,
  placeholder,
  name,
  id,
  ...props
}) {
  const inputId = id || name;
  const isTextarea = type === 'textarea';

  return (
    <div className="input-wrapper">
      {label && (
        <label
          htmlFor={inputId}
          className={`input-label ${required ? 'input-label-required' : ''}`}
        >
          {label}
        </label>
      )}
      
      {isTextarea ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`input-field input-textarea ${error ? 'input-error' : ''}`}
          {...props}
        />
      ) : (
        <input
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`input-field ${error ? 'input-error' : ''}`}
          {...props}
        />
      )}
      
      {error && <span className="input-error-message">{error}</span>}
      {!error && helpText && <span className="input-help-text">{helpText}</span>}
    </div>
  );
}
