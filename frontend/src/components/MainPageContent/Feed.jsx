import CardePoat from './CardePost';
import React from 'react';
import { useState, useEffect } from 'react';
import useDataPosts from '../../Store/PostsStore';

export default function Sidebar() {
  const { ShowAllPosts, loading, DataPosts } = useDataPosts();

  useEffect(() => {
    ShowAllPosts();
  }, []);

  return (
    <div className="flex flex-col gap-8 ">
      {!loading
        ? DataPosts.map((post, index) => (
            <CardePoat
              key={index}
              idPost={post?.id_post}
              profileImg={post.author?.img_user}
              name={post.author?.fullname}
              userName={post.author?.username}
              timePost={post?.created_at}
              bodyBost={post?.body_post}
              ImgPost={post?.img_post}
              countLike={post?.like}
              CountComment={post?.comments_count}
              liked={post?.liked}
              TagPost={post?.tags}
            />
          ))
        : 'No Posts found'}
    </div>
  );
}
