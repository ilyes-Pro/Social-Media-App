// LoginBage.jsx

import VerifyEmail from './VerifyEmail';

import cover from '../assets/soft_abstract_gradient_background_for_modern_ui.png';
import {
  Lock,
  Eye,
  EyeOff,
  Mail,
  User,
  ShieldCheck,
  Contact,
} from 'lucide-react';

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
import { useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  loginSchema,
  SignUpchema,
  ForgotPasswordSchema,
} from './chemas/loginSchema';

export default function LoginSignUpForPassw_Bage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [mod, setMode] = useState('login'); // 'login' or 'signup'
  const [open, setOpen] = useState({
    openFP: false,
    openVerifyEmail: false,
  });

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const signForm = useForm({
    resolver: zodResolver(SignUpchema),
  });
  const ForgotPasswordForm = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = !open.openFP
    ? mod === 'login'
      ? loginForm
      : signForm
    : ForgotPasswordForm;

  const onSubmit = (data) => {
    console.log(`${mod} data:`, data);
    if (mod === 'login') {
      // بعد نجاح تسجيل الدخول
      navigate('/MainPage', { replace: true });
    }
    if (mod === 'signup') {
      setOpen((prev) => ({ ...prev, openVerifyEmail: true }));
    }
  };

  function handlechange_Sign_log() {
    if (!open.openVerifyEmail) {
      if (open.openFP) {
        setOpen((prev) => ({ ...prev, openFP: false }));
      }
      setMode(mod === 'login' ? 'signup' : 'login');
    }
  }
  useEffect(() => {
    console.log('Mode:', mod);
  }, [mod]);

  return (
    <div
      className="min-h-screen bg-cover bg-center "
      style={{ backgroundImage: `url(${cover})` }}
    >
      <div className="flex justify-center items-center h-[100vh]">
        <Card
          className={`w-full max-w-md max-sm:max-w-sm ${
            mod == 'signup' && '!py-2 !gap-5'
          }`}
        >
          <CardHeader>
            <CardTitle>
              {mod === 'login'
                ? !open.openFP
                  ? 'Welcome back'
                  : 'Forget Password'
                : open.openVerifyEmail
                ? 'Verify Email'
                : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {open.openFP
                ? 'Enter your email to reset your password'
                : open.openVerifyEmail
                ? 'Please verify your email to continue'
                : mod === 'login'
                ? 'Enter your email below to login to your account'
                : 'Fill the form below to create an account'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {!open.openVerifyEmail ? (
                <div
                  className={`flex flex-col ${
                    mod == 'signup' ? 'gap-5' : 'gap-7'
                  }`}
                >
                  {/* Signup fields */}
                  {mod === 'signup' && (
                    <>
                      {/* Full Name */}
                      <div className="grid gap-2">
                        <Label htmlFor="fullname">Full name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="fullname"
                            placeholder="Your name"
                            {...register('fullname')}
                          />
                        </div>
                        {errors.fullname && (
                          <Label className="text-red-500 text-sm">
                            {errors.fullname.message}
                          </Label>
                        )}
                      </div>

                      {/* Username */}
                      <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                          <Contact className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="username"
                            placeholder="Your username"
                            {...register('username')}
                          />
                        </div>
                        {errors.username && (
                          <Label className="text-red-500 text-sm">
                            {errors.username.message}
                          </Label>
                        )}
                      </div>
                    </>
                  )}

                  {/* Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        placeholder="name@gmail.com"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <Label className="text-red-500 text-sm">
                        {errors.email.message}
                      </Label>
                    )}
                  </div>

                  {/* Password */}
                  {!open.openFP && (
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
                        {mod === 'login' && (
                          <button
                            type="button"
                            className="ml-auto text-xs underline-offset-4 hover:underline text-puttom"
                            onClick={() =>
                              setOpen((prev) => ({ ...prev, openFP: true }))
                            }
                          >
                            Forgot your password?
                          </button>
                        )}
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
                  )}

                  {/* Confirm Password */}
                  {mod === 'signup' && (
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
                  )}
                </div>
              ) : (
                <VerifyEmail />
              )}
              {!open.openVerifyEmail && (
                <CardFooter className="!mt-5">
                  <Button type="submit" className="w-full">
                    {!open.openFP
                      ? mod === 'login'
                        ? 'Login'
                        : 'Sign Up'
                      : 'Send Reset Link'}
                  </Button>
                </CardFooter>
              )}
            </form>
          </CardContent>
          {!open.openVerifyEmail && (
            <CardDescription>
              {!open.openFP ? (
                <>
                  {mod === 'login'
                    ? "Don't have an account?"
                    : 'Already have an account?'}

                  <Button
                    variant="link"
                    className="text-puttom cursor-pointer"
                    onClick={handlechange_Sign_log}
                  >
                    {!open.openVerifyEmail
                      ? mod === 'login'
                        ? ' Sign Up'
                        : ' Login'
                      : ' sent agin'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="link"
                    className="text-puttom cursor-pointer"
                    onClick={handlechange_Sign_log}
                  >
                    Back to Login
                  </Button>
                </>
              )}
            </CardDescription>
          )}
        </Card>
      </div>
    </div>
  );
}
