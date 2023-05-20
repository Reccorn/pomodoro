import { createSlice } from "@reduxjs/toolkit";

export interface IStatsState {
    date: string,
    workTime: number,
    pauseTime: number,
    tomatoes: number,
    stops: number
}

const localStats = localStorage.getItem('stats');
const initialState = localStats !== null ? JSON.parse(localStats) : [];

const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        addStop: (state, action) => {
            const filteredArray = state.filter((item: IStatsState) => item.date === action.payload.date);
            if (filteredArray.length > 0) {
                filteredArray[0].stops += 1;
            } else {
                const newItem = {
                    date: action.payload.date,
                    workTime: 0,
                    pauseTime: 0,
                    tomatoes: 0,
                    stops: 1
                };
                state.push(newItem);
            }
            localStorage.setItem('stats', JSON.stringify(state));
        },
        addTime: (state, action) => {
            const filteredArray = state.filter((item: IStatsState) => item.date === action.payload.date);
            if (filteredArray.length > 0) {
                if (action.payload.isWorkTime) {
                    filteredArray[0].workTime += 1;
                } else {
                    filteredArray[0].pauseTime += 1;
                }
            } else {
                const newItem = {
                    date: action.payload.date,
                    workTime: action.payload.isWorkTime ? 1 : 0,
                    pauseTime: action.payload.isWorkTime ? 0 : 1,
                    tomatoes: 0,
                    stops: 0
                }
                state.push(newItem);
            }
            localStorage.setItem('stats', JSON.stringify(state));
        },
        addTomato: (state, action) => {
            const filteredArray = state.filter((item: IStatsState) => item.date === action.payload.date);
            if (filteredArray.length > 0) {
                filteredArray[0].tomatoes += 1;
            } else {
                const newItem = {
                    date: action.payload.date,
                    workTime: 0,
                    pauseTime: 0,
                    tomatoes: 1,
                    stops: 0
                };
                state.push(newItem);
            }
            localStorage.setItem('stats', JSON.stringify(state));
        }
    }
});

export const { addStop, addTime, addTomato } = statsSlice.actions;

export default statsSlice.reducer;