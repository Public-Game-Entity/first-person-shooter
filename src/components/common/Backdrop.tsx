
/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react'


type BackdropType = {
    isOpen?: any
    children?: any
    style?: any
}

const Backdrop = ({ isOpen, style, children }: BackdropType) => {
    const [open, setOpen] = useState(false)
    const backgroundBlur = {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(18, 18, 18, 0.7)',
    }

    const backdropStyle = css({
        position: "absolute",
        width: "100%", 
        height: "100%", 
        display: open ? "" : "none",
        ...backgroundBlur, 
        ...style, 
    })


    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen])

    return (
       <div css={backdropStyle}>
            {children}
       </div>
    )
}

export { Backdrop }
