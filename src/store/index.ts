import { configureStore } from "@reduxjs/toolkit";
import themeSliceReducer from "./slices/themeSlice";
import tasksSliceReducer from "./slices/tasksSlice";
import statsSliceReducer from "./slices/statsSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
    reducer: {
        theme: themeSliceReducer,
        tasks: tasksSliceReducer,
        stats: statsSliceReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;