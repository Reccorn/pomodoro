import { useEffect, useRef, useState } from 'react';
import { EIcons, Icon } from '../Icon/icon';
import { ISelectProps } from '../StatsContent/StatsHead/statshead';
import styles from './select.module.scss';
import classNames from 'classnames';

const options: Array<string> = [
    'Эта неделя',
    'Прошедшая неделя',
    '2 недели назад',
];

export function Select({ selectValue, onClick }: ISelectProps) {
    const [isActive, setActive] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const classes = classNames(
        styles.outer,
        {[styles.active]: isActive}
    )

    let selectedValue = '';

    for (let i = 0; i < options.length; i++) {
        if (i === selectValue) {
            selectedValue = options[i];
        }
    }

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (e.target instanceof Node && !selectRef.current?.contains(e.target))
                setActive(false);
        }

        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, []);

    return (
        <div className={classes} ref={selectRef}>
            <div className={styles.head} onClick={() => setActive(!isActive)}>
                {selectedValue}
                <Icon name={EIcons.arrow} />
            </div>
            <div className={styles.list}>
                {options &&
                    options.map((item, index) => {
                        if (item !== selectedValue) {
                            return (
                                <div key={index} onClick={() => onClick(index)}>{item}</div>
                            );
                        }
                    })
                }
            </div>
        </div>
    );
}