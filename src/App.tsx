import React, { FC } from 'react';
import './App.css';
import Logo from './component/Logo/Logo';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '@fortawesome/fontawesome-free/css/all.css';
import Playmat from './component/Playmat/Playmat';
import { CustomDragLayer } from './component/CustomDrag/CustomDragLayer';
import SettingsButton from './component/Settings/SettingsButton';
import Banner from './component/Banner/Banner';
import { useDispatch } from 'react-redux';
import { hideMenus } from './redux/actions';

const App: FC = () => {
  const dispatch = useDispatch();
  return (
    <div id="app" className="App" onMouseDown={() => dispatch(hideMenus())}>
      <DndProvider backend={HTML5Backend}>
        <Playmat />
        <CustomDragLayer />
      </DndProvider>

      <Logo />
      <Banner>Under Construction</Banner>
      <SettingsButton />
    </div>
  );
};

export default App;
