import { TasksListMenu } from './TasksListMenu/taskslistmenu';
import styles from './taskslistitem.module.scss';

interface ITaskItemProps {
    name: string,
    tomatoes: number
}

export function TasksListItem({ name, tomatoes }: ITaskItemProps) {
    return (
        <li className={styles.wrapper}>
            <span className={styles.tomatoes}>{tomatoes}</span>
            {name}
            <TasksListMenu name={name} />
        </li>
    );
}