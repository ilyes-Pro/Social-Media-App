import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import '../App.css';
import { toast } from 'sonner';
import { Pen, BadgeCheck, BadgeInfo, Upload } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

import useAuthStore from '../Store/AuthStore';

import useUserStore from '../Store/usersStore';

import { Spinner } from './ui/spinner';

export default function ProfleImge() {
  const { loading, UploadProfile } = useAuthStore();
  const { ShowUser, dataUser } = useUserStore();
  const [showPen, setShowPen] = useState({ firstPen: false, secondPen: false });
  const [showImgUpload, setShowImgUpload] = useState({
    imgProfile: null,
    imgCover: null,
  });

  const inputeRefProfile = useRef(null);
  const inputeRefCover = useRef(null);

  useEffect(() => {
    ShowUser();
    console.log('dataUser is fak biiiiitch:', dataUser);
  }, []);

  const handleUploadImage = (e, type) => {
    const file = e.target.files[0];
    console.log(file);

    setShowImgUpload({
      ...showImgUpload,
      [type]: file,
    });
  };

  const UpdatProfile = async () => {
    const result = await UploadProfile({
      img_user: showImgUpload.imgProfile,
      p_img: showImgUpload.imgCover,
      token: user.token,
    });

    toast[result.success ? 'success' : 'error'](
      result.success ? 'Login process completed' : result.message
    );
  };

  return (
    <>
      <div className="relative  ">
        <div
          className="relative h-35 rounded-t-xl overflow-hidden"
          style={{
            backgroundImage: showImgUpload.imgCover
              ? `url(${URL.createObjectURL(showImgUpload.imgCover)})`
              : 'var(--main-gradientBg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          onMouseEnter={() => setShowPen({ ...showPen, firstPen: true })}
          onMouseLeave={() => setShowPen({ ...showPen, firstPen: false })}
        >
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-200
            ${showPen.firstPen ? 'opacity-15' : 'opacity-0'}
          `}
          />

          <Pen
            className={`absolute left-5 bottom-0 -translate-y-1/2
            size-5 text-[var(--color-bg)]
            transition-all duration-200 cursor-pointer
            ${showPen.firstPen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          `}
            onClick={() => inputeRefCover.current.click()}
          />
        </div>

        <Avatar
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2
          size-26 border-white border-4  "
          onMouseEnter={() => setShowPen({ ...showPen, secondPen: true })}
          onMouseLeave={() => setShowPen({ ...showPen, secondPen: false })}
        >
          <AvatarImage
            src={
              showImgUpload.imgProfile
                ? URL.createObjectURL(showImgUpload.imgProfile)
                : undefined
            }
          />

          <AvatarFallback className="bg-(image:--main-gradientBg) text-3xl font-bold text-[var(--color-text)] flex items-center justify-center">
            IL
          </AvatarFallback>

          <div
            className={`absolute inset-0 bg-black transition-opacity duration-200
            ${showPen.secondPen ? 'opacity-15' : 'opacity-0'}
          `}
          />

          <Pen
            className={`absolute left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2
            size-5 text-[var(--color-bg)]
            transition-all duration-200 cursor-pointer
            ${showPen.secondPen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          `}
            onClick={() => inputeRefProfile.current.click()}
          />
        </Avatar>
      </div>
      <CardHeader className="!mt-10 ">
        <CardTitle>{dataUser?.fullname}</CardTitle>
        <CardDescription>{dataUser?.email}</CardDescription>
      </CardHeader>

      <CardContent className="!mt-6">
        <CardFooter className="!mt-2 !px-5 !pb-6">
          <Button className="w-full" onClick={UpdatProfile}>
            {!loading ? 'click Her' : <Spinner className="size-6 text-bg" />}
          </Button>
        </CardFooter>
      </CardContent>
      <input
        type="file"
        className="hidden"
        ref={inputeRefProfile}
        onChange={(e) => handleUploadImage(e, 'imgProfile')}
      />

      <input
        type="file"
        className="hidden"
        ref={inputeRefCover}
        onChange={(e) => handleUploadImage(e, 'imgCover')}
      />
    </>
  );
}
