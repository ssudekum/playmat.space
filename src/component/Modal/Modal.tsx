import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';

export interface ModalProps {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  style?: CSSProperties,
}

export const Modal : React.FC<ModalProps> = ({visible, setVisible, style, children}) => {
    return ReactDOM.createPortal(
      <div className={`mask ${visible ? 'show' : ''}`} 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}>
          <div className={`modal${visible ? '' : ' hidden'}`} style={style}>
              <i className="fas fa-times close" onClick={() => setVisible(false)}></i>
              {children}
          </div>
      </div>,
      document.body
    );
}
