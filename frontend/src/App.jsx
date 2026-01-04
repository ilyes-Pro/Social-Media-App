import './App.css';
import LoginSignUpForPassw_Bage from './components/loginSignUpForPassw_Bage';
import ProtectedRoute from './components/chemas/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/mainPage';
import { Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';

//API
import useAuthStore from './Store/AuthStore';

function App() {
  const { statusUser } = useAuthStore();
  console.log('Auth Status:', statusUser.statusUS);
  return (
    <>
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route
          path="/"
          element={
            statusUser.statusUS ? (
              <Navigate to="/MainPage" replace />
            ) : (
              <LoginSignUpForPassw_Bage />
            )
          }
        />

        <Route element={<ProtectedRoute isAllowed={statusUser.statusUS} />}>
          <Route path="/MainPage" element={<MainPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
