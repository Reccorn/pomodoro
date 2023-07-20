import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface IChartProps {
    data: Array<IDataProps>,
    onClick: (arg: Date) => void
}

export interface IDataProps {
    dayOfWeek: string,
    date: Date,
    time: number,
    isActive: boolean
}

export function StatsChart({ data, onClick }: IChartProps) {
    const [activeBar, setActiveBar] = useState(99);
    const [focusBar, setFocusBar] = useState(99);

    useEffect(() => {
        data.map((item, index) => {
            if (item.isActive) {
                setActiveBar(index);
            }
        });
    }, [data]);

    function formatYAxis(value: number) {
        if (value !== undefined) {
            const hours = Math.floor(value / 3600);
            const minutes = Math.floor((value % 3600) / 60);
            const seconds = Math.floor(value % 60);


            if (hours === 0) {
                if (minutes === 0) {
                    return seconds + ' с';
                } else {
                    if (seconds === 0) {
                        return minutes + ' м';
                    } else {
                        return minutes + ' м ' + seconds + ' с';
                    }
                }
            } else {
                if (minutes === 0) {
                    return hours + ' ч';
                } else {
                    return hours + ' ч ' + minutes + ' м';
                }
            }
        } else {
            return '';
        }
    }

    function changeActiveBar(index: number) {
        setActiveBar(index);
        onClick(data[index].date);
    }

    return (
        <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 45, right: 22, bottom: 11 }}
                onMouseMove={state => {
                    if (state.isTooltipActive) {
                        if (state.activeTooltipIndex !== undefined) {
                            setFocusBar(state.activeTooltipIndex);
                        }
                    } else {
                        setFocusBar(99);
                    }
                }}>
                <CartesianGrid vertical={false} />
                <YAxis dataKey={'time'} orientation="right" domain={['dataMin', 'dataMax']} axisLine={false} tickLine={false} tick={{ fill: "#333333", fontSize: 12 }} tickFormatter={formatYAxis} />
                <XAxis dataKey={'dayOfWeek'} axisLine={false} tickLine={false} padding={{ left: 56, right: 165 }} tick={{ fill: "#999999", fontSize: 24 }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey={'time'} maxBarSize={77}>
                    {data.map((_entry, index) => (
                        <Cell cursor="pointer" key={`cell-${index}`} fill={focusBar === index && activeBar !== index ? '#EE735D' : activeBar === index ? '#DC3E22' : '#EA8979'} onClick={() => changeActiveBar(index)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}