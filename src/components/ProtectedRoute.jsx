import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Access rules per the API doc: a "user" role may only reach /user,
// while "admin" may reach both /user and /admin.
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { token, role } = useSelector((s) => s.auth);

  if (!token) return <Navigate to="/login" replace />;
  if (requireAdmin && role !== 'admin') return <Navigate to="/user" replace />;

  return children;
};

export default ProtectedRoute;
