import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute({ isAllowed, redirectPath = '/' }) {
  if (!isAllowed) {
    // alert("you can't enter this page ,go away bitch");
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}

export function GuestRoute({ isAllowed }) {
  return isAllowed ? <Navigate to="/MainPage" replace /> : <Outlet />;
}
