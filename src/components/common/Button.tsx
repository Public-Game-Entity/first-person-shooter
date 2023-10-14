/** @jsxImportSource @emotion/react */

import React, { useState } from 'react';
import { css } from '@emotion/react'


type ButtonType = {
    onClick?: any
    style?: any
    disable?: any
    backgroundColor?: any
    children?: any
}

const Button = ({ onClick, style, disable = false, backgroundColor = 'blue', children }: ButtonType) => {
    const backgroundColorList: any = {
        "blue": "#055ef2",
        "gray": "#2b2e33",
        "none": "#00000000",
        "disable": "#131821"
    }

    const buttonStyle = css({
        boxShadow: 'none',
        padding: "1rem 3rem",
        fontFamily: "'Noto Sans KR', sans-serif",
        color: disable ? "#c6c8cc" : "#ffffff",
        fontSize: "1rem",
        border: '0', 
        backgroundColor: disable ? backgroundColorList['disable'] : backgroundColorList[backgroundColor], 
        borderRadius: "0.5rem", 
        outline: "none",
        ...style
    })


    const onClickNotThing = () => {
        console.log()
    }

    return (
        <button onClick={disable ? onClickNotThing : onClick} css={buttonStyle}>{children}</button>
    )
}

export { Button }