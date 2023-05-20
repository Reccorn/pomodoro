import CloseIcon from "../Icons/CloseIcon"
import DeleteIcon from "../Icons/DeleteIcon"
import EditIcon from "../Icons/EditIcon"
import LogoIcon from "../Icons/LogoIcon"
import MenuIcon from "../Icons/MenuIcon"
import MinusIcon from "../Icons/MinusIcon"
import PlusIcon from "../Icons/PlusIcon"
import StatsIcon from "../Icons/StatsIcon"
import ArrowIcon from "../Icons/ArrowIcon"
import FocusIcon from "../Icons/FocusIcon"
import PauseIcon from "../Icons/PauseIcon"
import StopIcon from "../Icons/StopIcon"

export enum EIcons {
    logo = 'LogoIcon',
    menu = 'MenuIcon',
    close = 'CloseIcon',
    plus = 'PlusIcon',
    minus = 'MinusIcon',
    edit = 'EditIcon',
    delete = 'DeleteIcon',
    stats = 'StatsIcon',
    arrow = 'ArrowIcon',
    focus = 'FocusIcon',
    pause = 'PauseIcon',
    stop = 'StopIcon'
}

interface IIconProps {
    name: EIcons
}

function getComponent(name: EIcons) {
    switch(name) {
        case EIcons.logo: return <LogoIcon />
        case EIcons.menu: return <MenuIcon />
        case EIcons.close: return <CloseIcon />
        case EIcons.plus: return <PlusIcon />
        case EIcons.minus: return <MinusIcon />
        case EIcons.edit: return <EditIcon />
        case EIcons.delete: return <DeleteIcon />
        case EIcons.stats: return <StatsIcon />
        case EIcons.arrow: return <ArrowIcon />
        case EIcons.focus: return <FocusIcon />
        case EIcons.pause: return <PauseIcon />
        case EIcons.stop: return <StopIcon />
    }
}

export function Icon({ name }: IIconProps) {
    return (
        <span>{getComponent(name)}</span>
    );
}