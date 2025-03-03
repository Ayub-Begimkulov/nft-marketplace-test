import { Redirect } from "wouter";
import { Loader } from "../Loader";
import { useAuthStatus } from "../../hooks";
import styles from "./styles.module.scss";

export function AuthOnly(props: React.PropsWithChildren) {
    const status = useAuthStatus();

    if (status === "loading") {
        return <Loader size="big" className={styles.routeGuardLoader} />;
    }

    if (status === "unauthorized") {
        return <Redirect to="/login" />;
    }

    return props.children;
}
