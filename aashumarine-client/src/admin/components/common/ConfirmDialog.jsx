import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import './ConfirmDialog.css';

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      // Error is handled by the component that passed onConfirm
      // Just ensure loading state is reset
      console.error('Confirm action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="small">
      <div className="confirm-dialog">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading || isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={loading || isLoading}
            isLoading={loading || isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
