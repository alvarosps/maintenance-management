import React from 'react';
import { Switch } from 'antd';
import './ToggleSwitch.scss';

type ToggleSwitchProps = {
    checked: boolean;
    handleChange: (checked: boolean) => void;
    leftText: string;
    rightText: string;
    canBeDisabled?: boolean;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = (props: ToggleSwitchProps) => {
    const { checked, handleChange, leftText, rightText, canBeDisabled = false } = props;

    return (
        <div className="toggle-switch">
            <span>{leftText}</span>
            <Switch className={canBeDisabled ? '' : 'keep-bg-color'} checked={checked} onChange={handleChange} />
            <span>{rightText}</span>
        </div>
    );
};

export default React.memo(ToggleSwitch);
