import React from 'react'

type ButtonsProps = {
    colour: String,
    onRun: Function,
    onStep: Function,
    onReset: Function
}

export const Buttons = (props: ButtonsProps) => {
  
    return (
    <div className={props.colour + ' simButtonsWrapper'}>
        <input type='button' title='Run' className={props.colour + ' simButton'} onClick={() => {props.onRun()}} value='≫'/>
        <input type='button' title='step' className={props.colour + ' simButton'} onClick={() => {props.onStep()}} value='>'/>
        <input type='button' title='reset' className={props.colour + ' simButton'} onClick={() => {props.onReset()}} value='↺'/>
    </div>
  )
}
