import clsx from "clsx";
import styles from "./styles.module.scss";

type LoaderProps = {
    size?: "small" | "medium" | "big";
    className?: string;
};

export function Loader({ size = "medium", className }: LoaderProps) {
    return (
        <div className={styles.loader}>
            <div
                className={clsx(styles.loaderSpinner, className, {
                    [styles.loaderSpinner_small]: size === "small",
                    [styles.loaderSpinner_medium]: size === "medium",
                    [styles.loaderSpinner_big]: size === "big",
                })}
            />
        </div>
    );
}
