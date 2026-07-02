import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthShell from '../components/AuthShell';
import NeuField from '../components/NeuField';
import NeuButton from '../components/NeuButton';
import StatusBanner from '../components/StatusBanner';
import { changePassword, clearAuthError } from '../redux/authSlice';

const ChangePassword = () => {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [done, setDone] = useState(false);
  const dispatch = useDispatch();
  const { role, status, authError } = useSelector((s) => s.auth);
  const isPending = status === 'pending';

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (authError) dispatch(clearAuthError());
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(changePassword(form));
    if (result.meta.requestStatus === 'fulfilled') {
      setDone(true);
    }
  };

  return (
    <AuthShell
      eyebrow="Credential update"
      title="Change password"
      subtitle="Confirm your current password to set a new one."
      footer={<Link className="auth-shell__link" to={role === 'admin' ? '/admin' : '/user'}>Back to panel</Link>}
    >
      <form className="auth-shell__body" onSubmit={handleSubmit}>
        {done && <StatusBanner tone="success">Password updated successfully.</StatusBanner>}
        <NeuField label="Current password" type="password" name="oldPassword" value={form.oldPassword} onChange={handleChange} required autoComplete="current-password" />
        <NeuField label="New password" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required autoComplete="new-password" />
        <StatusBanner tone="error">{authError}</StatusBanner>
        <NeuButton type="submit" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update password'}
        </NeuButton>
      </form>
    </AuthShell>
  );
};

export default ChangePassword;
