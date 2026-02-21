'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';

// const comments = 14;
import { SendHorizontal } from 'lucide-react';
import useCommentsStore from '../../Store/commentsStore';

export default function CommentPhone({
  isOpen,
  setIsOpen,
  idPost,
  setCommentCont,
}) {
  const { loading, DataComments, ShowAllComments, CreatComments } =
    useCommentsStore();
  const [commentInput, setCommentInput] = useState('');

  const addComment = () => {
    CreatComments({ idPost, body_comment: commentInput, setCommentCont });
    setCommentInput('');
  };
  useEffect(() => {
    if (isOpen) {
      ShowAllComments(idPost);
    }
  }, [isOpen, idPost, DataComments]);

  const openSlider = () => setIsOpen(true);
  const closeSlider = () => setIsOpen(false);

  return (
    <>
      {/* Slider */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 500, damping: 80 }}
            drag="y"
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(event, info) => {
              if (info.offset.y > 200) closeSlider();
            }}
            className="fixed bottom-0 left-0 w-full !h-[calc(100vh-64px)]  bg-white rounded-t-2xl shadow-xl p-4 overflow-y-auto z-50"
          >
            <div>
              <div className="w-screen flex justify-center items-center flex-col gap-2 !mb-3  ">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3 !text-center !my-2 "></div>
                <h1 className="text-center font-bold text-2xl">Comment</h1>
              </div>

              <div className=" !h-[calc(79vh)] overflow-y-auto px-4 !pl-4 flex flex-col gap-4 ">
                {DataComments?.map((comment) => (
                  <div
                    className="flex flex-row gap-1 !pr-3"
                    key={comment.id_comment}
                  >
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
