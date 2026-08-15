import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "light";
  icon?: boolean;
  className?: string;
  onClick?: () => void;
}

const variants: Record<string, string> = {
  primary:
    "bg-brand-green text-white hover:bg-brand-green-dark focus-visible:outline-white",
  secondary:
    "bg-transparent text-brand-gray-900 border border-brand-gray-900/20 hover:border-brand-green hover:text-brand-green",
  ghost: "bg-transparent text-white border border-white/40 hover:bg-white/10",
  light: "bg-white text-brand-green-dark hover:bg-brand-gray-50",
};

export default function Button({
  children,
  href,
  variant = "primary",
  icon = true,
  className = "",
  onClick,
}: ButtonProps) {
  const classes = `group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 ${variants[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowRight
          size={16}
          strokeWidth={2}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes} type="button">
      {content}
    </button>
  );
}
