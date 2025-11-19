'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

function ResetPasswordComponent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  React.useEffect(() => {
    if (!token) {
      setError(
        'No reset token found. Please check your URL or request a new link.'
      );
    }
  }, [token]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) return;
    setIsLoading(true);
    try {
      await api.post('auth/reset-password', {
        token,
        password: values.password,
      });
      setIsSuccess(true);
      toast({
        title: 'Success!',
        description: 'Your password has been successfully reset.',
      });
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.message.includes('Invalid') || error.message.includes('expired')
          ? 'This reset link is invalid or has expired.'
          : 'An unexpected error occurred. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Password Reset Failed',
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center text-destructive">
          <p>{error}</p>
          <Button variant="link" asChild className="mt-4">
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="text-center">
          <p className="text-muted-foreground">
            Your password has been successfully reset.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Proceed to Login</Link>
          </Button>
        </div>
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading || !token}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </form>
      </Form>
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordComponent />
    </React.Suspense>
  );
}
