import React from "react";
import * as styles from "./cardComponent.module.css";

const CardComponent = ({ children, header, width }) => {
    return (
        <div className={styles.cardStyles} style={{width: width || "45%"}}>
            <div className={styles.titleStyles}>{header}</div>
            {children}
        </div>
    );
};

export default CardComponent;
