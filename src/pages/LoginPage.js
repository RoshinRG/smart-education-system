import { createElement as h, useState } from '../utils/h.js';
import { authService } from '../services/authService.js';
import Button from '../components/common/Button.js';

export default function LoginPage({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return h('div', { className: 'auth-page login-page' }, [
    h('div', { className: 'auth-container' }, [
      h('div', { className: 'auth-header' }, [
        h('h1', {}, '🎓 Smart Education'),
        h('p', {}, 'Sign in to your account'),
      ]),

      h('form', {
        onSubmit: (e) => {
          e.preventDefault();
          handleLogin();
        },
      }, [
        h('div', { className: 'form-group' }, [
          h('label', {}, 'Email'),
          h('input', {
            type: 'email',
            placeholder: 'you@example.com',
            value: email,
            onInput: (e) => setEmail(e.target.value),
            disabled: isLoading,
          }),
        ]),

        h('div', { className: 'form-group' }, [
          h('label', {}, 'Password'),
          h('input', {
            type: 'password',
            placeholder: '••••••••',
            value: password,
            onInput: (e) => setPassword(e.target.value),
            disabled: isLoading,
          }),
        ]),

        error && h('div', { className: 'error-message' }, error),

        h(Button, {
          type: 'submit',
          label: isLoading ? 'Signing in...' : 'Sign In',
          variant: 'primary',
          disabled: isLoading,
          className: 'btn-large',
        }),

        h('p', { className: 'auth-footer' }, [
          'Don\'t have an account? ',
          h('a', { href: '/signup' }, 'Sign up'),
        ]),
      ]),
    ]),
  ]);
}
