import { Select } from '../../Select/select';
import styles from './statshead.module.scss';

export interface ISelectProps {
    selectValue: number,
    onClick: (arg0: number) => void
}

export function StatsHead({ selectValue, onClick }: ISelectProps) {
    return (
        <div className={styles.wrapper}>
            <h2 className="h2">
                Ваша активность
            </h2>
            <Select selectValue={selectValue} onClick={onClick} />
        </div>
    );
}