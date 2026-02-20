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
import Profiler from './Profile';
import PuttomGrop from './PuttomGrop';

import useUsersStore from '../../Store/usersStore';
import { useEffect } from 'react';

export default function Sidebarr({ ButtomSide, activeP, setActiveP }) {
  const { ShowUser, dataUser } = useUsersStore();

  useEffect(() => {
    ShowUser();
  }, []);
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

          <SidebarFooter>
            <Profiler
              profileImg={dataUser?.p_img}
              name={dataUser?.fullname}
              userName={dataUser?.username}
            />
          </SidebarFooter>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}
