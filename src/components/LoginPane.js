import React from 'react';

export default function LoginPane({ onOpenAuth, currentUser, onLogout }) {
  return (
    <header
      className='top-bar'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        borderBottom: '1px solid #e6e6e6',
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 18 }}>GeoQuest</h1>
      </div>

      <div
        className='login-pane'
        aria-label='Login area'
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <span style={{ fontWeight: 700 }}>{currentUser.name}</span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                {currentUser.email}
              </span>
            </div>
            <button
              type='button'
              className='btn outline'
              onClick={onLogout}
              aria-label='Log out'
            >
              Log out
            </button>
          </div>
        ) : (
          <>
            <button
              type='button'
              className='btn primary'
              onClick={() => onOpenAuth && onOpenAuth('login')}
            >
              Log in
            </button>

            <button
              type='button'
              className='btn outline'
              onClick={() => onOpenAuth && onOpenAuth('signup')}
            >
              Sign up
            </button>

            {/* compact auth button visible on small screens */}
            <button
              type='button'
              className='auth-compact btn primary'
              onClick={() => onOpenAuth && onOpenAuth('login')}
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </header>
  );
}
