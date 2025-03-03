import { Redirect } from "wouter";
import { Loader } from "../Loader";
import { useAuthStatus } from "../../hooks";
import styles from "./styles.module.scss";

export function GuestOnly(props: React.PropsWithChildren) {
    const status = useAuthStatus();

    if (status === "loading") {
        return <Loader size="big" className={styles.routeGuardLoader} />;
    }

    if (status === "authorized") {
        return <Redirect to="/" />;
    }

    return props.children;
}
