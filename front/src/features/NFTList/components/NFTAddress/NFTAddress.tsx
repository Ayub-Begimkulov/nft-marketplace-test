import { useEffect, useState } from "react";
import CopyIcon from "../../../../shared/assets/images/icons/copy.svg?react";
import CheckIcon from "../../../../shared/assets/images/icons/check.svg?react";
import { shortAddress } from "../../utils";
import styles from "./NFTAddress.module.scss";
import clsx from "clsx";

export function NFTAddress({
    name,
    address,
}: {
    name: string;
    address: string;
}) {
    const [isChecked, setIsChecked] = useState(false);

    const handleCopyClick = () => {
        if (isChecked) {
            return;
        }

        navigator.clipboard.writeText(address).then(() => {
            setIsChecked(true);
        });
    };

    useEffect(() => {
        if (!isChecked) {
            return;
        }

        const timeoutId = setTimeout(() => {
            setIsChecked(false);
        }, 3_000);

        return () => clearTimeout(timeoutId);
    }, [isChecked]);

    return (
        <div className={styles.nftAddress}>
            <div className={styles.nftAddressName}>{name}:</div>
            <div className={styles.nftAddressValue}>
                <span className={styles.nftAddressValueText}>
                    {shortAddress(address)}
                </span>
                <button
                    className={styles.nftAddressCopyButton}
                    onClick={handleCopyClick}
                >
                    <CheckIcon
                        className={clsx(
                            styles.nftAddressIcon,
                            styles.nftAddressIconCheck,
                            isChecked && styles.nftAddressIconCheck_checked,
                        )}
                    />
                    <CopyIcon
                        className={clsx(
                            styles.nftAddressIcon,
                            styles.nftAddressIconCopy,
                            isChecked && styles.nftAddressIconCopy_checked,
                        )}
                    />
                </button>
            </div>
        </div>
    );
}
