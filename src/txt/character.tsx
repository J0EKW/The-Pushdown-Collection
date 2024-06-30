import React, { useState } from 'react'

type CharacterProps = {
    char: string,
    colour:string,
    handleAlphabet:Function
}

export const Character = (props: CharacterProps) => {
    const [char, setChar] = useState<string>(props.char)

    const handleCharChange = (e: any) => {
        if (e.key === 'Enter') {
            props.handleAlphabet(char)
        }
    }

    return (<input type='input' className={props.colour + ' boxInput'} maxLength={1} value={char} onChange={(e) => setChar(e.currentTarget.value)} onKeyDown={(e) => {handleCharChange(e)}}/>)
}