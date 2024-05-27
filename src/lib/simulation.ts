import React from 'react'
import { Connection, State, Transition, Traversal } from '../types'
import { gsap } from 'gsap';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);

export const arrayEqual = (a: any[], b: any[], count: number): boolean => {
 
  if (a.length !== b.length) {
      return false
    }
    for (let index = 0; index < count; index++) {
      if (a[index] !== b[index]) {
        return false
      }
    }
    return true
}

const stackEqual = (a: any[], b: any[], input: string, count: number): boolean => {
  let tempA = a
  for (let index = 0; index < count; index++) {
    if (tempA[index] === '*') {
      tempA[index] = input
    }
  }
  return arrayEqual(tempA, b, count)
}

const stackUpdate = (a: string, b: string, wildCard: string): string => {
    let stack = a.slice(0, -1)
    for (let i = b.length - 1; i > -1; i--) {
      if (b[i] === '*') {
        stack += wildCard
      } else {
        stack += b[i]
      }
    }
    return stack
}

const stackLengthGreaterThan = (stacks: string[], stackCount: number, value: number): boolean => {
  if (stackCount === 0) {
    return true
  }

  let response = false
    stacks.forEach((x, i) => {
        if (i < stackCount && x.length > value) {
            response = true
            return;
        }
    })
    return response
}

export const assessSimulation = (traversal: Traversal[], states: State[]) => {
    const acceptTraversal = traversal.filter(t =>
      (t.end === 2 || t.end === 3) &&
      (states.find(s => s.id === t.stateId && s.accepting) !== undefined)
    )
    if (acceptTraversal.length > 0) {

        let universalStateResult = true
        states.forEach(s => {
            if (s.alternating) {
                universalStateResult = universalStateResult && assessUniversalState(s.id, traversal, states)
            }
        })

        if (!universalStateResult) {
            console.log("The PA rejects the input on account of one of the universal state conditions not being fulfilled")
            return
          }
        console.log("The PA accepts this input")
        return
    }

    const rejectTraversal = traversal.filter(t =>
      ((t.end === 2 || t.end === 3) &&
      (states.find(s => s.id === t.stateId && s.accepting) === undefined)) ||
      (t.end === 1)
    )
    if (rejectTraversal.length > 0) {
      console.log("The PA rejects this input")
      return
    }

    console.log("The Simulation does not halt within the given traversal length")
  }

  const assessUniversalState = (stateId: number, traversal: Traversal[], states: State[]) => {
    const endStates = traversal.filter(t =>
      (t.end !== 0)
    )
    const universalStateChildren: Traversal[] = []
    endStates.forEach(e => {
      let currentState = e.id
      while (currentState !== 0 && currentState !== stateId) {
        let currentTraversal = traversal.filter(t => t.id === currentState)[0]
        currentState = currentTraversal.history[currentTraversal.history.length - 1]
      }
      if (currentState === stateId) {
        universalStateChildren.push(e)
      }
    })
    if (universalStateChildren.length === 0) {
      return true
    }
    
    const acceptingStateChildren = universalStateChildren.filter(u => 
        states.find(s => s.id === u.stateId && s.accepting) !== undefined
    )
    if (arrayEqual(acceptingStateChildren, universalStateChildren, acceptingStateChildren.length)) {
      return true
    }
    return false
  }

export const Step = (transitions: Transition[], input: string, traversal: Traversal[], stackCount: number): Traversal[] => {

    let tempId = traversal[traversal.length - 1].id + 1
    let newTraversals: Traversal[] = []
    let completeTraversals: Traversal[] = []
    traversal.forEach((x, i) => {

      if (x.end === 0) {
        if (!stackLengthGreaterThan(x.stack, stackCount, 0)) {
          completeTraversals.push({
            id: tempId,
            history: x.history,
            stateId: x.stateId,
            transitionId: -1,
            stack: x.stack,
            inputHead: x.inputHead,
            end: 1
        })
        tempId++;
        } else if (x.inputHead < 0 || x.inputHead >= input.length) {
          completeTraversals.push({
            id: tempId,
            history: x.history,
            stateId: x.stateId,
            transitionId: -1,
            stack: x.stack,
            inputHead: x.inputHead,
            end: 2
        })
        tempId++;
        } else {
          let stackHead = [""]
          for (let stIndex = 0; stIndex < x.stack.length; stIndex++) {
            let last = x.stack[stIndex].length - 1
            if (last === -1) {
              stackHead[stIndex] = ""
            } else {
              stackHead[stIndex] = x.stack[stIndex][last]
            }
          }
          let transitionOptions = transitions.filter(transition => {
            if (stackCount === 0) {
              return (
                transition.cStateId === x.stateId &&
                (transition.cInput === input[x.inputHead] || transition.cInput === "*")
              )
            }

            return (
              transition.cStateId === x.stateId &&
              (transition.cInput === input[x.inputHead] || transition.cInput === "*") &&
              stackEqual([...transition.cStack], stackHead, input[x.inputHead], stackCount)
            )
          });

          if (transitionOptions.length === 0) {
            completeTraversals.push({
              id: tempId,
              history: x.history,
              stateId: x.stateId,
              transitionId: -1,
              stack: x.stack,
              inputHead: x.inputHead,
              end: 3
          })
          tempId++;
          } else {
            transitionOptions.forEach(transition => {
              let wildCard = input[x.inputHead]
              let newStacks: string[] = []
              x.stack.forEach((s, i) => {
                  newStacks[i] = stackUpdate(s, transition.nStack[i], wildCard)
              })
              newTraversals.push({
                  id: tempId,
                  history: [...x.history,  x.stateId],
                  stateId: transition.nStateId,
                  transitionId: transition.id,
                  stack: newStacks,
                  inputHead: x.inputHead + transition.nInputHead,
                  end: 0
              })
              tempId++;
          });
          }
        }
      }
    })

    return [...newTraversals, ...completeTraversals]
}

