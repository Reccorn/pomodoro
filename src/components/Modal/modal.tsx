import { useState, useRef, useEffect } from 'react';
import styles from './modal.module.scss';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Button } from '../Button/button';
import { useAppDispatch } from '../../store';
import { deleteTask, renameTask } from '../../store/slices/tasksSlice';
import { Input } from '../Input/input';
import { EIcons, Icon } from '../Icon/icon';

interface IModalProps {
    toDelete: boolean,
    name: string,
    refreshFunc: () => void
}

export function Modal({ toDelete, name, refreshFunc }: IModalProps) {
    const dispatch = useAppDispatch();
    const [isActive, setActive] = useState(false);
    const [newName, setNewName] = useState(name);
    const [isDisabled, setDisabled] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => setActive(true), 100);
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (e.target instanceof Node && !modalRef.current?.contains(e.target))
                setActive(false);
        }

        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, []);

    useEffect(() => {
        newName.length > 3 ? setDisabled(false) : setDisabled(true);
    }, [newName]);

    const node = document.getElementById('modal_root');
    if (!node) return null;

    const classes = classNames(
        styles.wrapper,
        { [styles.active]: isActive }
    )

    function deleteFunc() {
        dispatch(deleteTask(name));
        closeFunc();
    }

    function renameFunc() {
        if (newName.length > 3) {
            dispatch(renameTask({ oldName: name, newName: newName }));
            closeFunc();
        }
    }

    function closeFunc() {
        setActive(false);
        setTimeout(() => refreshFunc(), 100);
    }

    return ReactDOM.createPortal((
        <div className={classes} ref={modalRef}>
            <div className={styles.shadow} onClick={closeFunc}></div>
            <div className={styles.outer}>
                <div className={styles.close} onClick={closeFunc}>
                    <Icon name={EIcons.close} />
                </div>
                <div className={styles.inner}>
                    <h3 className={styles.title}>
                        {toDelete ? 'Удалить задачу?' : 'Редактировать задачу?'}
                    </h3>
                    {toDelete ?
                        <Button type={'red'} isDisabled={false} onClick={deleteFunc}>
                            Удалить
                        </Button>
                        :
                        <>
                            <Input placeholder={'Название задачи'} value={newName} onChange={(e) => setNewName(e.target.value)} />
                            <Button type={'green'} isDisabled={isDisabled} onClick={renameFunc}>
                                Подтвердить
                            </Button>
                        </>
                    }
                    <span className={styles.cancel} onClick={closeFunc}>
                        Отмена
                    </span>
                </div>
            </div>
        </div>
    ), node);
}