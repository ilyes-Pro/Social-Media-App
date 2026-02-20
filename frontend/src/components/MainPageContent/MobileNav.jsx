import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
} from 'lucide-react';

import logo from '../../assets/logo.svg';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  House,
  UsersRound,
  Search,
  User,
  LogOut,
  CirclePlus,
} from 'lucide-react';
import { Button } from '../ui/button';
import PuttomGrop from './PuttomGrop';
export default function MobileNav({
  className,
  ButtomSide,
  activeP,
  setActiveP,
}) {
  return (
    <div className={`${className} `}>
      <div className="w-full h-16 fixed bg-bg top-0 right-0 !px-5">
        <div className="flex justify-between items-center h-[100%]">
          <img src={logo} className="size-25" />
          <div className="flex flex-row justify-center items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    {/* <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="shadcn"
                      /> */}
                    <AvatarFallback>IL</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User />
                    profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOutIcon />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <div>
              <h3 className="text-sm font-bold">
                ilyes ouhssine <br />
                <span className="text-xs font-normal text-secand">@ilysoo</span>
              </h3>
            </div> */}
            {/* <LogOut className="flex-1 cursor-pointer text-secand" size={16} /> */}
          </div>
        </div>
      </div>

      <div className="w-full h-18 fixed bg-bg bottom-0 right-0">
        <Button
          variant="destructive"
          className="w-full mt-4 h-11 text-md size-14 !rounded-4xl absolute left-1/2 -translate-1/2 cursor-pointer z-30"
        >
          <CirclePlus size={40} />
        </Button>

        <div className="flex flex-row justify-around items-center h-[100%]">
          {ButtomSide.map((a) => (
            <PuttomGrop
              key={a.name}
              mod={'mobile'}
              name={a.name}
              Img={a.Img}
              Active={activeP[a.name]}
              onClick={() => {
                setActiveP((prev) => ({
                  // ...prev,
                  [a.name]: !prev[a.name],
                }));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
