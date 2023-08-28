import React, { useEffect } from 'react'
import { Connection, State, Transition, Traversal } from '../types';

type GuiConnectionProps = {
  connection: Connection,
  cState: State,
  nState: State,
  transitions: Transition[],
  stackCount: number,
  mirror: boolean,
  scale: number,
  offset: {x: number, y: number},
  width: number,
  height: number,
  traversals: Traversal[]
}

const stacksString = (stackCount: number, transition: Transition) => {
  let value = ""
  for (let index = 0; index < stackCount; index++) {
    value += String(", " + transition.cStack[index] + "/" + transition.nStack[index])
  }
  return value
}

export const GuiConnection = (props: GuiConnectionProps) => {
  let connection = props.connection
  let cState = props.cState
  let nState = props.nState
  let guiCState = document.getElementById('guiState' + cState.id)?.getBoundingClientRect()
  let guiNState = document.getElementById('guiState' + nState.id)?.getBoundingClientRect()
  let pathD = ""
  let textY = 0
  let active = props.traversals.filter(t => props.transitions.find(tr => tr.id === t.transitionId) !== undefined)

    if (guiCState !== undefined && guiNState !== undefined) {
      let adaptedCX = ((cState.x - 100) * props.scale) + (guiCState.width / 2) + (props.width / 2) - props.offset.x
      let adaptedNX = ((nState.x - 100) * props.scale) + (guiNState.width / 2) + (props.width / 2) - props.offset.x
      let adaptedCY = ((cState.y - 100) * props.scale) + (guiCState.height / 2) + (props.height / 2) - props.offset.y
      let adaptedNY = ((nState.y - 100) * props.scale) + (guiNState.height / 2) + (props.height / 2) - props.offset.y
      
      pathD = String("M " + 
      String(adaptedCX) + " " + 
      String(adaptedCY) + " L " + 
      String(adaptedNX) + " " + 
      String(adaptedNY))
      textY = (adaptedCY + (adaptedNY - adaptedCY) / 2)
  
      if (connection.cStateId === connection.nStateId) {
        pathD = String("M " + 
        String(adaptedCX) + " " + 
        String(adaptedCY) + " a " + (40 * props.scale) + "," + (40 * props.scale) + " 45 1 1 1 0")

        textY = (adaptedCY + (adaptedNY - adaptedCY) / 2) - (70 * props.scale)
      } else if (props.mirror) {
        
        pathD = String("M " + 
        String(adaptedCX) + "," + 
        String(adaptedCY + ((adaptedNY > adaptedCY ? 30 : -30) * props.scale)) + " Q " +
        String(adaptedCX + (adaptedNX - adaptedCX) / 2) + "," + 
        String(adaptedCY + (adaptedNY - adaptedCY) / 2 + ((adaptedNY > adaptedCY ? 150 : -150) * props.scale)) + " " + 
        String(adaptedNX) + "," +
        String(adaptedNY + ((adaptedNY > adaptedCY ? 30 : -30) * props.scale)))

        textY = (adaptedCY + (adaptedNY - adaptedCY) / 2) + ((adaptedNY > adaptedCY ? 100 : -90) * props.scale)
      }
      document.getElementById('path' + connection.id)?.setAttribute('d', pathD)

      return (
        <svg id={'connection' + connection.id}>
          <path id={'path' + connection.id} d={pathD} markerEnd='url(#head)' stroke="rgb(128, 128, 128)" strokeWidth={String(props.scale * 10)} fill="none"/>
          {props.transitions.map((y, i) => {
                return(
                  <text id={'guiTransition' + y.id} filter={active.find(a => a.transitionId === y.id) ? "url(#active)" : "url(#solid)"} key={y.id} x={adaptedCX + (adaptedNX - adaptedCX) / 2} y={textY - (i * 25 * props.scale)} fill='white' fontSize={String(20 * props.scale)} textAnchor='middle'>
                    <tspan >
                      {y.cInput + stacksString(props.stackCount, y)
                    }</tspan>
                  </text>
                );
                  })}
        </svg>
      );
    }
    return (<></>)
    
}
