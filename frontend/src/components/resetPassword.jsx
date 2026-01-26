import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordF } from './chemas/loginSchema';
import useAuthStore from '../Store/AuthStore';
import { toast } from 'sonner';
import { Spinner } from './ui/spinner';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [showCheckMark, setShowCheckMark] = useState(false);
  const { resetPassword, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const ResetPasswordForm = useForm({
    resolver: zodResolver(resetPasswordF),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = ResetPasswordForm;

  const onSubmit = async (data) => {
    if (!showCheckMark) {
      console.log('Reset Password data GG: ', data.password);
      console.log('Token: ', token);
      console.log('Email: ', email);
      console.log('loading:', loading);
      const result = await resetPassword({
        email: email,
        password: data.password,
        token,
      });
      toast[result.success ? 'success' : 'error'](
        result.success ? 'the link is Sent to you Email' : result.message
      );
      setShowCheckMark(result.success);
    } else {
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    setEmail(localStorage.getItem('forgetPassword') || '');
  }, []);
  return (
    <Card className="w-full max-w-md max-sm:max-w-sm !gap-7 relative">
      <CardHeader>
        <CardTitle>Reset your Password</CardTitle>

        <CardDescription>
          {!showCheckMark
            ? ''
            : 'Return to login page in order to enter Website'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {showCheckMark ? (
            <DotLottieReact
              src="https://lottie.host/e1a78101-f665-47bb-acd2-dcd1b134bbe9/AoRhzLSCDK.lottie"
              autoplay
            />
          ) : (
            <div className="flex flex-col gap-7">
              {/* Password */}

              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </button>
                </div>
                {errors.password && (
                  <Label className="text-red-500 text-sm">
                    {errors.password.message}
                  </Label>
                )}
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && (
                  <Label className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </Label>
                )}
              </div>
            </div>
          )}

          <CardFooter className="!mt-9">
            <Button type="submit" className="w-full">
              {loading ? (
                <Spinner className="size-6 text-bg" />
              ) : !showCheckMark ? (
                'Submit'
              ) : (
                'the Login page '
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
