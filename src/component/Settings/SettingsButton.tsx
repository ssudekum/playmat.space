import React, { FC, useState } from 'react';
import SettingsModal from './SettingsModal';
import './Settings.css';

const SettingsButton: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return <>
    <div className="settingsIcon" onClick={() => setIsModalVisible(true)}>
      <i className="fas fa-cogs"></i>
    </div>
    <div 
      className={`mask ${isModalVisible ? 'show' : ''}`}
      onClick={(e) => { 
        e.stopPropagation(); 
        e.preventDefault(); 
      }}>
      <SettingsModal 
        visible={isModalVisible} 
        setVisible={setIsModalVisible}>
      </SettingsModal>
    </div>
  </>
};

export default SettingsButton;