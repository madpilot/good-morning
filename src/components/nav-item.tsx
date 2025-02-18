import { headers } from "next/headers";
import Link from "next/link";
import styles from "./nav-item.module.css";

type NavItemProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export default async function NavItem({
  href,
  children,
  className,
}: NavItemProps) {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  const classNames = className?.split(" ") ?? [];
  if (pathname === href) {
    classNames.push(styles.active);
  }

  return (
    <Link href={href} className={classNames.join(" ")}>
      {children}
    </Link>
  );
}
