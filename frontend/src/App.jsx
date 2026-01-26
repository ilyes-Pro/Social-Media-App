import './App.css';

import { ProtectedRoute, GuestRoute } from './components/chemas/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/mainPage';

import { Toaster } from './components/ui/sonner';
import AuthPage from './components/AuthPage';
//API
import useAuthStore from './Store/AuthStore';
import ResetPassword from './components/resetPassword';
import LoginSignUpForPassw_Bage from './components/loginSignUpForPassw_Bage';
import useDarkmod from './Store/darkModSroe';
function App() {
  const { statusUser } = useAuthStore();

  console.log('Auth Status:', statusUser.statusUS);
  return (
    <>
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route element={<GuestRoute isAllowed={statusUser.statusUS} />}>
          <Route path="/" element={<AuthPage />}>
            <Route index element={<LoginSignUpForPassw_Bage />} />
            <Route path="resetPassword/:token" element={<ResetPassword />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute isAllowed={statusUser.statusUS} />}>
          <Route path="/MainPage" element={<MainPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
