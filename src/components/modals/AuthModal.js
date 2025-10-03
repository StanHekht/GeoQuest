import React from 'react';
import Modal from './Modal';

export default function AuthModal({
  mode = 'login',
  onClose,
  onLocalAuth,
  onGoogleAuth,
  error,
}) {
  return (
    <Modal
      title={mode === 'login' ? 'Sign in to GeoQuest' : 'Create an account'}
      onClose={onClose}
      width={440}
    >
      <form
        onSubmit={onLocalAuth}
        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        autoComplete='off'
      >
        {/* hidden dummies to discourage autofill */}
        <input
          type='text'
          name='prevent_autofill_email'
          style={{ display: 'none' }}
          autoComplete='username'
        />
        <input
          type='password'
          name='prevent_autofill_pass'
          style={{ display: 'none' }}
          autoComplete='new-password'
        />

        <input
          name='email'
          type='email'
          placeholder='Email'
          required
          autoComplete='off'
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          required
          autoComplete='new-password'
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        />
        {mode === 'signup' && (
          <input
            name='displayName'
            type='text'
            placeholder='Display name'
            style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
          />
        )}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <button
            type='submit'
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 6,
              border: 'none',
              background: '#0078D4',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <button
            type='button'
            onClick={onGoogleAuth}
            aria-label='Sign in with Google (mock)'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              borderRadius: 6,
              border: '1px solid #ddd',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <svg
              width='18'
              height='18'
              viewBox='0 0 48 48'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'
            >
              <path
                fill='#fbbb00'
                d='M43.6 20.5H42V20H24v8h11.3C34.7 32.9 30 36 24 36c-7.7 0-14-6.3-14-14s6.3-14 14-14c3.6 0 6.8 1.3 9.3 3.5l6.6-6.6C35.6 3.5 30.1 1 24 1 11.9 1 2 10.9 2 23s9.9 22 22 22 22-9.9 22-22c0-1.5-.2-2.9-.4-4.5z'
              />
              <path
                fill='#518ef8'
                d='M6.3 14.7l7.4 5.4C14.5 17.2 19 15 24 15c3.6 0 6.8 1.3 9.3 3.5l6.6-6.6C35.6 6.5 30.1 4 24 4 16.5 4 9.7 8.4 6.3 14.7z'
              />
              <path
                fill='#28b446'
                d='M24 44c6 0 11-2.2 14.8-5.8l-7-5.8C29.6 33.8 27 34.5 24 34.5 18 34.5 13 30.4 10.5 25.1l-7.4 5.4C7.9 39.8 15.3 44 24 44z'
              />
              <path
                fill='#f14336'
                d='M43.6 20.5H42V20H24v8h11.3c-1.1 3.4-3.6 6.3-6.7 8.1l7 5.8C39.6 36.9 44 30.8 44 24c0-1.5-.2-2.9-.4-4.5z'
              />
            </svg>
            Google
          </button>
        </div>

        <div style={{ marginTop: 12, fontSize: 13, color: '#666' }}>
          By continuing you agree to our{' '}
          <button
            type='button'
            className='btn ghost'
            onClick={() => alert('Terms (mock)')}
            style={{ padding: 0 }}
          >
            Terms
          </button>{' '}
          and{' '}
          <button
            type='button'
            className='btn ghost'
            onClick={() => alert('Privacy (mock)')}
            style={{ padding: 0 }}
          >
            Privacy
          </button>
          .
        </div>
      </form>
    </Modal>
  );
}
