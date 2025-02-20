import NavItem from "@/components/nav-item";
import "./layout.css";
import styles from "./layout.module.css";
import { Header } from "@/components/header";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className={styles.layout}>
          <Header className={styles.header} />
          <nav className={styles.nav}>
            <li className={styles.navItem}>
              <NavItem href="/" className={styles.navLink}>
                Dashboard
              </NavItem>
            </li>
            <li className={styles.navItem}>
              <NavItem href="/calendar" className={styles.navLink}>
                Calendar
              </NavItem>
            </li>
          </nav>
          <section className={styles.main}>{children}</section>
        </div>
      </body>
    </html>
  );
}
