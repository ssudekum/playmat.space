import React from 'react';

export interface SettingsModalProps {
    visible: boolean,
    setVisible: (visible: boolean) => void
}

export const SettingsModal : React.FC<SettingsModalProps> = ({ visible, setVisible }) => {

    return <>
        <div className={`settingsModal ${visible ? '' : 'hidden'}`}>
            <i className="fas fa-times close" onClick={() => setVisible(false)}></i>
        </div>
    </>
}