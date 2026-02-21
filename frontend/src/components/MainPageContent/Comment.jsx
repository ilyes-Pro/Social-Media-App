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
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import useCommentsStore from '../../Store/commentsStore';

export default function Comment({ open, setOpen, idPost, setCommentCont }) {
  const { loading, DataComments, ShowAllComments, CreatComments } =
    useCommentsStore();
  const [commentInput, setCommentInput] = useState('');

  const addComment = () => {
    CreatComments({ idPost, body_comment: commentInput, setCommentCont });
    setCommentInput('');
  };
  useEffect(() => {
    if (open) {
      ShowAllComments(idPost);
    }
  }, [open, idPost, DataComments]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" h-xl !h-[500px] !gap-0 ">
        <DialogHeader className="gap-0 h-9">
          <DialogTitle className="text-center !pt-3.5">Comment</DialogTitle>
        </DialogHeader>

        <div className=" !h-[65vh] overflow-y-auto px-4 !pl-4 flex flex-col gap-4 ">
          {DataComments?.map((comment) => (
            <div className="flex flex-row gap-1 !pr-3" key={comment.id_comment}>
              <Avatar className="">
                <AvatarImage src={comment.author.img_user} />
                <AvatarFallback>
                  {comment.author.fullname.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className=" border-2 rounded-md !p-1.5 ">
                <h3 className={`text-sm font-bold `}>
                  {comment.author.fullname} <br />
                  <p className="text-xs font-normal text-secand">
                    {comment.body_comment}
                  </p>
                </h3>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="!max-h-8 flex justify-start items-center !w-5/5 !px-3 ">
          <Avatar className="">
            <AvatarImage
            // src="https://github.com/shadcn.png"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="relative flex-1">
            <button
              onClick={addComment}
              disabled={commentInput.trim() === ''}
              className={`absolute right-2 top-2.5 h-5 w-5 text-muted-foreground 
    ${commentInput.trim() !== '' ? 'cursor-pointer fill-red-700' : 'cursor-not-allowed fill-gray-400'}`}
            >
              <SendHorizontal className="h-5 w-5" />
            </button>
            <Input
              id="username"
              placeholder="Comment as ilyes"
              className="!p-2 !pr-7.5"
              onChange={(e) => setCommentInput(e.target.value)}
              value={commentInput}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
