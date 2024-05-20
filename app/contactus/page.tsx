'use client';

import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import axios from 'axios';
import { useState } from 'react';
import { email } from '../lib/shemas';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type TContactFormShema = z.infer<typeof email>;

const ContactUs = () => {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TContactFormShema>({
    resolver: zodResolver(email),
  });
  const onSubmit: SubmitHandler<TContactFormShema> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const email = await axios.post(`http://localhost:3000/api/send`, {
        subject: data.subject,
        message: data.message,
      });
      reset(data);
    } catch (error) {
      console.error('Error sending email', error);
    }
  };
  if (isLoading)
    return (
      <div className="flex flex-col items-center p-6">
        <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125]" />
      </div>
    );
  return isAuthenticated ? (
    <div className="mx-auto max-w-md mt-10">
      <h1 className="text-2xl">Sazinies ar mums!</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-6">
        <label htmlFor="subject">Ziņas iemesls</label>
        <input
          id="subject"
          {...register('subject')}
          type="text"
          placeholder="Tēma"
          className="text-black rounded-sm"
        />
        {errors.subject && (
          <p className="text-red-500">{`${errors.subject.message}`}</p>
        )}
        {/* <label className="mt-4">Message type</label>
        <select className="text-black rounded-sm" required>
          <option>some</option>
        </select> */}
        <label htmlFor="message" className="mt-4">
          Apraksts
        </label>
        <textarea
          id="message"
          {...register('message')}
          placeholder="Apraksts"
          rows={4}
          className="text-black rounded-sm"
        />
        {errors.message && (
          <p className="text-red-500">{`${errors.message.message}`}</p>
        )}
        <button
          type="submit"
          className="p-2 bg-green-500 hover:bg-green-600 rounded text-white w-[120px] mt-4 place-self-end"
        >
          Nosūtīt
        </button>
      </form>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-between">
      <h1 className="mt-6">You must be logged in!</h1>
      <LoginLink className="mt-4">Login</LoginLink>
    </div>
  );
};
export default ContactUs;
