import React from 'react'
import { SetUp } from './setUp'
import { Buttons } from './buttons'
import { SimStateWrapper } from './simStateWrapper'
import { State, Traversal } from '../types'

type WrapperProps = {
    input: string,
    stacks: string[],
    currentTraversals: Traversal[],
    states: State[]
    haltCond: boolean
    onInputUpdate: Function,
    onStacksUpdate: Function,
    onRun: Function,
    onStep: Function,
    onReset: Function,
    setSelected: Function
}

export const Wrapper = (props: WrapperProps) => {
  
    return (
    <div className='simWrapper'>
        <SetUp 
        input={props.input}
        stacks={props.stacks}
        onInputUpdate={(value: string) => {props.onInputUpdate(value)}}
        onStacksUpdate={(index: number, value: string) => {props.onStacksUpdate(index, value)}}
        />
        <Buttons
        onRun={() => {props.onRun()}}
        onStep={() => {props.onStep()}}
        onReset={() => {props.onReset()}} />
        <SimStateWrapper 
        input={props.input}
        currentTraversals={props.currentTraversals}
        states={props.states}
        haltCond={props.haltCond}
        setSelected={(value: number) => {props.setSelected(value)}} />
    </div>
  )
}
