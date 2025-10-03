import React, { useEffect } from 'react';

export default function Modal({ title, onClose, children, width = 520 }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className='modal-overlay'
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <div
        role='dialog'
        aria-modal='true'
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: '92%',
          background: '#fff',
          borderRadius: 8,
          padding: 20,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
      >
        {title && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
            <button
              onClick={onClose}
              aria-label='Close'
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: 20,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
