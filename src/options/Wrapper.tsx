import React, { useState } from 'react'
import { OptionsType, State, Transition } from '../types'
import { Visual } from './Visual'
import { Animation } from './Animation'
import { Automaton } from './Automaton'
import { Input } from './Input'
import { Stack } from './Stack'
import '../App.css';
import './options.css';

export const Wrapper = () => {

    const [visible, setVisible] = useState<boolean>(true)
    const [render, setRender] = useState<boolean>(false)
    const [to, setTo] = useState<NodeJS.Timeout>()

    const updateVisiblity = () => {
        if (!visible) {
            document.getElementsByClassName('optionsInternalWrapper')[0]?.setAttribute('class', 'optionsInternalWrapper close')
            setTo(setTimeout(() => {
                setRender(false)
            }, 690))
        } else {
            setRender(true)
            clearTimeout(to)
            setTimeout(() => {
                document.getElementsByClassName('optionsInternalWrapper')[0]?.setAttribute('class', 'optionsInternalWrapper')
            }, 1)
        }
        setVisible(!visible)
    }

    return (
        <div id='optionsWrapper'>
        <button className='collapse' onClick={() => {updateVisiblity()}}>{visible ? "<" : ">"}</button>
            { render ? (
                <div className='optionsInternalWrapper close'>
                    <Animation />
                    <Automaton />
                    <Input />
                    <Stack />
                    <Visual />
                    <h1 className='optionFooter'/>
                </div>
            ) : (<></>)
            }
        </div>
    )
}
