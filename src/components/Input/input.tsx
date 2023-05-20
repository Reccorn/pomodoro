import styles from './input.module.scss';

interface IInputProps {
    value: string,
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
}

export function Input({ value, placeholder, onChange }: IInputProps) {
    return (
        <input value={value} className={styles.item} type="text" placeholder={placeholder} onChange={onChange} />
    );
}