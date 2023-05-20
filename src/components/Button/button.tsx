import React from "react";
import classNames from 'classnames';

import styles from './button.module.scss';

interface IButtonProps {
    type: string,
    children: React.ReactNode,
    onClick: () => void,
    isDisabled: boolean
}

export function Button({ children, type, isDisabled, onClick }: IButtonProps) {
    const classes = classNames(
        styles.container,
        styles[type],
        {[styles.disabled]: isDisabled}
    );

    return (
        <button className={classes} onClick={onClick}>
            {children}
        </button>
    );
}