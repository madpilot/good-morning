import styles from "./avatar.module.css";
type AvatarProps = {
  name: string;
  color: string | undefined;
  className?: string;
};

export function Avatar({ color, name, className }: AvatarProps) {
  return (
    <div
      className={`${styles.avatar} ${className ? className : ""}`}
      title={name}
      style={color ? { backgroundColor: color } : {}}
    >
      {name.substring(0, 1)}
    </div>
  );
}
