import React, {FC} from 'react';
import { Modal } from '../Modal/Modal';

export type SettingsModalProps = {
  visible: boolean,
  setVisible: (visible: boolean) => void
}

const SettingsModal: FC<SettingsModalProps> = ({ visible, setVisible }) => (
  <Modal visible={visible} setVisible={setVisible}></Modal>
);

export default SettingsModal;
