import { Link } from 'react-router-dom';
import styles from './header.module.scss';
import { EIcons, Icon } from '../Icon/icon';

export default function Header() {
    return (
        <div className={styles.wrapper}>
            <div className="container">
                <div className={styles.content}>
                    <Link to={'/'} className={styles.logo + ' h1'}>
                        <Icon name={EIcons.logo} />
                        pomodoro_box
                    </Link>
                    <Link to={'/stats'} className={styles.toStats}>
                        <Icon name={EIcons.stats} />
                        Статистика
                    </Link>
                </div>
            </div>
        </div>
    );
}