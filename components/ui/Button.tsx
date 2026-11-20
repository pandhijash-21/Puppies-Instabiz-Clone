import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ComponentProps } from "react";

type Variant = "primary" | "ghost" | "whatsapp";

const variants: Record<Variant, string> = {
  primary: "btn btn-primary",
  ghost: "btn btn-ghost",
  whatsapp: "btn btn-whatsapp",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button className={cn(variants[variant], "focus-ring", className)} {...props} />
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  href,
  ...props
}: Omit<ComponentProps<typeof Link>, "href" | "className"> & {
  variant?: Variant;
  href: string;
  className?: string;
}) {
  const external = href.startsWith("http") || href.startsWith("https");
  if (external) {
    return (
      <a
        href={href}
        className={cn(variants[variant], "focus-ring", className)}
        {...(props as ComponentProps<"a">)}
      />
    );
  }
  return (
    <Link
      href={href}
      className={cn(variants[variant], "focus-ring", className)}
      {...props}
    />
  );
}
