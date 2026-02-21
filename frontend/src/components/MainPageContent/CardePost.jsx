import { useState, useEffect } from 'react';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import Profiler from './Profile';
import { Heart, MessageCircle } from 'lucide-react';
import ListLike from './listLike';
import Comment from './Comment';
import CommentPhone from './commentPhone';
import useLikeStore from '../../Store/LikeStore';

export default function CardePoat({
  idPost,
  profileImg,
  name,
  userName,
  timePost,
  bodyBost,
  ImgPost,
  countLike,
  CountComment,
  TagPost,
  liked,
}) {
  const [like, setLike] = useState(liked);
  const [likeCont, setLikeCont] = useState(countLike);
  const [likeList, setLikeList] = useState(false);
  const [comment, setComment] = useState(false);
  const [commentCont, setCommentCont] = useState(CountComment);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { AddLikeDislike } = useLikeStore();
  useEffect(() => {
    console.log('id is the fak like ', likeList);
  }, [likeList]);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addlike = () => {
    AddLikeDislike({ idPost, like, setLike, setLikeCont });
  };

  return (
    <div>
      {' '}
      <Card className=" max-w-2xl !px-5 !py-4">
        <CardHeader>
          {/* <CardAction>hollw</CardAction> */}
          <div className="flex flex-row  items-center gap-1.5">
            {' '}
            <Profiler
              size="sm"
              profileImg={profileImg}
              name={name}
              userName={userName}
            />
            <span className="text-secand pb-0.5">.</span>
            <p className="text-xs text-secand">{timePost}</p>
          </div>

          <CardDescription>{bodyBost}</CardDescription>
        </CardHeader>

        <img src={ImgPost} className="rounded-2xl " />
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-start items-center gap-3 ">
            <div className="flex flex-row gap-0.5 group cursor-pointer justify-center items-center">
              <Heart
                size={23}
                className={`${like && 'fill-red-500 '}cursor-pointer transition-color stransition-colors duration-100  group-hover:fill-red-500  group-hover:stroke-red-500 max-md:size-5.5`}
                stroke={!like ? '#6b7290' : 'red'}
                onClick={addlike}
              />
              <p
                className="group-hover:text-red-500  transition-colors duration-100 text-sm max-md:text-xs"
                onClick={() => setLikeList(true)}
              >
                {likeCont}
              </p>
            </div>

            <div className="flex flex-row gap-0.5 group cursor-pointer justify-center items-center">
              <MessageCircle
                size={23}
                color="#6b7290"
                className="transition-colors duration-100 ease-in-out group-hover:fill-blue-500 group-hover:stroke-blue-500 max-md:size-5.5"
                onClick={() => setComment(true)}
              />
              <p className="transition-colors duration-100 ease-in-out group-hover:text-blue-500 text-sm max-md:text-xs">
                {commentCont}
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-1 items-center">
            {TagPost.map((tag, index) => (
              <div
                key={index}
                className="bg-puttom/80 w-19 h-7  max-md:w-12 max-md:h-6 max-md:text-[10px] rounded-xl flex justify-center items-center cursor-pointer text-bg text-xs hover:bg-puttom/70"
              >
                <p>{tag}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <ListLike open={likeList} idPost={idPost} setOpen={setLikeList} />
      {isMobile ? (
        <CommentPhone
          isOpen={comment}
          setIsOpen={setComment}
          idPost={idPost}
          setCommentCont={setCommentCont}
        />
      ) : (
        <Comment
          open={comment}
          setOpen={setComment}
          idPost={idPost}
          setCommentCont={setCommentCont}
        />
      )}
    </div>
  );
}
