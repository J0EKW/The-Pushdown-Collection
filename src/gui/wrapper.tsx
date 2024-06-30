import React, { useEffect, useState } from 'react'
import { Connection, State, Transition, Traversal } from '../types'
import { GuiState } from './state'
import { GuiConnection } from './connection'
import { GuiButtons } from './buttons'
import { CMNone } from '../contextMenu/none'
import { CMState } from '../contextMenu/state'
import { CMTransition } from '../contextMenu/transition'
import { TweenLite, gsap } from 'gsap'
import { setUncaughtExceptionCaptureCallback } from 'process'

type GuiWrapperProps = {
    colour: String,
    states: State[],
    transitions: Transition[],
    connections: Connection[],
    traversals: Traversal[],
    stackCount: number,
    scale: number,
    interactMode: number,
    onStatePosUpdate: Function,
    onScaleUpdate: Function,
    onPosUpdate: Function,
    onInteractModeUpdate: Function,
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

const getMousePosition = (evt:React.MouseEvent<SVGCircleElement|SVGSVGElement|SVGTextElement, MouseEvent>) => {
    var CTM = evt.currentTarget.getScreenCTM();
    if (CTM !== null) {
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
      };
    }
    return {
      x: 0,
      y: 0
    };
  }

const findMirrorConnections = (cStateId:number, nStateId:number, connections: Connection[]): boolean => {
  connections = connections.filter(c => c.cStateId === nStateId && c.nStateId === cStateId);
  return connections.length > 0;
}

const isPointInBox = (point: {x: number, y: number}, boxId: string, restriction: number): boolean => {
  let box = document.getElementById(boxId)?.getBoundingClientRect()
  return (box !== undefined && 
    point.x > box.left + restriction &&
    point.x < box.right - restriction &&
    point.y > box.top + restriction &&
    point.y < box.bottom - restriction
  )
}

