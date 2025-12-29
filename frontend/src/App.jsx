import './App.css';
import LoginSignUpForPassw_Bage from './components/loginSignUpForPassw_Bage';
import ProtectedRoute from './components/chemas/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/mainPage';
import { Navigate } from 'react-router-dom';
function App() {
  const isLoggedIn = false;
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/MainPage" replace />
            ) : (
              <LoginSignUpForPassw_Bage />
            )
          }
        />

        <Route element={<ProtectedRoute isAllowed={isLoggedIn} />}>
          <Route path="/MainPage" element={<MainPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
