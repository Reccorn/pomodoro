import { useState } from "react";
import { EIcons, Icon } from "../../../Icon/icon";
import { TasksListDropdown } from "../TasksListDropdown/taskslistdropdown";

import styles from './taskslistmenu.module.scss';

interface ITaskMenuProps {
    name: string
}

export function TasksListMenu({ name }: ITaskMenuProps) {
    const [dropdownIsOpen, setDropdownOpen] = useState(false);

    return (
        <>
            <button className={styles.menuBtn} onClick={() => setDropdownOpen(!dropdownIsOpen)}>
                <Icon name={EIcons.menu} />
            </button>
            {
                dropdownIsOpen && (
                    <TasksListDropdown name={name} switcher={() => setDropdownOpen(false)} />
                )
            }
        </>
    );
}