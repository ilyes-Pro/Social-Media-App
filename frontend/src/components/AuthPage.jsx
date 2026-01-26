import cover from '../assets/soft_abstract_gradient_background_for_modern_ui.png';

import { Outlet } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
//API
import useDarkmod from '../Store/darkModSroe';
import { useEffect } from 'react';

export default function AuthPage() {
  const { Mod, ShowDarkmod, HandlDarkMode } = useDarkmod();

  useEffect(() => {
    ShowDarkmod();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${cover})` }}
    >
      <div className="absolute inset-0 bg-bg/30 transition-opacity duration-200" />

      <div className="absolute right-5 top-6 bg-bg/50 hover:bg-bg/90 hover:transition size-11 flex justify-center items-center rounded-3xl cursor-pointer ">
        {!Mod ? (
          <Sun
            size={20}
            onClick={() => {
              HandlDarkMode();
            }}
          />
        ) : (
          <Moon
            size={20}
            onClick={() => {
              HandlDarkMode();
            }}
          />
        )}
      </div>

      <div className="flex justify-center items-center min-h-screen overflow-y-auto ">
        <Outlet />
      </div>
    </div>
  );
}
