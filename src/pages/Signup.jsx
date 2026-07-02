import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthShell from '../components/AuthShell';
import NeuField from '../components/NeuField';
import ClearanceToggle from '../components/ClearanceToggle';
import NeuButton from '../components/NeuButton';
import StatusBanner from '../components/StatusBanner';
import { registerUser, clearAuthError } from '../redux/authSlice';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, authError } = useSelector((s) => s.auth);
  const isPending = status === 'pending';

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (authError) dispatch(clearAuthError());
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/login', { state: { justRegistered: true } });
    }
  };

  return (
    <AuthShell
      eyebrow="New credential"
      title="Request access"
      subtitle="Register a credential to enter the vault."
      footer={
        <>
          Already cleared? <Link className="auth-shell__link" to="/login">Sign in</Link>
        </>
      }
    >
      <form className="auth-shell__body" onSubmit={handleSubmit}>
        <NeuField label="Full name" name="name" value={form.name} onChange={handleChange} required autoComplete="name" />
        <NeuField label="Email" type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" />
        <NeuField label="Password" type="password" name="password" value={form.password} onChange={handleChange} required autoComplete="new-password" />
        <ClearanceToggle value={form.role} onChange={(role) => setForm((f) => ({ ...f, role }))} />
        <StatusBanner tone="error">{authError}</StatusBanner>
        <NeuButton type="submit" disabled={isPending}>
          {isPending ? 'Registering…' : 'Create credential'}
        </NeuButton>
      </form>
    </AuthShell>
  );
};

export default Signup;
