import React from 'react'
import { State, Traversal } from '../types'

type GuiStateProps = {
    width: number,
    height: number,
    state: State,
    scale: number,
    offset: {x: number, y: number},
    onStatePosUpdate: Function,
    traversals: Traversal[]
}

export const GuiState = (props: GuiStateProps) => {
    let state = props.state
    let target = props.traversals.filter(t => t.stateId === state.id).length > 0
    

    if (state.alternating) {
        return(
        <svg id={'guiState' + state.id} className={'guiState'} x={"50%"} y={"50%"} width={'200px'} height={'200px'} transform={"translate(" + (((state.x - 100) * props.scale) - props.offset.x) + ", " + (((state.y - 100) * props.scale) - props.offset.y) + ") scale(" + props.scale + ")"} >
            {state.accepting && <circle id={'accept' + state.id} className='draggable svg' cx={"50%"} cy={"50%"} r={"26"} stroke="white" strokeWidth="3%" fill="transparent"/>}
            {state.initial && <path id={'start' + state.id} d={"M0,40 L20,60 L0,80, Z"} stroke="white" strokeWidth="0%" fill="white"/>}
            <circle id={'StateCircle' + state.id} className='draggable svg' cx={"50%"} cy={"50%"} r={'20%'} stroke="white" strokeWidth="3%" fill="white"/>
            <text className='svg' x={"50%"} y={"50%"} fill='black' fontSize='30' textAnchor='middle' transform={"translate(0, 8)"}>{state.name}</text>
        </svg>
        )
    }
    return (
        <svg id={'guiState' + state.id} className={'guiState'} x={"50%"} y={"50%"} width={'200px'} height={'200px'} transform={"translate(" + ((state.x - 100) * props.scale - props.offset.x) + ", " + (((state.y - 100) * props.scale - props.offset.y)) + ") scale(" + props.scale + ")"} >
            {state.accepting && <circle id={'accept' + state.id} className='draggable svg' cx={"50%"} cy={"50%"} r={"26%"} stroke="white" strokeWidth="1%" fill="transparent"/>}
            {state.initial && <path id={'start' + state.id} d={"M20,70 L60,100 L20,130, Z"} stroke="white" strokeWidth="0%" fill="white"/>}
            <circle id={'stateCircle' + state.id} className='draggable svg' cx={"50%"} cy={"50%"} r={'20%'} stroke="white" strokeWidth="1%" fill={target ? "rgb(0, 100, 100)" : "rgb(44, 44, 44)"}/>
            <text className='svg' x={"50%"} y={"50%"} fill='white' fontSize='30' textAnchor='middle' transform={"translate(0, 8)"}>{state.name}</text>
        </svg>
  )
}
