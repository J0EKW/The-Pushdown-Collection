import React, { useEffect, useState } from 'react'
import { Connection, State, Transition, Traversal } from '../types'
import { GuiState } from './state'
import { GuiConnection } from './connection'
import { GuiButtons } from './buttons'
import { CMNone } from '../contextMenu/none'
import { CMState } from '../contextMenu/state'
import { CMTransition } from '../contextMenu/transition'
import { TweenLite, gsap } from 'gsap'

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

export const GuiWrapper = (props: GuiWrapperProps) => {
    let states = props.states
    let connections = props.connections
    let wrapper = document.getElementById('gui')
    const [selected, setSelected] = useState<number>(-1)
    const [offset, setOffset] = useState({x:0, y:0});
    const [scale, setScale] = useState<number>(100)
    const [position, setPosition] = useState<{x: number, y: number}>({x: 0, y: 0})
    const [firstState, setFirstState] = useState<State | undefined>(undefined)
    const [tempX, setTempX] = useState<number>(0)
    const [tempY, setTempY] = useState<number>(0)
    const [mouseX, setMouseX] = useState<number>(0)
    const [mouseY, setMouseY] = useState<number>(0)
    const [noneContextMenu, setNoneContextMenu] = useState<boolean>(false)
    const [stateContextMenu, setStateContextMenu] = useState<boolean>(false)
    const [transitionContextMenu, setTransitionContextMenu] = useState<boolean>(false)
    const [contextMenuPos, setContextMenuPos] = useState<{x: number, y: number}>({x: 0, y: 0})
    const [cmState, setCMState] = useState<State>({id: -1, name: 'placeholder', initial: false, accepting: false, alternating: false, x: 0, y: 0})
    const [cmTransition, setCMTransition] = useState<Transition>({id: -1, cStateId: -1, nStateId: -1, cStack: ['Z'], nStack: ['Z'], cInput: '0', nInputHead: 1})

    const handleMouseDown = (evt:React.MouseEvent) => {
        let offsetTemp = {x: evt.clientX, y: evt.clientY};
        let alignedOffset = {x: offsetTemp.x - ((wrapper ? wrapper.clientWidth : window.innerWidth) / 2), y: offsetTemp.y - ((wrapper ? wrapper.clientHeight : window.innerHeight - 150) / 2)}
        
        let contextMenu = document.getElementsByClassName('contextMenu')[0]?.getBoundingClientRect()
        if ( contextMenu !== undefined && (
          offsetTemp.x < contextMenu.left ||
          offsetTemp.x > contextMenu.right ||
          offsetTemp.y < contextMenu.top ||
          offsetTemp.y > contextMenu.bottom)) {
            setStateContextMenu(false)
            setTransitionContextMenu(false)
            setNoneContextMenu(false)
          }
        
        if (evt.buttons === 1) {
          if (props.interactMode === 1) {
            addState(evt.pageX, evt.pageY)
          } else if (props.interactMode === 2) {
            if (firstState === undefined) {
              states.forEach((x, i) => {
                let guiState = document.getElementById('guiState' + x.id)?.getBoundingClientRect()
                
                if (guiState !== undefined) {
                  if (
                    offsetTemp.x > guiState.left &&
                    offsetTemp.x < guiState.right &&
                    offsetTemp.y > guiState.top &&
                    offsetTemp.y < guiState.bottom
                  ) {
                    setFirstState(x)
                    let adaptedX = ((x.x) * (scale / 100)) + ((wrapper ? wrapper.clientWidth : window.innerWidth) / 2) - position.x
                    let adaptedY = ((x.y) * (scale / 100)) + ((wrapper ? wrapper.clientHeight : window.innerHeight - 150) / 2) - position.y
                    setTempX(adaptedX)
                    setTempY(adaptedY)
                    setMouseX(evt.pageX)
                    setMouseY(evt.pageY)
                  }
                }
              })
            } else {
              let targetState = undefined
              states.forEach((x, i) => {
                let guiState = document.getElementById('guiState' + x.id)?.getBoundingClientRect()
                
                if (guiState !== undefined) {
                  if (
                    offsetTemp.x > guiState.left &&
                    offsetTemp.x < guiState.right &&
                    offsetTemp.y > guiState.top &&
                    offsetTemp.y < guiState.bottom
                  ) {
                    targetState = x
                  }
                }
              })
              if (targetState) {
                props.onAddTransition(firstState, targetState)
              } 
              setFirstState(undefined)
            }
          } else if (props.interactMode === 3) {
            states.forEach((x, i) => {
              let guiState = document.getElementById('stateCircle' + x.id)?.getBoundingClientRect()
              
              if (guiState !== undefined) {
                if (
                  offsetTemp.x > guiState.left &&
                  offsetTemp.x < guiState.right &&
                  offsetTemp.y > guiState.top &&
                  offsetTemp.y < guiState.bottom
                ) {
                  props.onRemoveState(x.id)
                }
              }
            })
  
            props.transitions.forEach((x, i) => {
              let guiTransition = document.getElementById('guiTransition' + x.id)?.getBoundingClientRect()
              
              if (guiTransition !== undefined) {
                if (
                  offsetTemp.x > guiTransition.left &&
                  offsetTemp.x < guiTransition.right &&
                  offsetTemp.y > guiTransition.top &&
                  offsetTemp.y < guiTransition.bottom
                ) {
                  props.onRemoveTransition(x.id)
                }
              }
            })
          } else {
            let id = -2
          
            states.forEach((x, i) => {
              let guiState = document.getElementById('guiState' + x.id)?.getBoundingClientRect()
              
              if (guiState !== undefined) {
                if (
                  offsetTemp.x > guiState.left + (0.6 * scale) &&
                  offsetTemp.x < guiState.right - (0.6 * scale) &&
                  offsetTemp.y > guiState.top + (0.6 * scale) &&
                  offsetTemp.y < guiState.bottom - (0.6 * scale)
                ) {
                  id = x.id
                }
              }
            })
            if (id >= 0) {
                let state = states.filter(state => state.id == id)[0];
                offsetTemp.x = offsetTemp.x - (((wrapper ? wrapper.clientWidth : window.innerWidth) / 2) + (state.x * (scale / 100)));
                offsetTemp.y = offsetTemp.y - (((wrapper ? wrapper.clientHeight : window.innerHeight - 150) / 2) + (state.y * (scale / 100)));
                setOffset(offsetTemp);
                setSelected(id);
            } else if (id === -2) {
              offsetTemp.x = offsetTemp.x + position.x;
              offsetTemp.y = offsetTemp.y + position.y;
              
              setOffset(offsetTemp);
              setSelected(-2);
            }
          }
        }
      }
  
      const drag = (evt:React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        let coord = getMousePosition(evt);
        if (props.interactMode === 2 && firstState !== undefined) {
          setMouseX(evt.pageX)
          setMouseY(evt.pageY)
        }
        if (selected >= 0) {
          let x = (((coord.x) - ((wrapper ? wrapper.clientWidth : window.innerWidth) / 2)) - offset.x) / (scale / 100);
          let y = (((coord.y) - ((wrapper ? wrapper.clientHeight : window.innerHeight - 150) / 2)) - offset.y) / (scale / 100);
          props.onStatePosUpdate(selected, x, y)

        } else  if (selected === -2){
          let newX = (offset.x - coord.x);
          let newY = (offset.y - coord.y);
          setPosition({x: newX, y: newY})
          props.onPosUpdate({x: newX, y: newY})
        }
      }

      const zoom = (e: WheelEvent) => {
        //e.preventDefault()
        let gui = document.getElementById('gui')?.getBoundingClientRect()
        let txt = document.getElementById('txtWrapper')?.getBoundingClientRect()
        let newScale = scale

        if (
          gui !== undefined &&
          txt !== undefined &&
          e.pageX > txt.right &&
          e.pageX < gui.right &&
          e.pageY > gui.top &&
          e.pageY < gui.bottom
        ) {
          if (e.deltaY < 0 && scale < 300) {
            newScale += 10
          } else if (e.deltaY > 0 && scale > 20) {
            newScale -= 10
          }

          if (firstState) {
            let guiState = document.getElementById('guiState' + firstState.id)?.getBoundingClientRect()
            if (guiState) {
              let adaptedX = ((firstState.x) * (newScale / 100)) + ((wrapper ? wrapper.clientWidth : window.innerWidth) / 2) + offset.x
              let adaptedY = ((firstState.y) * (newScale / 100)) + ((wrapper ? wrapper.clientHeight : window.innerHeight - 150) / 2) + offset.y
              setTempX(adaptedX)
              setTempY(adaptedY)
              setMouseX(e.pageX)
              setMouseY(e.pageY)
            }
          }
          setScale(newScale)
          props.onScaleUpdate(newScale)
        }
    }

      document.addEventListener("wheel", (e: WheelEvent) => {zoom(e)})
    

      const contextMenu = (event:React.MouseEvent<SVGCircleElement|SVGTextElement, MouseEvent>) => {
        event.preventDefault()
        let state = false
        let transition = false

        states.forEach((x, i) => {
          if (!state) {
            let guiState = document.getElementById('guiState' + x.id)?.getBoundingClientRect()
          
            if (guiState !== undefined) {
              if (
                event.pageX > guiState.left + (0.6 * scale) &&
                event.pageX < guiState.right - (0.6 * scale) &&
                event.pageY > guiState.top + (0.6 * scale) &&
                event.pageY < guiState.bottom - (0.6 * scale)
              ) {
                setStateContextMenu(true)
                state = true
                setCMState(x)
              }
            }
          }
        })
        if (!state) {
          props.transitions.forEach((x, i) => {
            if (!transition) {
              let guiTransition = document.getElementById('guiTransition' + x.id)?.getBoundingClientRect()
          
              if (guiTransition !== undefined) {
                if (
                  event.pageX > guiTransition.left &&
                  event.pageX < guiTransition.right &&
                  event.pageY > guiTransition.top &&
                  event.pageY < guiTransition.bottom
                ) {
                  setTransitionContextMenu(true)
                  transition = true
                  setCMTransition(x)
                }
              }
            }
          });

          if (!transition) {
            setNoneContextMenu(true)
          }
        }

        setContextMenuPos({x: event.pageX, y: event.pageY})
    }

    const addState = (x: number, y: number) => {
      let width = wrapper ? wrapper.clientWidth : window.innerWidth
      let height = wrapper ? wrapper.clientHeight : window.innerHeight - 150
      let s = scale / 100
      let adaptedX = ((x - (width / 2) + position.x) / s);
      let adaptedY = ((y - (height / 2) + position.y) / s);
      props.onAddState(adaptedX, adaptedY)
    }

    return (
      <>
        <svg id='gui' className={props.colour + ' gui'} onMouseMove={(e) => drag(e)} onMouseUp={() => setSelected(-1)} onMouseDown={(e:React.MouseEvent) => handleMouseDown(e)} onContextMenu={(e:any) => {contextMenu(e)}}>
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
          {firstState && <path d={'M ' + String(tempX) + ',' + String(tempY) + ' L ' + String(mouseX) + ',' + String(mouseY)} stroke="white" strokeWidth={String(scale / 10) + 'px'} fill='none'/>}
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
                return (
                  <GuiState colour={props.colour} key={x.id} state={x} width={wrapper ? wrapper.clientWidth : window.innerWidth} height={wrapper ? wrapper.clientHeight : window.innerHeight} scale={scale / 100} offset={position}  onStatePosUpdate={(id: number, x: number, y: number) => {props.onStatePosUpdate(id, x, y)}} traversals={props.traversals}/>
                )
            
            })}
        </svg>
        <GuiButtons colour={props.colour} interactMode={props.interactMode} onInteractModeUpdate={(value: number) => {props.onInteractModeUpdate(value)}} />
        {noneContextMenu && <CMNone
            colour={props.colour} 
            left={contextMenuPos.x}
            top={contextMenuPos.y}
            onAddState={() => {addState(contextMenuPos.x, contextMenuPos.y)}}/>}
        {stateContextMenu && <CMState
            colour={props.colour} 
            left={contextMenuPos.x}
            top={contextMenuPos.y}
            state={cmState}
            onRemove={(id: number) => {props.onRemoveState(id)}}
            onNameUpdate={(id: number, name: string) => {props.onNameUpdate(id, name)}}
            onInitUpdate={(id: number, value: boolean) => {props.onInitUpdate(id, value)}}
            onAcceptUpdate={(id: number, value: boolean) => {props.onAcceptUpdate(id, value)}}
            onAlternateUpdate={(id: number, value: boolean) => {props.onAlternateUpdate(id, value)}}/>}
        {transitionContextMenu && <CMTransition 
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
