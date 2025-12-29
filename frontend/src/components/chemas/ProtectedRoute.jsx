import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ isAllowed, redirectPath = '/' }) {
  if (!isAllowed) {
    alert("you can't enter this page ,go away bitch");
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
