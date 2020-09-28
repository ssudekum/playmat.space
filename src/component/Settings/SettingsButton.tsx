import React, { useState } from 'react';
import { SettingsModal } from './SettingsModal' 
import './Settings.css'

export const SettingsButton : React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    
    return <>
        <div className="settingsIcon" onClick={() => setIsModalVisible(true)}>
            <i className="fas fa-cogs"></i>
        </div>
        <div className={`mask ${isModalVisible ? 'show' : ''}`} 
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
            <SettingsModal visible={isModalVisible} setVisible={setIsModalVisible}></SettingsModal>
        </div>
    </>
}