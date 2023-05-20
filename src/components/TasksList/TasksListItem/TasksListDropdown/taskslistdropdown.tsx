import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../../../store';
import { updateTomatoes } from '../../../../store/slices/tasksSlice';
import styles from './taskslistdropdown.module.scss';
import { Modal } from '../../../Modal/modal';
import { EIcons, Icon } from '../../../Icon/icon';

interface ITaskDropdownProps {
    name: string,
    switcher: () => void
}

export function TasksListDropdown({ name, switcher }: ITaskDropdownProps) {
    const dispatch = useAppDispatch();
    const [modalShown, setModalShown] = useState(false);
    const [modalType, setModalType] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);

    function openDeleteModal() {
        setModalType(true);
        setModalShown(!modalShown);
    }

    function openRenameModal() {
        setModalType(false);
        setModalShown(!modalShown);
    }

    function modalRefresh() {
        switcher();
        setModalShown(!modalShown);
    }

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (e.target instanceof Node && !dropRef.current?.contains(e.target))
                switcher();
                document.removeEventListener('click', handleClick);
        }

        setTimeout(() => {
            document.addEventListener('click', handleClick);
        }, 10);

        return () => {
            document.removeEventListener('click', handleClick);
        }
    }, [switcher]);

    return (
        <>
            <div className={styles.outer} ref={dropRef}>
                <ul className={styles.list}>
                    <li onClick={() => dispatch(updateTomatoes({ name: name, type: true }))}>
                        <Icon name={EIcons.plus} />
                        Увеличить
                    </li>
                    <li onClick={() => dispatch(updateTomatoes({ name: name, type: false }))}>
                        <Icon name={EIcons.minus} />
                        Уменьшить
                    </li>
                    <li onClick={openRenameModal}>
                        <Icon name={EIcons.edit} />
                        Редактировать
                    </li>
                    <li onClick={openDeleteModal}>
                        <Icon name={EIcons.delete} />
                        Удалить
                    </li>
                </ul>
            </div>
            {modalShown && <Modal toDelete={modalType} name={name} refreshFunc={modalRefresh} />}
        </>
    );
}