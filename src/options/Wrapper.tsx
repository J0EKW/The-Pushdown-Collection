import React, { useState } from 'react'
import { OptionsType, State, Transition } from '../types'
import { Visual } from './Visual'
import { Animation } from './Animation'
import { Automaton } from './Automaton'
import { Input } from './Input'
import { Stack } from './Stack'
import '../App.css';

type OptionWrapperProps = {
    colour: String
}

export const OptionWrapper = (props: OptionWrapperProps) => {

    const [visible, setVisible] = useState<boolean>(false)
    const [render, setRender] = useState<boolean>(false)
    const [to, setTo] = useState<NodeJS.Timeout>()

    const updateVisibility = (visibility: boolean) => {
        let newClass = visibility ? "slideLeft" : "slideRight"
        document.getElementById('optionsInternalWrapper')?.setAttribute('class', props.colour + ' ' + newClass)
        document.getElementById('collapse')?.setAttribute('class', props.colour + ' ' + newClass)
        if (!visibility) {
            setTo(setTimeout(() => {
                setRender(false)
            }, 690))
        } else {
            setRender(true)
        }
        setVisible(visibility)
    }

    return (
        <div id='optionsWrapper'>
        <button id='collapse' className={props.colour + ''} onClick={() => {updateVisibility(!visible)}}>{visible ? ">" : "<"}</button>
            { render ? (
                <div id='optionsInternalWrapper' className={props.colour + ' slideLeft'}>
                    <Animation colour={props.colour}/>
                    <Automaton colour={props.colour}/>
                    <Input colour={props.colour}/>
                    <Stack colour={props.colour}/>
                    <Visual colour={props.colour}/>
                    <h1 className={props.colour + ' optionFooter'}/>
                </div>
            ) : (<></>)
            }
        </div>
    )
}
