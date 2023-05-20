import { useAppSelector } from "../../store";
import { ITasksState } from "../../store/slices/tasksSlice";
import { TasksListItem } from "./TasksListItem/taskslistitem";

import styles from './taskslist.module.scss';

export function TasksList() {
    const data: Array<ITasksState> = useAppSelector(state => state.tasks);

    function getTotalTime() {
        let totalMinutes = 0;
        let totalTomatoes = 0;

        data.map(item => {
            totalTomatoes += item.tomatoes;
        });

        totalMinutes = 25 * totalTomatoes;

        const hours = (totalMinutes / 60);
        const rhours = Math.floor(hours);
        const minutes = (hours - rhours) * 60;
        const rminutes = Math.round(minutes);
        
        return ((rhours > 0 ? rhours + ' час ' : '') + (rminutes > 0 ? rminutes + ' мин' : '')); 
    }

    return (
        <>
            {data && (
                <>
                    <ul className={styles.items}>
                        {data.map(item =>
                            <TasksListItem name={item.name} tomatoes={item.tomatoes} key={item.name} />
                        )}
                    </ul>
                    <p className={styles.totalTime}>
                            {getTotalTime()}
                    </p>
                </>
            )}
        </>
    );
}