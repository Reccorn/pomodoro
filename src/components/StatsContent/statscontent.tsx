import { useState } from "react";
import { StatsHead } from "./StatsHead/statshead";
import { StatsItems } from "./StatsItems/statsitems";

export function StatsContent() {
    const [filter, setFilter] = useState(0);

    return (
        <>
            <StatsHead selectValue={filter} onClick={(arg: number) => setFilter(arg)} />
            <StatsItems filter={filter} />
        </>
    );
}