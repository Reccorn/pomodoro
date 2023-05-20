import { createSlice } from "@reduxjs/toolkit";

export interface ITasksState {
    name: string,
    tomatoes: number
}

const localTasks = localStorage.getItem('tasks');
const initialState = localTasks !== null ? JSON.parse(localTasks) : [];

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action) => {
            state.push(action.payload);
            localStorage.setItem('tasks', JSON.stringify(state));
        },
        deleteTask: (state, action) => {
            state.forEach((item: ITasksState) => {
                if (item.name === action.payload) {
                    const index = state.indexOf(item);
                    state.splice(index, 1);
                    localStorage.setItem('tasks', JSON.stringify(state));
                }
            });
        },
        renameTask: (state, action) => {
            state.forEach((item: ITasksState) => {
                if (item.name === action.payload.oldName) {
                    item.name = action.payload.newName;
                    localStorage.setItem('tasks', JSON.stringify(state));
                }
            });
        },
        updateTomatoes: (state, action) => {
            state.forEach((item: ITasksState) => {
                if (item.name === action.payload.name) {
                    if (action.payload.type) {
                        item.tomatoes +=1;
                    } else {
                        item.tomatoes = item.tomatoes === 1 ? 1 : item.tomatoes - 1;
                    }
                    localStorage.setItem('tasks', JSON.stringify(state));
                }
            });
        }
    }
});

export const { addTask, deleteTask, renameTask, updateTomatoes } = tasksSlice.actions;

export default tasksSlice.reducer;