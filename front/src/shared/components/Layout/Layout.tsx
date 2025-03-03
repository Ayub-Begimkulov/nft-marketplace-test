import styles from "./Layout.module.scss";

export function Layout({ children }: React.PropsWithChildren) {
    return <div className={styles.layout}>{children}</div>;
}
