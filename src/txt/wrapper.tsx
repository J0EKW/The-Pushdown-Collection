import React, { useState } from 'react'
import { Transitions } from './transitions'
import { State, Transition } from '../types'
import { States } from './states'

type WrapperProps = {
    transitions: Transition[],
    states: State[],
    stackCount: number,
    onRemoveTransition: Function,
    onCInputUpdate: Function,
    onCStateUpdate: Function,
    onNStateUpdate: Function,
    onCStackUpdate: Function,
    onNStackUpdate: Function,
    onNInputHeadUpdate: Function,
    onAddTransition: Function,
    onRemoveState: Function,
    onNameUpdate: Function,
    onInitUpdate: Function,
    onAcceptUpdate: Function,
    onAlternateUpdate: Function,
    onAddState: Function
}

export const Wrapper = (props: WrapperProps) => {
    let transitions = props.transitions
    let states = props.states

    const [visible, setVisible] = useState<boolean>(true)
    const [render, setRender] = useState<boolean>(true)

    const updateVisiblity = (value: boolean) => {
        document.getElementById('txtWrapper')?.setAttribute('class', value ? 'slideIn' : 'slideOut')
        if (!value) {
            setTimeout(() => {
                setRender(false)
            }, 690)
        } else {
            setRender(true)
        }
        setVisible(value)
    }

    return (
        <div id='txtWrapper'>
            { render ? (
                <div className='txtInternalWrapper'>
                <Transitions 
                transitions={transitions}
                states={states}
                stackCount={props.stackCount}
                onRemove={(id: number) => {props.onRemoveTransition(id)}}
                onCInputUpdate={(id: number, value: string) => {props.onCInputUpdate(id, value)}}
                onCStateUpdate={(id: number, name: string) => {props.onCStateUpdate(id, name)}}
                onNStateUpdate={(id: number, name: string) => {props.onNStateUpdate(id, name)}}
                onCStackUpdate={(id: number, value: string, index: number) => {props.onCStackUpdate(id, value, index)}}
                onNStackUpdate={(id: number, value: string, index: number) => {props.onNStackUpdate(id, value, index)}}
                onNInputHeadUpdate={(id: number, value: number) => {props.onNInputHeadUpdate(id, value)}}
                onAdd={() => {props.onAddTransition()}}
                />
                <States
                states={states}
                onRemove={(id: number) => {props.onRemoveState(id)}}
                onNameUpdate={(id: number, name: string) => {props.onNameUpdate(id, name)}}
                onInitUpdate={(id: number, value: boolean) => {props.onInitUpdate(id, value)}}
                onAcceptUpdate={(id: number, value: boolean) => {props.onAcceptUpdate(id, value)}}
                onAlternateUpdate={(id: number, value: boolean) => {props.onAlternateUpdate(id, value)}}
                onAdd={() => {props.onAddState()}}
                />
                </div>
            ) : (<></>)
            }
            <button className='collapse' onClick={() => {updateVisiblity(!visible)}}>{visible ? "<" : ">"}</button>
        </div>
    )
}
