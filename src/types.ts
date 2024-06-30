export type State = {
    readonly id: number,
    name: string,
    initial: boolean,
    accepting: boolean,
    alternating: boolean, //FALSE is existential, TRUE is universal
    //If existential and there's no transitions this is a rejecting state
    //If universal and there's no transitions this is an accepting state
    //A deterministic PA only works with existential states
    x: number,
    y: number
}

export type Transition = {
    readonly id: number,
    cStateId: number,
    cInput: string,
    cStack: string[],
    nStateId: number,
    nStack: string[],
    nInputHead: number
}

export type Alphabet = {
    startChar: string,
    endChar: string,
    callChars: string[],
    returnChars: string[],
    internalChars: string[],
    miscChars: string[],
    allChars: string[]
}

export type RegularPA = {
    states: State[]
    transitions: Transition[]
}

export type Traversal = {
    readonly id: number,
    history: number[],
    transitionId: number,
    stateId: number,
    stack: string[],
    inputHead: number,
    end: number
}

export type Connection = {
    readonly id: number,
    cStateId: number,
    nStateId: number,
    transitionIds: number[];
  }

export type OptionsType = {
    animation: () => {get: Function, set: Function, reset: Function}
    animationSpeed: () => {get: Function, set: Function, reset: Function}
}

export type OptionType<T, > = {
    readonly base: T,
    value: T
}