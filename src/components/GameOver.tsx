import React, { useEffect, useState } from 'react';
import { Button } from './common/Button';
import { Backdrop } from './common/Backdrop';
import store from '../store'
import { setStart } from '../features/gameSlice';


const GameOver = () => {
    const [isOpen, setIsOpen] = useState(false)

    const isGameOver = () => {
        const state = store.getState()
        if (state.game.isGameOver == false) {
            return 0
        }

        setIsOpen(true)
    }

    useEffect(() => {
        store.subscribe(() => isGameOver())
    }, [])


    return (
        <div>
            <Backdrop isOpen={isOpen} style={{ textAlign: "center", animationName: 'fadeIn', animationDuration: '1s', animationIterationCount: 1 }}>
                <h2 style={{ color: "#ffffff", fontSize: "2rem" }}>Game Over</h2>

            </Backdrop>
        </div>
    );
};


export { GameOver }