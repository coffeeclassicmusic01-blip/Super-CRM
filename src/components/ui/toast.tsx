import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { X, CheckCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const TOAST_DURATION = 4000;

const ToastProvider = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Provider>) => (
  <ToastPrimitives.Provider {...props}>
    {children}
  </ToastPrimitives.Provider>
);
ToastProvider.displayName = ToastPrimitives.Provider.displayName;

const ToastViewport = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>) => (
  <ToastPrimitives.Viewport {...props}>
    {children}
  </ToastPrimitives.Viewport>
);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>
>((props, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(
      'flex items-center gap-3 p-4 text-sm font-medium shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=cancel]:animate-out data-[swipe=end]:animate-out data-[state=closed]:duration-300 data-[swipe=cancel]:duration-200 data-[swipe=end]:duration-500 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg',
      props.className,
    )}
    {...props}
  >
    <div className="flex items-center space-x-2">
      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    </div>
    <ToastPrimitives.Title />
    <ToastPrimitives.Description />
    <ToastPrimitives.Close
      className="absolute right-1 top-1 rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
    >
      <X size={16} />
    </ToastPrimitives.Close>
  </ToastPrimitives.Root>
));
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>((props, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn('font-semibold', props.className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>((props, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn('opacity-90', props.className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>((props, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-secondary',
      props.className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>((props, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-1 top-1 rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300',
      props.className,
    )}
    {...props}
  >
    <X size={16} />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  TOAST_DURATION,
};
