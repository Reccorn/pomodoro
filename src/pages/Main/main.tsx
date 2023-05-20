import { TaskManager } from '../../components/TaskManager/taskmanager';
import { TimerBox } from '../../components/TimerBox/timerbox';
import styles from './main.module.scss';

export default function Main() {
    return (
        <section className={styles.content}>
            <div className={styles.item}>
                <TaskManager />
            </div>
            <div className={styles.item}>
                <TimerBox />
            </div>
        </section>
    );
}