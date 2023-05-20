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

    function formatYAxis(value: unknown, index: number) {
        if (value !== undefined) {
            if (index === 0) {
                return ''
            } else if (index === 1) {
                return '25 мин';
            } else if (index === 2) {
                return '50 мин';
            } else if (index === 3) {
                return '1 ч 15 мин';
            } else if (index === 4) {
                return '1 ч 40 мин';
            } else {
                return '';
            }
        }  else {
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
                <YAxis orientation="right" domain={[0, 6000]} axisLine={false} tickLine={false} tick={{ fill: "#333333", fontSize: 12 }} tickFormatter={formatYAxis} />
                <XAxis dataKey={'dayOfWeek'} axisLine={false} tickLine={false} padding={{ left: 56, right: 165 }} tick={{ fill: "#999999", fontSize: 24 }} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey={'time'} maxBarSize={77}>
                    {data.map((_entry, index) => (
                        <Cell cursor="pointer" key={`cell-${index}`} fill={focusBar === index && activeBar !== index ? '#EE735D' : activeBar === index ? '#DC3E22' : '#EA8979'} onClick={() => changeActiveBar(index)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}