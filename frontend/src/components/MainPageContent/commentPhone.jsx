'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';

const comments = 14;
import { SendHorizontal } from 'lucide-react';

export default function CommentPhone({ isOpen, setIsOpen }) {
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
                {Array.from({ length: comments }).map(() => (
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
                          sdfffffffffffffffffffffffff
                          sdfffffffffffffffffffffffffsfsfs fsfsdfdsfsssss sdf
                          random
                        </p>
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="!h-8 flex justify-start items-center !w-5/5 !px-3 gap-2 mt-3 ">
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
