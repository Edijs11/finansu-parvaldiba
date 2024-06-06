'use client';

import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { email } from '../models/shemas';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

type TContactFormShema = z.infer<typeof email>;

const ContactUs = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
      await axios.post(`${apiUrl}/api/send`, {
        subject: data.subject,
        type: data.type,
        message: data.message,
      });
      reset();
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
      <h1 className="flex flex-col items-center text-3xl">Sazinies ar mums!</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-6">
        <div className="mt-4">Temats</div>
        <select {...register('type')} className="text-black rounded-sm">
          <option>Ieteikums</option>
          <option>Sūdzība</option>
          <option>Cits</option>
        </select>

        <div className="mt-4">Virsraksts</div>
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

        <div className="mt-4">Apraksts</div>
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
