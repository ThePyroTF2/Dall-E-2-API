import { React, useState, useEffect } from 'react'
import '../css/RippleButton.css'

export const RippleButton = ({ children, search, prompt}) => {
    const [isRipple, setIsRipple] = useState(true)
    const [coords, setCoords] = useState({x: -1, y: -1})
    const [isClicked, setIsClicked] = useState('')

    useEffect(() => {
        if(coords.x !== -1 && coords.y !== -1) {
            setIsRipple(true)

            setTimeout(() => setIsRipple(false), 600)
        }
        else {
            setIsRipple(false)
        }
    }, [coords])

    useEffect( () => {
        if(!isRipple) setCoords({x: -1, y:-1 })
        setIsClicked(isRipple ? 'clicked' : '')
    }, [isRipple])

    return (
        <button
            className={`ripple_btn ${isClicked}`}
            onClick={(event) => {
                search(prompt)
                setCoords({
                    x: event.clientX - event.target.offsetLeft,
                    y: event.clientY - event.target.offsetTop
                })
            }}
        >
            {isRipple ? <span className='ripple' style={{top: `${coords.y}px`, left: `${coords.x}px`}}/> : ""}
            <span className='content'>{children}</span>
        </button>
    )
}
