import { useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import Profiler from './Profile';
import useLikeStore from '../../Store/LikeStore';

export default function ListLike({ open, setOpen, idPost }) {
  const { ShowAllLikeUser, loading, DatalikeUser } = useLikeStore();

  useEffect(() => {
    console.log('id in list like is ', idPost);
    console.log('Data in list like is ', DatalikeUser);
  }, [idPost, DatalikeUser]);
  useEffect(() => {
    if (open) {
      ShowAllLikeUser(idPost);
    }
  }, [open, idPost]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-center !pt-3.5">Like</DialogTitle>
        </DialogHeader>

        <div className="no-scrollbar  !h-[70vh] max-md:!h-[30vh] overflow-y-auto px-4 !pl-4 border-t-2 ">
          {DatalikeUser?.map((user, index) => (
            <Profiler
              key={index}
              size="type2"
              id={user?.id_user}
              userName={user?.username}
              name={user?.fullname}
              profileImg={user?.img_user}
              friend_status={user?.frindshipe}
              friend_request_type={user?.friend_request_type}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