export const GuiWrapper = (props: GuiWrapperProps) => {
    let states = props.states
    let connections = props.connections
    let wrapper = document.getElementById('gui')
    let headerOffset = Number(document.getElementById('header')?.getBoundingClientRect().height) ?? 0
    const isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const centrePos = {x: ((wrapper ? wrapper.clientWidth : window.innerWidth) / 2), y: ((wrapper ? wrapper.clientHeight : window.innerHeight - 150) / 2)}

    // -2 means the screen is grabbed
    // -1 means nothing is grabbed
    // 'n' means state with id 'n' is grabbed
    const [selected, setSelected] = useState<number>(-1)
    const [offset, setOffset] = useState({x:0, y:0});
    const [scale, setScale] = useState<number>(100)
    const [position, setPosition] = useState<{x: number, y: number}>({x: 0, y: 0})
    const [firstState, setFirstState] = useState<State | undefined>(undefined)
    const [tempPos, setTempPos] = useState<{x: number, y: number}>({x: 0, y: 0})
    const [mousePos, setMousePos] = useState<{x: number, y: number}>({x: 0, y: 0})
    const [contextMenu, setContextMenu] = useState<number>(0)
    const [contextMenuPos, setContextMenuPos] = useState<{x: number, y: number}>({x: 0, y: 0})
    const [cmState, setCMState] = useState<State>({id: -1, name: 'placeholder', initial: false, accepting: false, alternating: false, x: 0, y: 0})
    const [cmTransition, setCMTransition] = useState<Transition>({id: -1, cStateId: -1, nStateId: -1, cStack: ['Z'], nStack: ['Z'], cInput: '0', nInputHead: 1})

    const handleMouseDown = (evt:React.MouseEvent) => {
      if (evt.buttons !== 1) { return }
      let offsetTemp = {x: evt.clientX, y: evt.clientY};
      
      switch ( props.interactMode ) {
        case 0: //click & drag
          let boundary = isFirefox ? 0.6 : 0.05
          let selectedState: State | undefined = undefined
          let selectedTemp: number = -2

          for (let index = 0; index < states.length; index++) {
            const state = states[index];
            if (isPointInBox(offsetTemp, 'guiState' + state.id, boundary * scale)) {
              selectedState = state
              break;
            }
          }

          if (selectedState !== undefined) {
            offsetTemp.x = offsetTemp.x - (centrePos.x + (selectedState.x * (scale / 100)));
            offsetTemp.y = offsetTemp.y - (centrePos.y + (selectedState.y * (scale / 100)));
            selectedTemp = selectedState.id
          } else {
            offsetTemp.x = offsetTemp.x + position.x;
            offsetTemp.y = offsetTemp.y + position.y;
          }

          setOffset(offsetTemp)
          setSelected(selectedTemp)
          if (firstState !== undefined) { setFirstState(undefined) }

          break;
        case 1: //add state

          addState(offsetTemp.x, offsetTemp.y)
          if (firstState !== undefined) { setFirstState(undefined) }

          break;
        case 2: //add transition
          
          let newFirstState = firstState
          for (let index = 0; index < states.length; index++) {
            const state = states[index];
            if (isPointInBox(offsetTemp, 'guiState' + state.id, 0)) {
              if (firstState === undefined) {
                let adaptedX = (state.x * (scale / 100)) + centrePos.x - position.x
                let adaptedY = (state.y * (scale / 100)) + centrePos.y - position.y
                setTempPos({x: adaptedX, y: adaptedY})
                setMousePos(offsetTemp)
                newFirstState = state
              } else {
                props.onAddTransition(firstState, state)
                newFirstState = undefined
              }
              break;
            }
          }
          setFirstState(newFirstState)

          break;
        case 3: //remove anything

          for (let index = 0; index < states.length; index++) {
            const state = states[index];
            if (isPointInBox(offsetTemp, 'stateCircle' + state.id, 0)) {
              props.onRemoveState(state.id)
              return;
            }
          }

          for (let index = 0; index < props.transitions.length; index++) {
            const transition = props.transitions[index];
            if (isPointInBox(offsetTemp, 'guiTransition' + transition.id, 0)) {
              props.onRemoveTransition(transition.id)
              return;
            }
          }

          if (firstState !== undefined) { setFirstState(undefined) }
          break;
        default: //error
          console.log("ERROR: interactive mode is impossible number")
          break;
      }
      
      setContextMenu(0)
    }
  
    const drag = (evt:React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      if (props.interactMode === 2 && firstState !== undefined) {
        setMousePos({x: evt.clientX, y: evt.clientY})
        return;
      }

      let coord = getMousePosition(evt);
      let newX = (offset.x - coord.x);
      let newY = (offset.y - coord.y) - headerOffset;

      if (selected >= 0) {
        newX = ((coord.x - centrePos.x) - offset.x) / (scale / 100);
        newY = (((coord.y - centrePos.y) - offset.y) / (scale / 100)) + headerOffset;
        props.onStatePosUpdate(selected, newX, newY)
        let stateElem = document.getElementById('guiState' + selected)
        if (stateElem) {
          stateElem.style.transform = "translate(5, 5); scale(1);"
          console.log("yuup")
        }
        return;
      }

      if (selected == -2) {
        props.onPosUpdate({x: newX, y: newY})
        setPosition({x: newX, y: newY})
      }
    }

    const zoom = (evt: WheelEvent) => {
      let txt = document.getElementById('txtWrapper')?.getBoundingClientRect()
      let options = document.getElementById('optionsWrapper')?.getBoundingClientRect()
      let sim = document.getElementById('simWrapper')?.getBoundingClientRect()
      let newScale = scale

      if (
        txt !== undefined &&
        sim !== undefined &&
        options !== undefined &&
        evt.pageX > txt.right &&
        evt.pageX < options.left &&
        evt.pageY > headerOffset &&
        evt.pageY < sim.top
      ) {
        if (evt.deltaY < 0 && scale < 300) {
          newScale += 10
        } else if (evt.deltaY > 0 && scale > 20) {
          newScale -= 10
        }

        if (firstState) {
          let guiState = document.getElementById('guiState' + firstState.id)?.getBoundingClientRect()
          if (guiState !== undefined) {
            let adaptedX = (firstState.x * (newScale / 100)) + centrePos.x + offset.x
            let adaptedY = (firstState.y * (newScale / 100)) + centrePos.y + offset.y
            setTempPos({x: adaptedX, y: adaptedY})
            setMousePos({x: evt.clientX, y: evt.clientY})
          }
        }
        setScale(newScale)
        props.onScaleUpdate(newScale)
      }
    }

    const handleContextMenu = (evt:React.MouseEvent<SVGCircleElement|SVGTextElement, MouseEvent>) => {
      evt.preventDefault()
      let boundary = isFirefox ? 0.6 : 0.05
      let contextMenu = 1
      for (let index = 0; index < states.length; index++) {
        const state = states[index];
        if (isPointInBox({x: evt.clientX, y: evt.clientY}, 'guiState' + state.id, boundary * scale)) {
          contextMenu = 2
          setCMState(state)
          break;
        }
      }

      if (contextMenu === 1) {
        for (let index = 0; index < props.transitions.length; index++) {
          const transition = props.transitions[index];
          if (isPointInBox({x: evt.clientX, y: evt.clientY}, 'guiTransition' + transition.id, 0)) {
            contextMenu = 3
            setCMTransition(transition)
            break;
          }
        }
      }

      setContextMenu(contextMenu)
      setContextMenuPos({x: evt.clientX, y: evt.clientY})
    }

    const addState = (x: number, y: number) => {
      let s = scale / 100
      let adaptedX = ((x - centrePos.x + position.x) / s);
      let adaptedY = ((y - centrePos.y + position.y) / s) - headerOffset;
      props.onAddState(adaptedX, adaptedY)
    }


    document.addEventListener("wheel", (evt: WheelEvent) => {zoom(evt)})
    return (
      <>
        <svg id='gui' className={props.colour + ' gui'} onMouseMove={(e) => drag(e)} onMouseUp={() => setSelected(-1)} onMouseDown={(e:React.MouseEvent) => handleMouseDown(e)} onContextMenu={(e:any) => {handleContextMenu(e)}}>
          <defs>
            <marker 
              id='head' 
              orient="auto" 
              markerWidth='10' 
              markerHeight='10' 
              refX='6'
              refY='3'
            >
              <path d='M0,0 V6 L5,3 Z' className={'arrow'}/>
            </marker>
            <filter x="0" y="0" width="1" height="1" id="solid">
                <feFlood result="bg" />
                <feMerge>
                  <feMergeNode in="bg"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter x="0" y="0" width="1" height="1" id="active">
                <feFlood result="bg" />
                <feMerge>
                  <feMergeNode in="bg"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
          </defs>
          <rect className={'xAxis'} y={'50%'} width={'100vw'} height={'5px'} transform={"translate(0, " + -position.y + ") scale(1, " + scale / 100 + ")"} />
          <rect className={'yAxis'} x={'50%'} width={'5px'} height={'100vh'} transform={"translate(" + -position.x + ", 0) scale(" + scale / 100 + ", 1)"} />
          {firstState && <path d={'M ' + String(tempPos.x) + ',' + String(tempPos.y) + ' L ' + String(mousePos.x) + ',' + String(mousePos.y - 40)} strokeWidth={String(scale / 10) + 'px'} className='tempConnection'/>}
          {connections.map((x, i) => {
              let cState = states.find(s => s.id === x.cStateId)
              let nState = states.find(s => s.id === x.nStateId)
              let transitions = props.transitions.filter(t => x.transitionIds.find(c => c === t.id) !== undefined)
              if (cState !== undefined && nState !== undefined) {
                let mirror = findMirrorConnections(cState.id, nState.id, connections)
                return (
                  <GuiConnection colour={props.colour} key={x.id} connection={x} cState={cState} nState={nState} transitions={transitions} stackCount={props.stackCount} mirror={mirror} scale={scale / 100} offset={position} width={wrapper ? wrapper.clientWidth : window.innerWidth} height={wrapper ? wrapper.clientHeight : window.innerHeight} traversals={props.traversals} />
                )
              }
            })}
            {states.map((x, i) => {
              let stateElem = <GuiState colour={props.colour} key={x.id} state={x} width={wrapper ? wrapper.clientWidth : window.innerWidth} height={wrapper ? wrapper.clientHeight : window.innerHeight} scale={scale / 100} offset={position}  onStatePosUpdate={(id: number, x: number, y: number) => {props.onStatePosUpdate(id, x, y)}} traversals={props.traversals}/>
              return stateElem
            })}
        </svg>
        <GuiButtons colour={props.colour} interactMode={props.interactMode} onInteractModeUpdate={(value: number) => {props.onInteractModeUpdate(value)}} />
        {(contextMenu === 1) && <CMNone
            colour={props.colour} 
            left={contextMenuPos.x}
            top={contextMenuPos.y}
            onAddState={() => {addState(contextMenuPos.x, contextMenuPos.y)}}/>}
        {(contextMenu === 2) && <CMState
            colour={props.colour} 
            left={contextMenuPos.x}
            top={contextMenuPos.y}
            state={cmState}
            onRemove={(id: number) => {props.onRemoveState(id)}}
            onNameUpdate={(id: number, name: string) => {props.onNameUpdate(id, name)}}
            onInitUpdate={(id: number, value: boolean) => {props.onInitUpdate(id, value)}}
            onAcceptUpdate={(id: number, value: boolean) => {props.onAcceptUpdate(id, value)}}
            onAlternateUpdate={(id: number, value: boolean) => {props.onAlternateUpdate(id, value)}}/>}
        {(contextMenu === 3) && <CMTransition 
            colour={props.colour} 
            left={contextMenuPos.x}
            top={contextMenuPos.y}
            transition={cmTransition}
            cState={states.find(s => s.id === cmTransition.cStateId)?.name ?? ''}
            nState={states.find(s => s.id === cmTransition.nStateId)?.name ?? ''}
            onRemove={(id: number) => {props.onRemoveTransition(id)}}
            onCInputUpdate={(id: number, value: string) => {props.onCInputUpdate(id, value)}}
            onCStateUpdate={(id: number, name: string) => {props.onCStateUpdate(id, name)}}
            onNStateUpdate={(id: number, name: string) => {props.onNStateUpdate(id, name)}}
            onCStackUpdate={(id: number, value: string, index: number) => {props.onCStackUpdate(id, value, index)}}
            onNStackUpdate={(id: number, value: string, index: number) => {props.onNStackUpdate(id, value, index)}}
            onNInputHeadUpdate={(id: number, value: number) => {props.onNInputHeadUpdate(id, value)}}/>}
      </>
    )
}
