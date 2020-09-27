import React from 'react';
import './App.css';
import Logo from './component/Logo/Logo';
import Toolbox from './component/Toolbox/Toolbox';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '@fortawesome/fontawesome-free/css/all.css';
import Playmat from './component/Playmat/Playmat';
import { CustomDragLayer } from './component/CustomDrag/CustomDragLayer';

function App() {
    return (
    <div className="App">
        <DndProvider backend={HTML5Backend}>
            <Toolbox></Toolbox>
            <Playmat></Playmat>
            <CustomDragLayer />
        </DndProvider>
        
        <Logo></Logo>
    </div>
    );
}

export default App;
