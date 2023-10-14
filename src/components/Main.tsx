/** @jsxImportSource @emotion/react */

import React, { useState } from 'react';
import { Button } from './common/Button';
import { Backdrop } from './common/Backdrop';
import store from '../store'
import { setStart } from '../features/gameSlice';
import { css } from '@emotion/react'

const Main: any = () => {
    const [isOpen, setIsOpen] = useState(false)

    const [backdropStyle, setBackdropStyle] = useState({})

    const onClickGameStart = () => {
        const fadeDuration = 1
        setBackdropStyle({ animationName: 'fadeOut', animationDuration: fadeDuration + 's', animationIterationCount: 1 })

        setTimeout(() => {
            setIsOpen(false)
        }, fadeDuration * 1000)

        store.dispatch(setStart({
            isStart: true
        }))
    }

    return (
        <div>
            <Backdrop isOpen={isOpen} style={{ textAlign: "center", ...backdropStyle }}>

                <MainTop>
                    <h2 css={css({ color: "#ffffff", fontSize: "2rem" })}>First Person Shooter</h2>

                    <Description></Description>
                </MainTop>

                
                <MainFooter>
                    <Button onClick={onClickGameStart} style={{ animationName: 'jumping', animationDuration: '5s', animationIterationCount: 100 }}>게임 시작</Button>
                </MainFooter>

            </Backdrop>
        </div>
    );
};

const MainFooter = ({ children }: any) => {
    return (
        <div css={css({ position: "fixed", bottom: "2rem", width: "100%", textAlign: "center" })}>
            {children}

        </div>
    )
}

const MainTop = ({ children }: any) => {
    return (
        <div css={css({ position: "fixed", top: "2rem", width: "100%", textAlign: "center" })}>
            {children}

        </div>
    )
}

const Description = () => {
    return (
        <div css={css({ display: "flex", justifyContent: "center", marginTop: "2rem" })}>
            <div css={css({ display: "grid" })}>
                <p css={css({ color: "#e1e3e6" })}>
                1인칭 슈팅게임
                Made By <a style={{ color: "#ffffff" }} href="https://hhj.devent.kr/" target="_blank" rel="noopener noreferrer">@huh.hyeongjun</a>
                </p>
                <p style={{ color: "#e1e3e6" }}>
                    <TypoBox>W, A, S, D</TypoBox> 이동 하기
                </p>
                <p style={{ color: "#e1e3e6" }}>
                    <TypoBox>Space</TypoBox> 점프
                </p>
            </div>
        </div>

    )
}

const TypoBox = ({ children }: any) => {
    const boxStyle = css({ 
        display: "inline", 
        width: "1.2rem", 
        height: "1.2rem",
        marginRight: "1rem", 
        padding: "0.4rem", 
        fontSize: "1rem", 
        color: "#e1e3e6", 
        backgroundColor: "#1d1f21",
        borderRadius: "0.2rem"
    })

    return (
        <div css={boxStyle}>
            {children}
        </div>
    )
}

export { Main };