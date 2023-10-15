/** @jsxImportSource @emotion/react */

import React from 'react';
import { css } from '@emotion/react'


const Reticle = ({ isDisplay = true }) => {
    return (
        <div css={css({ position: 'absolute', left: '50%', top: "50%", transform: 'translate(-50%, -50%)' })} style={{ display: isDisplay? "": "none" }} id="reticle">
            <div css={css({ position: 'absolute', width: '0.1rem', height: "1.1rem", top: "-0.5rem", backgroundColor: "#bfbfbf" })}></div>
            <div css={css({ position: 'absolute', width: '1.1rem', height: "0.1rem", left: "-0.5rem", backgroundColor: "#bfbfbf" })}></div>
        </div>
    )
}

export { Reticle }