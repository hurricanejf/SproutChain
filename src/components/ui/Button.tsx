import clsx from "clsx";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, variant = "primary", ...props }: ButtonProps) {
  const base =
    "px-5 py-3 rounded-lg font-semibold transition shadow disabled:opacity-50";

  const styles = {
    primary: "bg-green-500 text-black hover:bg-green-400",
    secondary:
      "bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-green-400",
    ghost: "text-zinc-400 hover:text-green-400",
  };

  return (
    <button {...props} className={clsx(base, styles[variant], props.className)}>
      {children}
    </button>
  );
}
