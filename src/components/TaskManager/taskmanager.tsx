import { useState, useEffect } from 'react';
import { Button } from "../Button/button";
import { Input } from "../Input/input";

import styles from './taskmanager.module.scss';
import { addTask } from '../../store/slices/tasksSlice';
import { useAppDispatch } from '../../store';
import { TasksList } from '../TasksList/taskslist';

export function TaskManager() {
    const dispatch = useAppDispatch();
    const [taskName, setTaskName] = useState('');
    const [isDisabled, setDisabled] = useState(true);

    function addNewTask() {
        dispatch(addTask({ name: taskName, tomatoes: 1 }));
        setTaskName('');
    }

    useEffect(() => {
        taskName.length > 3 ? setDisabled(false) : setDisabled(true);
    }, [taskName])

    return (
        <>
            <h2 className="h2">
                Ура! Теперь можно начать работать:
            </h2>
            <ul className={styles.list}>
                <li>Выберите категорию и&nbsp;напишите название текущей задачи</li>
                <li>Запустите таймер (&laquo;помидор&raquo;)</li>
                <li>Работайте пока &laquo;помидор&raquo; не&nbsp;прозвонит</li>
                <li>Сделайте короткий перерыв (3-5&nbsp;минут)</li>
                <li>Продолжайте работать &laquo;помидор&raquo; за&nbsp;&laquo;помидором&raquo;, пока задача не&nbsp;будут выполнена. Каждые 4&nbsp;&laquo;помидора&raquo; делайте длинный перерыв (15-30&nbsp;минут).</li>
            </ul>
            <Input placeholder={'Название задачи'} value={taskName} onChange={(e) => setTaskName(e.target.value)} />
            <Button type={'green'} isDisabled={isDisabled} onClick={addNewTask}>
                Добавить
            </Button>
            <TasksList />
        </>
    );
}