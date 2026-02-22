import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { UserPlus, UserX } from 'lucide-react';

export default function Profiler({
  size = 'default',
  id,
  userName,
  name,
  profileImg,
  friend_status,
  friend_request_type,
}) {
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
    </div>
  );
}
