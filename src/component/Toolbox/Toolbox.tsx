import React, { useState } from 'react';
import './Toolbox.css'
import Deck from '../Deck/Deck';

const Toolbox : React.FC<{}> = props => {
    const[show, setShow] = useState(true);

    return (
        <div className={`toolbox ${(show ? '' : 'hidden-toolbox')}`}>
            <i className={`fas fa-caret-square-left collapsible ${show ? '' : 'hidden-icon'}`} onClick={() => setShow(false)}></i>
            <i className={`fas fa-caret-square-right collapsible ${show ? 'hidden-icon' : ''}`} onClick={() => setShow(true)}></i>
            <div className={`toolbox-content ${(show ? '' : 'hidden-content')}`}>
                <Deck></Deck>
            </div>
        </div>
    );
}

export default Toolbox;