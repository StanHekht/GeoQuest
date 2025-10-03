import React from 'react';

export default function LoginPane({ onOpenAuth }) {
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

      <form
        className='login-pane'
        style={{ display: 'flex', gap: 8, alignItems: 'center' }}
        aria-label='Login (mock)'
        onSubmit={(e) => e.preventDefault()}
        autoComplete='off'
      >
        {/* invisible dummy inputs to discourage browser autofill */}
        <input
          type='text'
          name='prevent_autofill_username'
          style={{ display: 'none' }}
          autoComplete='username'
        />
        <input
          type='password'
          name='prevent_autofill_password'
          style={{ display: 'none' }}
          autoComplete='new-password'
        />

        <input
          className='compact-hide'
          type='text'
          name='username'
          placeholder='Username'
          aria-label='Username'
          autoComplete='off'
          style={{
            padding: '6px 8px',
            borderRadius: 4,
            border: '1px solid #ccc',
            minWidth: 120,
          }}
        />
        <input
          className='compact-hide'
          type='password'
          name='password'
          placeholder='Password'
          aria-label='Password'
          autoComplete='new-password'
          style={{
            padding: '6px 8px',
            borderRadius: 4,
            border: '1px solid #ccc',
            minWidth: 120,
          }}
        />

        <button
          type='button'
          onClick={() => onOpenAuth && onOpenAuth('login')}
          style={{
            padding: '6px 10px',
            borderRadius: 4,
            border: 'none',
            background: '#0078D4',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Log in
        </button>

        <button
          type='button'
          onClick={() => onOpenAuth && onOpenAuth('signup')}
          style={{
            padding: '6px 10px',
            borderRadius: 4,
            border: '1px solid #ccc',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Sign up
        </button>
        {/* compact auth button visible on small screens */}
        <button
          type='button'
          className='auth-compact'
          onClick={() => onOpenAuth && onOpenAuth('login')}
          style={{
            padding: '6px 10px',
            borderRadius: 4,
            border: 'none',
            background: '#0078D4',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Sign in
        </button>
      </form>
    </header>
  );
}
