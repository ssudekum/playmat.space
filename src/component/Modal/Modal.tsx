import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'

export interface ModalProps {
    id?: string,
    visible: boolean,
    setVisible: (visible: boolean) => void
}

export const Modal : React.FC<ModalProps> = props => {
    const {id, visible, setVisible, children} = props;

    const app = document.getElementById('app');
    if (!app) return <></>;

    return ReactDOM.createPortal(
      <div className={`mask ${visible ? 'show' : ''}`} 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}>
          <div id={id} className={`modal ${visible ? '' : 'hidden'}`}>
              <i className="fas fa-times close" onClick={() => setVisible(false)}></i>
              {children}
          </div>
      </div>,
      app
    );
}
