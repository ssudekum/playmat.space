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

const App: FC = () => {
  console.log("page render");
  return (
    <div id="app" className="App">
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
