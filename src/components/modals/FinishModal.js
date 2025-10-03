import React from 'react';
import Modal from './Modal';

export default function FinishModal({ score = 0, total = 10, onClose }) {
  return (
    <Modal title='Quiz Finished!' onClose={onClose} width={380}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 16, margin: '12px 0' }}>
          Your score: <strong>{score}</strong> / {total}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: 'none',
              background: '#0078D4',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
