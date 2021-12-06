import React, { FC, useState } from 'react';
import SettingsModal from './SettingsModal';
import IconButton from '../IconButton/IconButton';

const SettingsButton: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return <>
    <IconButton
      icon="fa fa-cogs"
      onClick={() => setIsModalVisible(true)}
      style={{
        top: '20px',
        right: '25px',
      }}
    />

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
