import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { UserPlus, UserX } from 'lucide-react';
import usefolloweStore from '../../Store/followeStore';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '../ui/dialog';
import { useEffect, useState } from 'react';
export default function Profiler({
  size = 'default',
  id,
  userName,
  name,
  profileImg,
  friend_status,
  friend_request_type,
}) {
  const { loading, SendReqAcceptriendship, CancelReqSendRec, Unfriend } =
    usefolloweStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log('this is friend type ', friend_request_type);
    console.log('this is friend Status ', friend_status);
  }, [friend_request_type, friend_status]);
  const Addfriend = () => {
    if (friend_status) {
      console.log('hi bitch');
      setOpen(true);
    } else {
    }
  };
  return (
    <div
      className={`flex  ${size === 'type2' ? ' justify-between ' : 'justify-start'} items-center flex-row gap-3 !pt-3 ${size === 'default' ? 'border-t-1' : ' '}`}
    >
      <div className="flex flex-row gap-1.5 items-center">
        <Avatar className={size === 'sm' ? 'w-9 h-9' : 'w-10 h-10'}>
          <AvatarImage src={profileImg} />
          <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <h3
            className={`text-sm font-bold ${size === 'sm' ? '!text-xs' : '!text-sm'}`}
          >
            {name} <br />
            <span className="text-xs font-normal text-secand">@{userName}</span>
          </h3>
        </div>
      </div>
      {size === 'default' && (
        <LogOut className="flex-1 cursor-pointer text-secand" size={19} />
      )}

      {size === 'type2' && (
        <Button
          variant="outline"
          className="ml-auto !h-7 !px-3 !text-sm !mr-4 cursor-pointer"
          onClick={Addfriend}
        >
          {friend_status
            ? 'Friend'
            : friend_request_type == 'sent'
              ? 'Request Sent'
              : friend_request_type === 'received'
                ? 'Accept Request'
                : 'Add Friend'}
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
