import { TonConnectButton } from "@tonconnect/ui-react";
import styles from "./Login.module.scss";

export function Login() {
    return (
        <div className={styles.loginPage}>
            <h1 className={styles.loginPageHeading}>
                You must connect your wallet to view NFTs
            </h1>
            <TonConnectButton />
        </div>
    );
}
