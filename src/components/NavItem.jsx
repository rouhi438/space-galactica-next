"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export function NavItem({ title, link, index }) {
  const currentPath = usePathname();
  const itemClassName =
    `${styles.navbarLinks} ${link === currentPath ? styles.isLinkActive : ""}`.trim();

  return (
    <li className={itemClassName}>
      <Link href={link}>{title}</Link>
    </li>
  );
}
