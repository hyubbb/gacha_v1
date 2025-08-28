'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/ui/shadcn/input';
import { Button } from '@/shared/ui/shadcn/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LoginSchema = z.object({
  username: z
    .string()
    .min(3, '아이디는 3자 이상 입력해 주세요.')
    .max(50, '아이디는 50자 이하로 입력해 주세요.'),
  password: z
    .string()
    .min(3, '비밀번호는 3자 이상 입력해 주세요.')
    .max(50, '비밀번호는 50자 이하로 입력해 주세요.'),
  errorMessage: z.string().optional()
});

type LoginForm = z.infer<typeof LoginSchema>;

export const LoginWidget = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    setError,
    watch
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange' // 입력 즉시 유효성 검사 (blur만 원하면 'onBlur')
  });

  const values = watch();

  const onSubmit = async (values: LoginForm) => {
    // 실제 인증 요청 (예: /api/login)
    // const res = await fetch('/api/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(values),
    //   credentials: 'include',
    // })

    // if (!res.ok) {
    //   // 서버에서 자격 증명 오류 시 폼 에러로 반영
    //   setError('username', { type: 'server', message: '아이디 또는 비밀번호가 올바르지 않습니다.' })
    //   setError('password', { type: 'server', message: '아이디 또는 비밀번호가 올바르지 않습니다.' })
    //   return
    // }

    // 1초 로딩 후 로그인
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (values.username === 'admin' && values.password === 'admin') {
      router.replace('/display');
    } else {
      setError('errorMessage', {
        type: 'server',
        message: '아이디 또는 비밀번호가 올바르지 않습니다.'
      });
      return;
    }
  };

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col items-center justify-center gap-4 px-4">
      <div className="flex w-full flex-col items-start gap-2">
        <h1 className="text-2xl font-bold">
          안녕하세요 <br /> 가챠 입니다.
        </h1>
        <h3 className="text-dark-60 text-lg">
          서비스를 이용하기 위해 로그인을 진행해 주세요
        </h3>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-3"
        noValidate
      >
        <div className="w-full">
          <Input
            type="text"
            placeholder="아이디를 입력"
            className="h-12"
            autoComplete="username"
            aria-invalid={!!errors.username}
            {...register('username')}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="relative w-full">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력"
            className="h-12 pr-12"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {values?.password?.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-0 right-3 h-full text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none"
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
        {errors.errorMessage && (
          <p className="mt-1 text-sm text-red-500">
            {errors.errorMessage.message}
          </p>
        )}

        <Button
          type="submit"
          className="h-12 w-full"
          disabled={isSubmitting || !isDirty || !isValid}
        >
          {isSubmitting ? '로그인 중…' : '로그인'}
        </Button>
      </form>
    </div>
  );
};
