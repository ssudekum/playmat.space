import React, { FC } from 'react';
import './App.css';
import './component/Modal/Modal.css'
import Logo from './component/Logo/Logo';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '@fortawesome/fontawesome-free/css/all.css';
import Playmat from './component/Playmat/Playmat';
import { CustomDragLayer } from './component/CustomDrag/CustomDragLayer';
import SettingsButton from './component/Settings/SettingsButton';
import { useDispatch } from 'react-redux';
import { decreaseCardSize, hideContextMenus, increaseCardSize, setIsDragging } from './redux/actions';
import IconButton from './component/IconButton/IconButton';

const App: FC = () => {
  const dispatch = useDispatch();

  return (
    <div 
      id="app"
      className="App"
      onMouseDown={() => {
        dispatch(hideContextMenus());
      }}
      onMouseUp={() => {
        dispatch(setIsDragging(false));
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <Playmat />
        <CustomDragLayer />
      </DndProvider>

      <Logo />

      <SettingsButton />
      
      <IconButton
        icon="fas fa-search-plus"
        onClick={() => dispatch(increaseCardSize())}
        style={{
          top: '75px', 
          right: '25px',
        }}
      />

      <IconButton
        icon="fas fa-search-minus"
        onClick={() => dispatch(decreaseCardSize())}
        style={{
          top: '130px', 
          right: '25px',
        }}
      />
    </div>
  );
};

export default App;
