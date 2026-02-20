import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import { SendHorizontal } from 'lucide-react';
import { Input } from '../ui/input';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function Comment({ open, setOpen }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" h-xl !h-[500px] !gap-0 ">
        <DialogHeader className="gap-0 h-9">
          <DialogTitle className="text-center !pt-3.5">Comment</DialogTitle>
        </DialogHeader>

        <div className=" !h-[65vh] overflow-y-auto px-4 !pl-4 flex flex-col gap-4 ">
          <div className="flex flex-row gap-1 !pr-3">
            <Avatar className="">
              <AvatarImage
              // src="https://github.com/shadcn.png"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className=" border-2 rounded-md !p-1.5 ">
              <h3 className={`text-sm font-bold `}>
                ilyes ouhssine <br />
                <p className="text-xs font-normal text-secand">
                  hi My name is ilyes , and I livne in the Us
                  sdfffffffffffffffffffffffff sdfffffffffffffffffffffffffsfsfs
                  fsfsdfdsfsssss sdf random
                </p>
              </h3>
            </div>
          </div>

          <div className="flex flex-row gap-1 !pr-3">
            <Avatar className="">
              <AvatarImage
              // src="https://github.com/shadcn.png"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className=" border-2 rounded-md !p-1.5 ">
              <h3 className={`text-sm font-bold `}>
                ilyes ouhssine <br />
                <p className="text-xs font-normal text-secand">
                  hi My name is ilyes , and I livne in the Us
                  sdfffffffffffffffffffffffff sdfffffffffffffffffffffffffsfsfs
                  fsfsdfdsfsssss sdf random
                </p>
              </h3>
            </div>
          </div>
        </div>

        <DialogFooter className="!max-h-8 flex justify-start items-center !w-5/5 !px-3 ">
          <Avatar className="">
            <AvatarImage
            // src="https://github.com/shadcn.png"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="relative flex-1">
            <SendHorizontal className="absolute right-2 top-2.5 h-5 w-5 text-muted-foreground cursor-pointer" />
            <Input
              id="username"
              placeholder="Comment as ilyes"
              className="!p-2 !pr-7.5"
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
