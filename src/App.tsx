import React, { useEffect, useReducer, useState } from 'react';
import './App.css';
import { Connection, RegularPA, State, Transition, Traversal } from './types';
import { Wrapper as TxtWrapper } from './txt/wrapper';
import { Wrapper as SimWrapper } from './sim/wrapper';
import { add as tAdd, remove as tRemove, updateState, updateInputHead, updateStack, updateInput, findDuplicateTransition, findInvalidAlphabetUse } from './lib/transitions';
import { add as sAdd, remove as sRemove, updateAccepting, updateAlternating, updateInit, updateName, updatePosition } from './lib/states';
import { Step, animate, assessSimulation } from './lib/simulation';
import { GuiState } from './gui/state';
import { GuiWrapper } from './gui/wrapper';
import { gsap } from 'gsap';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { OptionWrapper } from './options/Wrapper';
import DefaultOptions from './lib/DefaultOptions';
import optionsReducer from './lib/OptionsReducer';
import { OptionContext, OptionDispatchContext } from './lib/OptionsContext';
gsap.registerPlugin(MotionPathPlugin);


function App() {
  const [options, optionsDispatch] = useReducer(optionsReducer, DefaultOptions)
  const [currentTraversal, setCurrentTraversal] = useState<Traversal[]>([])
  const [input, setInput] = useState<string>("")
  const [stacks, setStacks] = useState<string[]>(Array(2).fill(options['stackFrontChar'].value))
  const [states, setStates] = useState<State[]>([])
  const [transitions, setTransitions] = useState<Transition[]>([])
  const [scale, setScale] = useState<number>(100)
  const [pos, setPos] = useState<{x: number, y: number}>({x: 0, y: 0})
  const [interactMode, setInteractMode] = useState<number>(0)
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedTraversal, setSelectedTraversal] = useState<number>(-1)
  const [animTimeouts, setAnimTimeouts] = useState<NodeJS.Timeout[]>([])
  const [defaultTraversal, setDefaultTraversal] = useState<Traversal>({id: 0, history: [-1], stateId: 0, transitionId: -1, stack: stacks, inputHead: options['bookendInput'].value ? 1 : 0, end: 0})
  const [traversal, setTraversal] = useState<Traversal[]>([defaultTraversal])
  const [colour, setColour] = useState<string>('light')
  
  const stackCountMax = 2

  const arrayEqual = (a: any[], b: any[]): boolean => {
    if (a.length !== b.length) {
      return false
    }
    for (let index = 0; index < a.length; index++) {
      if (a[index] !== b[index]) {
        return false
      }
    }
    return true
  }

  const stackUpdate = (a: string, b: string): string => {
    let stack = ""
    stack = a.slice(0, -1)
    for (let i = b.length - 1; i > -1; i--) {
      stack += b[i]
    }
    return stack
  }

  const searchAutomata = () => {
    const input = "011"
    let traversal = [defaultTraversal];
    let tempId:number = 1;
    
    for (let tIndex = 0; tIndex < traversal.length; tIndex++) {
      if (tIndex > 1000) {
        break;
      }
      let tElement = traversal[tIndex]
      let stackTop = [...tElement.stack]
      if (
        (!options['haltCondition'].value && (tElement.inputHead >= 0 && tElement.inputHead < input.length)) ||
        (options['haltCondition'].value && (tElement.stack.length > 0))
      ) {
        for (let stIndex = 0; stIndex < stackTop.length; stIndex++) {
          let last = stackTop[stIndex].length - 1
          stackTop[stIndex] = stackTop[stIndex][last]
        }
        let transitionOptions = transitions.filter(transition => 
          transition.cStateId === tElement.stateId &&
          transition.cInput === input[tElement.inputHead] &&
          arrayEqual(transition.cStack, stackTop))
        if (transitionOptions.length > 0) {
          transitionOptions.forEach(transition => {
            let newStacks: string[] = []
            tElement.stack.forEach((s, i) => {
              newStacks[i] = stackUpdate(s, transition.nStack[i])
            })
            traversal.push({
              id: tempId,
              history: [...tElement.history, tElement.id],
              stateId: transition.nStateId,
              transitionId: transition.id,
              stack: newStacks,
              inputHead: tElement.inputHead + transition.nInputHead,
              end: 0
            })
            tempId++;
          });
        } else if (tElement.end === 0) {
            tElement.end = 1 //Halt by lack of options
        }
      } else if (tElement.end === 0) {
        tElement.end = options['haltCondition'].value ? 3 : 2 //Halt by empty stack/end of input
      }
    }
    setTraversal(traversal);
    return traversal
  }

  const runSim = () => {
    let traversal = searchAutomata()
  }

  const reset = () => {

    gsap.killTweensOf("*");
    currentTraversal.forEach((x, i) => {
      let ball = document.getElementById(String("travAnim" + i));
      let pulse = document.getElementById(String("animPulse" + i));
      
      ball?.remove()
      pulse?.remove()
    })

    animTimeouts.forEach((x, i) => {
      clearTimeout(x)
    })

    setCurrentTraversal([])
    setTraversal([])
  }

  const clientRemoveTransition = (transitionId: number) => {
    let newPA = tRemove(transitionId, [...transitions], [...states], [...connections])
    setTransitions(newPA.transitions)
    setStates(newPA.states)
    setConnections(newPA.connections)
  }

  const clientUpdateCInput = (transitionId: number, cInput: string) => {
    let newTransitions = updateInput(transitionId, cInput, [...transitions], options['forceDeterministic'].value)
    setTransitions(newTransitions)
  }

  const clientUpdateCState = (transitionId: number, cStateName: string) => {
    let newPA = updateState(transitionId, cStateName, true, [...transitions], [...states], [...connections], options['forceDeterministic'].value)
    setTransitions(newPA.transitions)
    setStates(newPA.states)
    setConnections(newPA.connections)
  }

  const clientUpdateNState = (transitionId: number, cStateName: string) => {
    let newPA = updateState(transitionId, cStateName, false, [...transitions], [...states], [...connections], options['forceDeterministic'].value)
    setTransitions(newPA.transitions)
    setStates(newPA.states)
    setConnections(newPA.connections)
  }

  const clientUpdateCStack = (transitionId: number, value: string, stackIndex: number) => {
    let newTransitions = updateStack(transitionId, value, true, stackIndex, [...transitions], options['forceDeterministic'].value)
    setTransitions(newTransitions)
  }

  const clientUpdateNStack = (transitionId: number, value: string, stackIndex: number) => {
    let newTransitions = updateStack(transitionId, value, false, stackIndex, [...transitions], options['forceDeterministic'].value)
    setTransitions(newTransitions)
  }

  const clientUpdateInputHead = (transitionId: number, value: number) => {
    let newTransitions = updateInputHead(transitionId, value, [...transitions], options['forceDeterministic'].value)
    setTransitions(newTransitions)
  }

  const clientAddTransition = () => {
    let newPA = tAdd([...transitions], [...states], stackCountMax, [...connections])
    setTransitions(newPA.transitions)
    setStates(newPA.states)
    setConnections(newPA.connections)
  }

  const clientAddGuiTransition = (cState: State, nState: State) => {
    let newPA = tAdd([...transitions], [...states], stackCountMax, [...connections], cState.id, undefined, undefined, nState.id)
    /* newPA = updateState(newPA.transitions[newPA.transitions.length - 1].id, cState.name, true, [...newPA.transitions], [...newPA.states], [...newPA.connections], options['forceDeterministic'].value) */
    /* newPA = updateState(newPA.transitions[newPA.transitions.length - 1].id, nState.name, false, [...newPA.transitions], [...newPA.states], [...newPA.connections], options['forceDeterministic'].value) */

    setTransitions(newPA.transitions)
    setStates(newPA.states)
    setConnections(newPA.connections)
  }

  const clientRemoveState = (id: number) => {
    let newPA = sRemove(id, [...transitions], [...states], [...connections])
    setTransitions(newPA.transitions)
    setStates(newPA.states)
    setConnections(newPA.connections)
  }

  const clientUpdateName = (id: number, name: string) => {
    let newStates = updateName(id, name, [...states])
    setStates(newStates)
  }

  const clientUpdateInit = (id: number, value: boolean) => {
    let newStates = updateInit(id, value, [...states])
    let newInit = newStates.find(s => s.id === id)
    let dTrav = defaultTraversal
    dTrav.stateId = newInit ? newInit.id : dTrav.stateId
    setStates(newStates)
    setDefaultTraversal(dTrav)
  }

  const clientUpdateAccepting = (id: number, value: boolean) => {
    let newStates = updateAccepting(id, value, [...states])
    setStates(newStates)
  }

  const clientUpdateAlternating = (id: number, value: boolean) => {
    let newStates = updateAlternating(id, value, [...states])
    setStates(newStates)
  }

  const clientGuiUpdateStatePos = (id: number, x: number, y: number) => {
    let newStates = updatePosition(id, x, y, [...states])
    setStates(newStates)
  }

  const clientAddState = () => {
    let newStates = sAdd([...states])
    setStates(newStates)
  }

  const clientAddGuiState = (x: number, y: number) => {
    let newStates = sAdd([...states])
    newStates = updatePosition(newStates[newStates.length - 1].id, x, y, [...newStates])
    setStates(newStates)
  }

  const clientSimRun = () => {
    let allTraversals: Traversal[][] = []
    let currentTraversals: Traversal[] = []
    let tempTimeouts: NodeJS.Timeout[] = []
    let newTraversals = [defaultTraversal]
    let index = 0
    let duplicates : Transition[] = []
    console.log(stacks)
    if (options['forceVisibly'].value && findInvalidAlphabetUse(transitions)) {
      return
    }

    if (options['forceDeterministic'].value) {
      for (let x = 0; x < transitions.length; x++) {
        duplicates = [...duplicates, ...findDuplicateTransition(transitions[x], transitions)]
      }
    }
    if (duplicates.length !== 0) {
      console.log("You have set the simulation to only allow deterministic connections, and nondeterministic connections were found")
    } else if (states.length === 0 || transitions.length === 0) {
      console.log("You have no states/transitions, which are required to run the simulation")
    } else if (states.find(s => s.initial) === undefined) {
      console.log("You need to set one of the states as the Initial State for the simulation to work")
    } else {
      gsap.killTweensOf("*");
      currentTraversals.forEach((x, i) => {
        let ball = document.getElementById(String("travAnim" + i));
        let pulse = document.getElementById(String("animPulse" + i));
        
        ball?.remove()
        pulse?.remove()
      })

      while (true) {
        if (currentTraversals.length > 0) {
          newTraversals = Step([...transitions], input, [...currentTraversals], options['stackCount'].value)
          console.log(newTraversals)
        }
        if (arrayEqual(newTraversals, currentTraversals)) {
          break
        }
        
        allTraversals.push(newTraversals)
        tempTimeouts.push(setTimeout((newTraversals: Traversal[], currentTraversals: Traversal[]) => {
          setCurrentTraversal(newTraversals)
          gsap.killTweensOf("*");
          currentTraversals.forEach((x, i) => {
            let ball = document.getElementById(String("travAnim" + i));
            let pulse = document.getElementById(String("animPulse" + i));
            
            ball?.remove()
            setTimeout(() => {
              pulse?.remove()
            }, 750 / options['animationSpeed'].value, pulse);
          })
          if (options['animationOn'].value) {
            if (selectedTraversal === -1) { 
              animate([...newTraversals], [...connections], [...states], options['haltCondition'].value, scale / 100, options['animationSpeed'].value, false)
            } else {
              let target = newTraversals.find(t => t.id === selectedTraversal)
              if (target !== undefined) {
                animate([target], [...connections], [...states], options['haltCondition'].value, scale / 100, options['animationSpeed'].value, false)
              }
            }
          }
        }, index * 1500 / options['animationSpeed'].value, newTraversals, currentTraversals))
        currentTraversals = newTraversals
        index += 1
      }
      setAnimTimeouts(tempTimeouts)
    }
  }

  const clientSimStep = () => {
    let newTraversals = [defaultTraversal]
    if (currentTraversal.length > 0) {
      newTraversals = Step([...transitions], input, [...currentTraversal], options['stackCount'].value)
    }
    if (arrayEqual(newTraversals, currentTraversal)) {
      assessSimulation(traversal, states)
    } else {
      setTraversal([...traversal, ...newTraversals])
    }
    setCurrentTraversal(newTraversals)
    setSelectedTraversal(-1)

    gsap.killTweensOf("*");
    currentTraversal.forEach((x, i) => {
      let ball = document.getElementById(String("travAnim" + i));
      let pulse = document.getElementById(String("animPulse" + i));
      
      ball?.remove()
      pulse?.remove()
    })


    if (options['animationOn'].value) {
      if (selectedTraversal === -1) { 
        animate([...newTraversals], [...connections], [...states], options['haltCondition'].value, scale / 100, options['animationSpeed'].value, true)
      } else {
        let target = newTraversals.find(t => t.id === selectedTraversal)
        if (target !== undefined) {
          animate([target], [...connections], [...states], options['haltCondition'].value, scale / 100, options['animationSpeed'].value, true)
        }
      }
    }
  }

  useEffect(() => {
    gsap.killTweensOf("*");
    currentTraversal.forEach((x, i) => {
      let ball = document.getElementById(String("travAnim" + i));
      let pulse = document.getElementById(String("animPulse" + i));
      
      ball?.remove()
      pulse?.remove()
    })

    if (options['animationOn'].value) {
      if (selectedTraversal === -1) { 
        animate([...currentTraversal], [...connections], [...states], options['haltCondition'].value, scale / 100, options['animationSpeed'].value, true)
      } else {
        let target = currentTraversal.find(t => t.id === selectedTraversal)
        if (target !== undefined) {
          animate([target], [...connections], [...states], options['haltCondition'].value, scale / 100, options['animationSpeed'].value, true)
        }
      }
    }

  }, [pos, scale, states, selectedTraversal])

  useEffect(() => {
    setStacks(Array(2).fill(options['stackFrontChar'].value))
  }, [options['stackFrontChar'].value])

  useEffect(() => {
    setDefaultTraversal({
      id: defaultTraversal.id,
      history: defaultTraversal.history,
      stateId: defaultTraversal.stateId,
      transitionId: defaultTraversal.transitionId,
      stack: stacks,
      inputHead: options['bookendInput'].value ? 1 : 0,
      end: defaultTraversal.end})
  }, [stacks, options['bookendInput'].value])

  useEffect(() => {
    let newColour = 'light'
    switch (options['colourScheme'].value) {
        case 0:
            newColour = 'light'
            break
        case 1:
            newColour = 'dark'
            break
        case 2:
            newColour = 'darkContrast'
            break
        case 3:
            newColour = 'lightContrast'
            break
        default:
            break
    }
    console.log(newColour)
    setColour(newColour)
    
}, [options['colourScheme'].value])

  return (
    <div className="App">
      {/* <button onClick={searchAutomata}>Simulate PA</button>
      <button onClick={reset}>Reset</button>
      <button onClick={() => console.log(traversal)}>View PA</button>
      <button onClick={assessSimulation}>Assess Simulation</button> */}
      <OptionContext.Provider value={options} >
      <OptionDispatchContext.Provider value={optionsDispatch} >
      <GuiWrapper
          colour={colour}
          states={states}
          transitions={transitions}
          connections={connections}
          traversals={currentTraversal}
          scale={scale}
          stackCount={options['stackCount'].value}
          interactMode={interactMode}
          onStatePosUpdate={(id: number, x: number, y: number) => {clientGuiUpdateStatePos(id, x, y)}}
          onScaleUpdate={(value: number) => {setScale(value)}}
          onPosUpdate={(value: {x: number, y: number}) => setPos(value)}
          onInteractModeUpdate={(value: number) => {setInteractMode(value)}}
          onAddState={(x: number, y: number) => {clientAddGuiState(x, y)}}
          onAddTransition={(cState: State, nState: State) => {clientAddGuiTransition(cState, nState)}}
          onRemoveTransition={(id: number) => {clientRemoveTransition(id)}}
          onCInputUpdate={(id: number, value: string) => {clientUpdateCInput(id, value)}}
          onCStateUpdate={(id: number, name: string) => {clientUpdateCState(id, name)}}
          onNStateUpdate={(id: number, name: string) => {clientUpdateNState(id, name)}}
          onCStackUpdate={(id: number, value: string, index: number) => {clientUpdateCStack(id, value, index)}}
          onNStackUpdate={(id: number, value: string, index: number) => {clientUpdateNStack(id, value, index)}}
          onNInputHeadUpdate={(id: number, value: number) => {clientUpdateInputHead(id, value)}}
          onRemoveState={(id: number) => {clientRemoveState(id)}}
          onNameUpdate={(id: number, name: string) => {clientUpdateName(id, name)}}
          onInitUpdate={(id: number, value: boolean) => {clientUpdateInit(id, value)}}
          onAcceptUpdate={(id: number, value: boolean) => {clientUpdateAccepting(id, value)}}
          onAlternateUpdate={(id: number, value: boolean) => {clientUpdateAlternating(id, value)}}
          />
      <TxtWrapper
          transitions={transitions}
          states={states}
          stackCount={options['stackCount'].value}
          colour={colour}
          onRemoveTransition={(id: number) => {clientRemoveTransition(id)}}
          onCInputUpdate={(id: number, value: string) => {clientUpdateCInput(id, value)}}
          onCStateUpdate={(id: number, name: string) => {clientUpdateCState(id, name)}}
          onNStateUpdate={(id: number, name: string) => {clientUpdateNState(id, name)}}
          onCStackUpdate={(id: number, value: string, index: number) => {clientUpdateCStack(id, value, index)}}
          onNStackUpdate={(id: number, value: string, index: number) => {clientUpdateNStack(id, value, index)}}
          onNInputHeadUpdate={(id: number, value: number) => {clientUpdateInputHead(id, value)}}
          onAddTransition={() => {clientAddTransition()}}
          onRemoveState={(id: number) => {clientRemoveState(id)}}
          onNameUpdate={(id: number, name: string) => {clientUpdateName(id, name)}}
          onInitUpdate={(id: number, value: boolean) => {clientUpdateInit(id, value)}}
          onAcceptUpdate={(id: number, value: boolean) => {clientUpdateAccepting(id, value)}}
          onAlternateUpdate={(id: number, value: boolean) => {clientUpdateAlternating(id, value)}}
          onAddState={() => {clientAddState()}}/>
            <OptionWrapper
              colour={colour}
            />
            <SimWrapper
              colour={colour}
              input={input}
              stacks={stacks}
              currentTraversals={currentTraversal}
              states={states}
              haltCond={options['haltCondition'].value}
              onInputUpdate={(value: string) => {setInput(value)}}
              onRun={() => {clientSimRun()}}
              onStep={() => {clientSimStep()}}
              onReset={() => {reset()}}
              setSelected={(value: number) => {setSelectedTraversal(value)}}
            />
          </OptionDispatchContext.Provider>
        </OptionContext.Provider>
    </div>
  );
}

export default App;
