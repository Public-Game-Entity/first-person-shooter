import React from 'react';
import './App.css'

import { Main } from './components/Main'
import { GameOver } from './components/GameOver';


const App: any = () => {
    return (
        <div>
            <Main></Main>
            <GameOver></GameOver>


        </div>
    );
};

export default App;