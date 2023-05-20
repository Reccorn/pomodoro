import { useEffect, useState } from 'react';
import styles from './statsitems.module.scss';
import { EIcons, Icon } from '../../Icon/icon';
import { useAppSelector } from '../../../store';
import { IStatsState } from '../../../store/slices/statsSlice';
import { formatTime } from '../../../utils/formatTime';
import { getNoun } from '../../../utils/getNoun';
import tomato from '../../../assets/icons/tomato.svg';
import { IDataProps, StatsChart } from './StatsChart/statschart';

interface IStatsItemsProps {
    filter: number
}

const days = [
    { full: 'Воскресенье', short: 'Вс' },
    { full: 'Понедельник', short: 'Пн' },
    { full: 'Вторник', short: 'Вт' },
    { full: 'Среда', short: 'Ср' },
    { full: 'Четверг', short: 'Чт' },
    { full: 'Пятница', short: 'Пт' },
    { full: 'Суббота', short: 'Сб' }
]

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

export function StatsItems({ filter }: IStatsItemsProps) {
    const data = useAppSelector(state => state.stats);
    const [activeDate, setActiveDate] = useState(currentDate);
    const [chartData, setChartData] = useState<IDataProps[]>([]);

    useEffect(() => {
        if (filter === 1) {
            const lastWeekMonday = new Date(currentDate);
            lastWeekMonday.setDate(currentDate.getDate() - currentDate.getDay() + 1 - 7);
            setActiveDate(lastWeekMonday);
        } else if (filter === 2) {
            let daysToMonday = 1 - currentDate.getDay();
            if (currentDate.getDay() === 0) {
                daysToMonday = -6;
            }
            const mondayThisWeek = new Date(currentDate.getTime() + daysToMonday * 24 * 60 * 60 * 1000);
            const mondayTwoWeeksAgo = new Date(mondayThisWeek.getTime() - 14 * 24 * 60 * 60 * 1000);
            setActiveDate(mondayTwoWeeksAgo);
        } else if (filter === 0) {
            setActiveDate(currentDate);
        }
    }, [filter]);

    useEffect(() => {
        function getChartData() {
            let time = 0;
            const dayOfWeek = activeDate.getDay();
            let daysToSunday = 0 - dayOfWeek; 
            if (dayOfWeek === 0) { 
                daysToSunday = 0; 
            } else if (dayOfWeek === 1) {
                daysToSunday = -6;
            }
            const sundayThisWeek = new Date(activeDate.getTime() + daysToSunday * 24 * 60 * 60 * 1000); 
            const weekData = new Array(7).fill('').map((_day, index) => { 
                const date = new Date(sundayThisWeek.getTime()); 
                date.setDate(date.getDate() + index); 
                const dayOfWeek = days[index]; 
                const filteredArray = data.filter((item: IStatsState) => item.date === date.toISOString());
                let isActive = false; 
                if (filteredArray.length > 0) { 
                    time = filteredArray[0].workTime + filteredArray[0].pauseTime; 
                }
                if (date.valueOf() === activeDate.valueOf()) {
                    isActive = true;
                }
                return { 
                    dayOfWeek: dayOfWeek.short, 
                    date, 
                    time,
                    isActive 
                }; 
            }); 
            const sunday = weekData.shift();
            if (sunday !== undefined) weekData.push(sunday);
            return weekData;
        }
        setChartData(getChartData);
    }, [activeDate, data, setChartData]);

    const filteredArray = data.filter((item: IStatsState) => item.date === activeDate.toISOString());

    function getTotalWorkTime(time: number) {
        const totalTime = formatTime(time);
        const hours = totalTime.hours + ' ' + getNoun({ number: totalTime.hours, one: 'часа', two: 'часов', five: 'часов' });
        const minutes = totalTime.minutes + ' ' + getNoun({ number: totalTime.minutes, one: 'минуты', two: 'минут', five: 'минут' });
        const seconds = totalTime.seconds + ' ' + getNoun({ number: totalTime.seconds, one: 'секунды', two: 'секунд', five: 'секунд' });
        const result = (totalTime.hours >= 1 ? hours + ' ' : '') + (totalTime.minutes >= 1 ? minutes + ' ' : '') + (totalTime.seconds >= 1 ? seconds : '');
        return result;
    }

    function getFocusTime(workTime: number, pauseTime: number) {
        const totalTime = workTime + pauseTime;
        return Math.floor(100 / (totalTime / workTime));
    }

    function getTotalPauseTime(time: number) {
        const totalTime = formatTime(time);
        const hours = totalTime.hours + 'ч ';
        const minutes = totalTime.minutes + 'м ';
        const seconds = totalTime.seconds + 'с';
        const result = (totalTime.hours >= 1 ? hours : '') + (totalTime.minutes >= 1 ? minutes : '') + seconds;
        return result;
    }

    function switchActiveBar(date: Date) {
        setActiveDate(date);
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                <div className={styles.item}>
                    <h4 className={styles.itemTitle}>
                        {days[activeDate.getDay()].full}
                    </h4>
                    <p>
                        {filteredArray.length > 0 ?
                            filteredArray[0].workTime > 0 ? <span>Вы работали над задачами<br /> в течение <span>{getTotalWorkTime(filteredArray[0].workTime)}</span></span> : 'Нет данных'
                            :
                            'Нет данных'
                        }
                    </p>
                </div>
                <div className={styles.item}>
                    {filteredArray.length > 0 && filteredArray[0].tomatoes > 0 ?
                        <>
                            <div className={styles.tomatoCounter}>
                                <Icon name={EIcons.logo} />
                                x {filteredArray[0].tomatoes}
                            </div>
                            <div className={styles.tomatoValue}>
                                {filteredArray[0].tomatoes + ' ' + getNoun({ number: filteredArray[0].tomatoes, one: 'помидор', two: 'помидора', five: 'помидоров' })}
                            </div>
                        </>
                        :
                        <img src={tomato} alt="tomato" />
                    }
                </div>
                <div className={styles.item}>
                    <StatsChart data={chartData} onClick={switchActiveBar} />
                </div>
            </div>
            <div className={styles.bottom}>
                <div className={styles.item + ' ' + (filteredArray.length > 0 && filteredArray[0].workTime > 0 ? styles.itemActive : '')}>
                    <h4 className={styles.itemTitle}>Фокус</h4>
                    <div className={styles.value}>
                        {(filteredArray.length > 0 ? getFocusTime(filteredArray[0].workTime, filteredArray[0].pauseTime) : 0) + '%'}
                    </div>
                    <Icon name={EIcons.focus} />
                </div>
                <div className={styles.item + ' ' + (filteredArray.length > 0 && filteredArray[0].pauseTime > 0 ? styles.itemActive : '')}>
                    <h4 className={styles.itemTitle}>Время на паузе</h4>
                    <div className={styles.value}>
                        {filteredArray.length > 0 && filteredArray[0].pauseTime > 0 ? getTotalPauseTime(filteredArray[0].pauseTime) : '0м'}
                    </div>
                    <Icon name={EIcons.pause} />
                </div>
                <div className={styles.item + ' ' + (filteredArray.length > 0 && filteredArray[0].stops > 0 ? styles.itemActive : '')}>
                    <h4 className={styles.itemTitle}>Остановки</h4>
                    <div className={styles.value}>
                        {filteredArray.length > 0 ? filteredArray[0].stops : 0}
                    </div>
                    <Icon name={EIcons.stop} />
                </div>
            </div>
        </div>
    );
}