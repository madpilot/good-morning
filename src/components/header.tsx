import { Time } from "./time";
import styles from "./header.module.css";
import { Avatar } from "./Avatar";
import { readConfig } from "@/config";

type HeaderProps = {
  className?: string;
};

export async function Header({ className }: HeaderProps) {
  const config = await readConfig();
  return (
    <header className={`${styles.header} ${className ?? ""}`}>
      <h1 className={styles.name}>{config.title}</h1>
      <Time className={styles.time} />
      <div className={styles.avatars}>
        {config.users.map((user) => (
          <Avatar
            color={user.color}
            name={user.name}
            key={user.name}
            className={styles.avatar}
          />
        ))}
      </div>
    </header>
  );
}
