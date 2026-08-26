import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  // Ruta interna de la SPA: si viene, navega con react-router (sin recargar
  // la página) en vez de usar una ancla normal. `href` sigue sirviendo para
  // anclas "#seccion" y enlaces externos.
  to?: string;
  target?: string;
  rel?: string;
  variant?: "primary" | "secondary" | "ghost" | "light";
  icon?: boolean;
  className?: string;
  onClick?: () => void;
}

const variants: Record<string, string> = {
  primary:
    "bg-brand-green text-white shadow-[0_10px_24px_-8px_rgba(41,149,39,0.55)] hover:-translate-y-0.5 hover:bg-brand-green-dark hover:shadow-[0_14px_28px_-8px_rgba(23,107,36,0.6)] focus-visible:outline-white",
  secondary:
    "bg-transparent text-brand-gray-900 border border-brand-gray-900/20 hover:border-brand-green hover:text-brand-green",
  ghost: "bg-transparent text-white border border-white/40 hover:bg-white/10",
  light: "bg-white text-brand-green-dark shadow-[0_10px_24px_-8px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:bg-brand-gray-50",
};

export default function Button({
  children,
  href,
  to,
  target,
  rel,
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

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
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