export const animate = (traversals: Traversal[], connections: Connection[], states: State[], haltCondition: boolean, scale: number, speed: number, repeat: boolean) => {
  


  let cDelay: number[] = Array(connections.length).fill(0)
  let sPulse: boolean[] = Array(states.length).fill(false)
  let sAccept: boolean[] = Array(states.length).fill(false)
  let sReject: boolean[] = Array(states.length).fill(false)
  
  traversals.forEach((x, i) => {
    let animConnection = connections.filter(c => (c.cStateId === x.history[x.history.length - 1]) && (c.nStateId === x.stateId))[0];

    let tween
    let parent = document.getElementById('gui');
    if (!animConnection || (animConnection &&
      ((x.end === 0 && !sPulse[x.stateId]) ||
      ((x.end === 1 || x.end === 2) && !sAccept[x.stateId]) || 
      (x.end === 3 && !sReject[x.stateId]))))
    {
      let newPulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      let state = states.find(s => s.id === x.stateId)
      let stateParent = document.getElementById('guiState' + x.stateId);
      if (stateParent !== null && state !== undefined) {
        newPulse.setAttribute('id', 'animPulse' + i);
        newPulse.setAttribute('cx', '50%')
        newPulse.setAttribute('cy', '50%')
        newPulse.setAttribute('r', '20%');
        newPulse.setAttribute('stroke', 'none');
        newPulse.setAttribute('strokeWidth', '5%');
        newPulse.setAttribute('fill', 'transparent');
        newPulse.style.setProperty('animation-iteration-count', 'infinite');
        newPulse.style.setProperty('animation-delay', animConnection && x.end === 0 ? String(1.5 / speed) + 's' : '0s');
        newPulse.style.setProperty('animation-duration', String(1.5 / speed) + "s")
        stateParent.appendChild(newPulse);
        if (x.end === 0) {
          newPulse.classList.add('pulse');
          sPulse[x.stateId] = true
        } else if (
          state.accepting && 
          ((haltCondition && x.end === 1) || 
          (!haltCondition && x.end === 2))) {
          newPulse.classList.add('pulseSuccess')
          sAccept[x.stateId] = true
        } else {
          newPulse.classList.add('pulseFailure')
          sReject[x.stateId] = true
        }
      }
    }

    if (parent && animConnection && !x.end) {
      let travAnim: any
      if (i % 8 === 0 || i % 8 === 4) {
        travAnim = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      } else if (i % 8 === 1 || i % 8 === 5) {
        travAnim = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      } else if (i % 8 === 2 || i % 8 === 3 || i % 8 === 6 || i % 8 === 7) {
        travAnim = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      }

      travAnim.setAttribute('cx', '-50');
      travAnim.setAttribute('cy', '-50');
      travAnim.setAttribute('id', String("travAnim" + i));
      travAnim.setAttribute('className', 'travAnim');
      travAnim.setAttribute('stroke', 'var(--border-colour)');
      travAnim.style.setProperty('animation-delay', String(i * 10 / speed) + "s")

      if (i % 4 === 0) {
        travAnim.setAttribute('r', String(20 * scale));
      } else if (i % 4 === 1) {
        travAnim.setAttribute('height', String(30 * scale));
        travAnim.setAttribute('width', String(30 * scale));
      } else if (i % 4 === 2) {
        travAnim.setAttribute('viewBox', '0, 0, ' + String(40 * scale) + ', ' + String(30 * scale))
        travAnim.setAttribute('d', 'M0,' + String(30 * scale) + ' L' + String(20 * scale) + ',0 L' + String(40 * scale) + ',' + String(30 * scale) + ' Z')
      } else if (i % 4 === 3) {
        travAnim.setAttribute('viewBox', '0, 0, ' + String(40 * scale) + ', ' + String(40 * scale))
        travAnim.setAttribute('d', 'M0,' + String(20 * scale) + ' L' + String(20 * scale) + ',0 L' + String(40 * scale) + ',' + String(20 * scale) + ' L' + String(20 * scale) + ',' + String(40 * scale) + ' Z')
      }

      if (i % 8 < 4) {
        travAnim.setAttribute('fill', 'var(--border-colour)');
      } else {
        travAnim.setAttribute('fill', 'var(--back-colour-primary-1)');
      }

      let firstState = document.getElementById('guiState' + states[0].id)
      parent.insertBefore(travAnim, firstState);
      tween = gsap.to(String("#travAnim" + i), {
        motionPath: {
            path: "#path" + animConnection.id,
            align: "#path" + animConnection.id,
            alignOrigin: [0.5, 0.5]
        },
        ease: "none",
        duration: 1.5 / speed,
        repeat: repeat ? -1 : 0,
        delay: cDelay[animConnection.id]
      });
      tween.play();
      cDelay[animConnection.id] += 0.2
    }
  })
}