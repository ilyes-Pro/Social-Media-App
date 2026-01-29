import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from '../ui/sidebar';
import { Button } from '../ui/button';
import logo from '../../assets/logo.svg';
import {
  House,
  UsersRound,
  Search,
  User,
  LogOut,
  CirclePlus,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import PuttomGrop from './PuttomGrop';

export default function Sidebarr({ ButtomSide, activeP, setActiveP }) {
  return (
    <SidebarProvider>
      <div className="bg-bg ">
        <Sidebar className="!p-5 !pt-0">
          <SidebarHeader>
            <img src={logo} className="size-30" />
          </SidebarHeader>

          <SidebarContent className="text-bg/40">
            {ButtomSide.map((a) => (
              <PuttomGrop
                key={a.name}
                mod={'Sidebar'}
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

            <SidebarGroup className="!mt-4">
              <Button
                variant="destructive"
                className="w-full mt-4 h-11 text-md"
              >
                <CirclePlus />
                Create Post
              </Button>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="flex justify-start items-center flex-row border-t-1 gap-3 !pt-3 ">
            <Avatar>
              <AvatarImage
              // src="https://github.com/shadcn.png"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-bold">
                ilyes ouhssine <br />
                <span className="text-xs font-normal text-secand">@ilysoo</span>
              </h3>
            </div>
            <LogOut className="flex-1 cursor-pointer text-secand" size={19} />
          </SidebarFooter>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}
