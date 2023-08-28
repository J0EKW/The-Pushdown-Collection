import React from 'react'

type ButtonsProps = {
    onRun: Function,
    onStep: Function,
    onReset: Function
}

export const Buttons = (props: ButtonsProps) => {
  
    return (
    <div className='simButtonsWrapper'>
        <input type='button' title='Run' className='simButton' onClick={() => {props.onRun()}} value='≫'/>
        <input type='button' title='step' className='simButton' onClick={() => {props.onStep()}} value='>'/>
        <input type='button' title='reset' className='simButton' onClick={() => {props.onReset()}} value='↺'/>
    </div>
  )
}
