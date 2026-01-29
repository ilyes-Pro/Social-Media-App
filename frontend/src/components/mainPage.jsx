import { Routes, Route } from 'react-router-dom';
import NavePar from './MainPageContent/NavePar';
import Feed from './MainPageContent/Feed';

export default function MainPage() {
  return (
    <div className="!bg-bg2 h-screen">
      <Routes>
        <Route element={<NavePar />}>
          <Route index element={<Feed />} />
          {/* <Route path="Connections" element={<Connections />} />
        <Route path="Discover" element={<Discover />} />
        <Route path="Profile" element={<Profile />} /> */}
        </Route>
      </Routes>
    </div>
  );
}
