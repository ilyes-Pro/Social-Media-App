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
    <>
      <MobileNav
        className="block md:hidden"
        ButtomSide={ButtomSide}
        activeP={activeP}
        setActiveP={setActiveP}
      />
      <Sidebar
        className="hidden md:block"
        ButtomSide={ButtomSide}
        activeP={activeP}
        setActiveP={setActiveP}
      />
    </>
  );
}
