import { Time } from "./time";
import styles from "./header.module.css";
import { Avatar } from "./Avatar";
import { Config } from "@/config";

type HeaderProps = {
  config: Config;
  className?: string;
};

export function Header({ className, config }: HeaderProps) {
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
