import MobileNav from './MobileNav';
import Sidebar from './Sidebar';
import { useState } from 'react';
import {
  House,
  UsersRound,
  Search,
  User,
  LogOut,
  CirclePlus,
} from 'lucide-react';
import { Outlet } from 'react-router-dom';
export default function NavePar() {
  const ButtomSide = [
    { name: 'Feed', Img: House },
    { name: 'Connection', Img: UsersRound },
    { name: 'Discover', Img: Search },
    { name: 'Profile', Img: User },
  ];
  const [activeP, setActiveP] = useState({
    [ButtomSide[0].name]: false,
  });
  return (
    <div className=" bg-bg2 flex flex-row w-screen h-screen gap-39 max-md:gap-0 ">
      <Sidebar
        className="hidden md:block "
        ButtomSide={ButtomSide}
        activeP={activeP}
        setActiveP={setActiveP}
      />

      <MobileNav
        className="fixed bottom-0 left-0 w-full md:hidden"
        ButtomSide={ButtomSide}
        activeP={activeP}
        setActiveP={setActiveP}
      />
      <div className=" flex-1 overflow-y-auto !mt-8 max-md:!px-3">
        <h1 className="text-3xl font-bold !mb-4 max-md:!mt-13">Feed</h1>
        <Outlet />
      </div>
    </div>
  );
}
