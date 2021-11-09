import React, {FC} from 'react';

export type SettingsModalProps = {
  visible: boolean,
  setVisible: (visible: boolean) => void
}

const SettingsModal: FC<SettingsModalProps> = ({ visible, setVisible }) => (
  <div className={`settingsModal ${visible ? '' : 'hidden'}`}>
    <i className="fas fa-times close" onClick={() => setVisible(false)}></i>
  </div>
);

export default SettingsModal;
