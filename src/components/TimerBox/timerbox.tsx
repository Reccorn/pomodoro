import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { ITasksState, deleteTask } from "../../store/slices/tasksSlice";
import styles from "./timerbox.module.scss";
import { Button } from "../Button/button";

import tomato from '../../assets/icons/tomato.svg';
import { addStop, addTime, addTomato } from "../../store/slices/statsSlice";

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

export function TimerBox() {
    const dispatch = useAppDispatch();

    const data: ITasksState = useAppSelector(state => state.tasks[0]);

    const defaultWorkTime = 10;
    const defaultPauseTime = 10;
    const bigPauseTime = 1800;

    const [currentTomato, setCurrentTomato] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(defaultWorkTime);
    const [formattedTime, setFormattedTime] = useState('');
    const [isPaused, setPaused] = useState(false);
    const [savedTime, setSavedTime] = useState(0);
    const [currentTaskCount, setCurrentTaskCount] = useState(1);

    useEffect(() => {
        if (!isRunning && !isPaused) return;

        const intervalId = setInterval(() => {
            let hasDispatched = false;
            setTimeLeft((prevTimeLeft) => {
                if (prevTimeLeft === 0) {
                    if (isRunning) {
                        setIsRunning(false);
                        setPaused(true);
                        return isPaused ? defaultWorkTime : currentTomato % 4 === 0 ? bigPauseTime : defaultPauseTime;
                    } else {
                        return prevTimeLeft;
                    }
                } else {
                    if (!hasDispatched) {
                        dispatch(addTime({ date: currentDate.toISOString(), isWorkTime: isRunning }));
                        hasDispatched = true;
                    }
                    return prevTimeLeft - 1;
                }
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isRunning, isPaused, currentTomato, dispatch]);

    function startTimer() {
        if (data) {
            if (!isRunning) {
                setIsRunning(true);
                setPaused(false);

                if (timeLeft === 0) {
                    dispatch(addTomato({ date: currentDate.toISOString() }));
                    currentTomato === data.tomatoes ? taskCompleted() : setCurrentTomato(currentTomato + 1);
                }

                if (savedTime !== 0) {
                    setTimeLeft(savedTime);
                } else {
                    setTimeLeft(defaultWorkTime);
                }
            } else {
                setIsRunning(false);
                setPaused(true);
                setTimeLeft(currentTomato % 4 === 0 ? bigPauseTime : defaultPauseTime);
            }
        } else {
            setIsRunning(false);
            setPaused(false);
            setTimeLeft(defaultWorkTime);
            setSavedTime(0);
        }
    }

    function stopAction() {
        function nextStep() {
            dispatch(addTomato({ date: currentDate.toISOString() }));
            currentTomato === data.tomatoes ? taskCompleted() : setCurrentTomato(currentTomato + 1);
            setIsRunning(false);
            setPaused(false);
            setSavedTime(0);
            setTimeLeft(defaultWorkTime);
        }

        if (isPaused) {
            if (timeLeft > 0) {
                setTimeLeft(0);
            } else {
                taskCompleted();
            }
        } else {
            dispatch(addStop({ date: currentDate.toISOString() }));
            nextStep();
        }
    }

    function taskCompleted() {
        dispatch(deleteTask(data.name));
        if (data) {
            setIsRunning(false);
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
        if (isRunning) {
            setSavedTime(timeLeft);
        }
    }, [timeLeft, setSavedTime, isRunning]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles.head + ' ' + (isRunning ? styles.running : '') + ' ' + (isPaused ? styles.paused : '')}>
                    <h4 className={styles.taskName}>{data ? data.name : "Нет задач"}</h4>
                    <div className={styles.tomato}>
                        {data ? 'Помидор ' + currentTomato : ''}
                    </div>
                </div>
                <div className={styles.body}>
                    {data ? (
                        <div className={styles.content}>
                            <div className={styles.time}>
                                {formattedTime}
                                <button className={styles.addBtn} onClick={() => setTimeLeft(timeLeft + 60)}>
                                    <span>
                                        +
                                    </span>
                                </button>
                            </div>
                            <div className={styles.info}>
                                <span>{'Задача ' + currentTaskCount} -</span> {data.name}
                            </div>
                            <div className={styles.actions}>
                                <Button type={"green"} isDisabled={false} onClick={startTimer}>
                                    {isRunning ? 'Пауза' : isPaused ? 'Продолжить' : 'Старт'}
                                </Button>
                                <Button type={"red"} isDisabled={!isRunning && !isPaused} onClick={stopAction}>
                                    {isPaused ? timeLeft > 0 ? 'Пропустить' : 'Сделано' : 'Стоп'}
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