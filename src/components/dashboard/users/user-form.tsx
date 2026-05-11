'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { User } from '@/lib/types';
import { createOrUpdateAction } from '@/app/actions';

/**
 * If you use shadcn/sonner:
 * npm install sonner
 */
import { useToast } from "@/hooks/use-toast";

interface UserFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User | null;
}

/**
 * Password:
 * - required when creating
 * - optional when editing
 */
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),

  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),

  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),

  password: z
    .string()
    .min(6, {
      message: 'Password must be at least 6 characters.',
    })
    .optional()
    .or(z.literal('')),

  role: z.enum(['ADMIN', 'EDITOR', 'USER']),
});

type FormValues = z.infer<typeof formSchema>;

export function UserForm({
  isOpen,
  setIsOpen,
  user,
}: UserFormProps) {
  const isEditing = Boolean(user?.id);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'USER',
    },
  });
const { toast } = useToast();
  /**
   * Reset form when modal opens
   */
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'USER',
      });
    }
  }, [isOpen, user, form]);

  async function onSubmit(values: FormValues) {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
          toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please login again.",
      });
        return;
      }

      const formData = new FormData();

      /**
       * Only append id when editing
       */
      if (user?.id) {
        formData.append('id', user.id);
      }

      formData.append('model', 'users');
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('email', values.email);
      formData.append('role', values.role);

      /**
       * Only send password if provided
       */
      if (values.password?.trim()) {
        formData.append('password', values.password);
      }

      await createOrUpdateAction(formData, token);

     
    toast({
      title: "Success",
      description: user
        ? "User updated successfully."
        : "User created successfully.",
    });
      form.reset();

      setIsOpen(false);
    } catch (error: any) {
      console.error(error);

     toast({
      variant: "destructive",
      title: "Operation Failed",
      description:
        error?.message || "Something went wrong.",
    });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit User' : 'Add User'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {/* FIRST NAME */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="John"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LAST NAME */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Doe"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password
                    {isEditing && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (optional)
                      </span>
                    )}
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        isEditing
                          ? 'Leave blank to keep current password'
                          : 'Enter password'
                      }
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ROLE */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="ADMIN">
                        Admin
                      </SelectItem>

                      <SelectItem value="EDITOR">
                        Editor
                      </SelectItem>

                      <SelectItem value="USER">
                        User
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit">
                {isEditing ? 'Update User' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}