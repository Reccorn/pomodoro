import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { ITasksState, deleteTask } from "../../store/slices/tasksSlice";
import styles from "./timerbox.module.scss";
import { Button } from "../Button/button";

import tomato from '../../assets/icons/tomato.svg';
import { addStop, addTime, addTomato } from "../../store/slices/statsSlice";
import classNames from "classnames";

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

export function TimerBox() {
    const dispatch = useAppDispatch();

    const data: ITasksState = useAppSelector(state => state.tasks[0]);

    const defaultWorkTime = 10;
    const defaultBreakTime = 10;
    const bigBreakTime = 15;

    const [currentTomato, setCurrentTomato] = useState(1);
    const [isWorkTime, setIsWorkTime] = useState(false);
    const [isBreakTime, setIsBreakTime] = useState(false);
    const [isPaused, setPaused] = useState(true);
    const [timeLeft, setTimeLeft] = useState(defaultWorkTime);
    const [formattedTime, setFormattedTime] = useState('');
    const [savedTime, setSavedTime] = useState(0);
    const [currentTaskCount, setCurrentTaskCount] = useState(1);

    const timeClasses = classNames(
        styles.time,
        { [styles.running]: isWorkTime && !isPaused },
        { [styles.break]: isBreakTime && !isPaused }
    );

    useEffect(() => {
        if (isPaused) return;

        const intervalId = setInterval(() => {
            let hasDispatched = false;
            setTimeLeft((prevTimeLeft) => {
                if (prevTimeLeft === 0) {
                    if (isWorkTime) {
                        setIsWorkTime(false);
                        setIsBreakTime(true);

                        return isPaused ? defaultWorkTime : currentTomato % 4 === 0 ? bigBreakTime : defaultBreakTime;
                    } else {
                        dispatch(addTomato({ date: currentDate.toISOString() }));
                        currentTomato === data.tomatoes ? taskCompleted() : setCurrentTomato(prev => prev + 1);

                        setPaused(true);
                        setIsWorkTime(false);
                        setIsBreakTime(false);

                        return defaultWorkTime;
                    }
                } else {
                    if (!hasDispatched) {
                        dispatch(addTime({ date: currentDate.toISOString(), isWorkTime: isWorkTime }));
                        hasDispatched = true;
                    }
                    return prevTimeLeft - 1;
                }
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isWorkTime, isPaused, isBreakTime, currentTomato, dispatch]);

    function startTimer() {
        if (data) {
            if ((isWorkTime && isPaused) || (!isWorkTime && !isBreakTime && isPaused)) {
                setIsWorkTime(true);
                setPaused(false);
                setIsBreakTime(false);

                if (savedTime !== 0) {
                    setTimeLeft(savedTime);
                }
            } else if (isBreakTime && isPaused) {
                setPaused(false);
                setIsWorkTime(false);
            } else if (!isPaused) {
                setPaused(true);
            }
        } else {
            setTimeLeft(defaultWorkTime);
            setSavedTime(0);
        }
    }

    function stopAction() {
        function nextStep() {
            dispatch(addTomato({ date: currentDate.toISOString() }));
            setSavedTime(0);
            setTimeLeft(defaultWorkTime);
        }

        if (isWorkTime) {
            if (isPaused) {
                setIsWorkTime(false);
                setPaused(false);
                setIsBreakTime(true);
                nextStep();
            } else {
                setIsWorkTime(false);
                setPaused(true);
                dispatch(addStop({ date: currentDate.toISOString() }));
                setSavedTime(0);
                setTimeLeft(defaultWorkTime);
                // nextStep();
            }
        } else {
            setIsBreakTime(false);
            setPaused(true);
            currentTomato === data.tomatoes ? taskCompleted() : setCurrentTomato(prev => prev + 1);
            setTimeLeft(defaultWorkTime);
        }
    }

    function taskCompleted() {
        dispatch(deleteTask(data.name));
        if (data) {
            setPaused(false);
            setCurrentTomato(1);
            setTimeLeft(defaultWorkTime);
            setSavedTime(0);
            setCurrentTaskCount(currentTaskCount + 1);
        }
    }

    useEffect(() => {
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        setFormattedTime(`${minutes}:${seconds}`);
        if (isWorkTime) {
            setSavedTime(timeLeft);
        }
    }, [timeLeft, setSavedTime, isWorkTime]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles.head + ' ' + (isWorkTime ? styles.running : '') + ' ' + (isBreakTime ? styles.break : '')}>
                    <h4 className={styles.taskName}>{data ? data.name : "Нет задач"}</h4>
                    <div className={styles.tomato}>
                        {data ? 'Помидор ' + currentTomato : ''}
                    </div>
                </div>
                <div className={styles.body}>
                    {data ? (
                        <div className={styles.content}>
                            <div className={timeClasses}>
                                {formattedTime}
                                <button className={styles.addBtn} onClick={() => setTimeLeft(timeLeft + 60)}>
                                    <span>
                                        +
                                    </span>
                                </button>
                            </div>
                            {/* <div className={styles.info}>
                                <span>{'Задача ' + currentTaskCount} -</span> {data.name}
                            </div> */}
                            <div className={styles.actions}>
                                <Button type={"green"} isDisabled={false} onClick={startTimer}>
                                    {((isWorkTime || isBreakTime) && !isPaused) ? 'Пауза' : ((isWorkTime || isBreakTime) && isPaused) ? 'Продолжить' : 'Старт'}
                                </Button>
                                <Button type={"red"} isDisabled={(!isWorkTime && !isBreakTime && isPaused)} onClick={stopAction}>
                                    {isBreakTime ? 'Пропустить' : (isWorkTime && isPaused && !isBreakTime) ? 'Сделано' : 'Стоп'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.placeholder}>
                            <img src={tomato} alt="Нет задач" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}