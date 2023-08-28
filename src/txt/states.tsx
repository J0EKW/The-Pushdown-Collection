import React from 'react'
import { State } from '../types'
import { StateComponent } from './state'

type StatesProps = {
    states: State[],
    onRemove: Function,
    onNameUpdate: Function,
    onInitUpdate: Function,
    onAcceptUpdate: Function,
    onAlternateUpdate: Function,
    onAdd: Function
}

export const States = (props: StatesProps) => {
    let states = props.states

    const removeTransition = (id: number) => {
        document.getElementById('state' + id)?.setAttribute('class', 'txtState hide')
        let children = document.getElementById('state' + id)?.children
        if (children !== undefined) {
            for (let index = 0; index < children.length; index++) {
                const element = children[index];
                element.className += ' hide'
            }
        }
        setTimeout(() => {
            props.onRemove(id)
        }, 190)
    }

    const addState = () => {
        props.onAdd()
    }

    let elems = states.map((x, i) => {
        return (
            <StateComponent
            key={x.id}
            state={x}
            index={i}
            onRemove={(id: number) => {removeTransition(id)}}
            onNameUpdate={(id: number, name: string) => {props.onNameUpdate(id, name)}}
            onInitUpdate={(id: number, value: boolean) => {props.onInitUpdate(id, value)}}
            onAcceptUpdate={(id: number, value: boolean) => {props.onAcceptUpdate(id, value)}}
            onAlternateUpdate={(id: number, value: boolean) => {props.onAlternateUpdate(id, value)}}
            />
        )
    })

    return (
        <div className='txtStatesWrapper'>
            <h1 className='txtStatesHeader'>States</h1>
            <div className='listWrapper'>
                {elems}
                <button className='add' title={'Add new state'} onClick={() => {addState()}}>+</button>
            </div>
        </div>
    )
}
