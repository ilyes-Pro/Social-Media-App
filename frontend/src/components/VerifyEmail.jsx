import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

export default function VerifyEmail() {
  const [otp, setOtp] = useState('');
  const [time, setTime] = useState(0.2 * 60);
  const navigate = useNavigate();
  const isvalide = otp.length == 6;

  const handlechange_Sign_log = () => {
    setTime(0.2 * 60);
    setOtp('');
  };

  useEffect(() => {
    if (time === 0) return;

    const id = setTimeout(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(id); // cleanup
  }, [time]);

  // useEffect(() => {
  //   button?.(otp);
  // }, [otp, button]);
  useEffect(() => {
    console.log(otp);
  }, [otp]);
  return (
    <>
      <p className="text-center !mb-3 !font-main font-normal text-secand">
        {Math.floor(time / 60)} : {time % 60}
      </p>
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        renderInput={(props) => (
          <input
            {...props}
            type="number"
            inputMode="numeric"
            className="!w-15 !h-15 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-puttom focus:ring-2 focus:ring-amber-50 transition-all outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        )}
        containerStyle="flex justify-center gap-1.5"
        inputStyle="otp-input"
        shouldAutoFocus
      />

      <CardFooter className="!mt-5">
        <Button
          type="submit"
          className="w-full"
          disabled={!isvalide}
          onClick={() => navigate('/MainPage', { replace: true })}
        >
          Sign Up
        </Button>
      </CardFooter>
      <CardDescription>
        <Button
          variant="link"
          className="text-puttom cursor-pointer !mt-5"
          onClick={handlechange_Sign_log}
        >
          sent agin
        </Button>
      </CardDescription>
    </>
  );
}
