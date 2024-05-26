import { OptionType } from "../types"

const base = {
    animationOn: true,
    animationSpeed: 1,
    forceDeterministic: false,
    enableAlternating: false,
    forceVisibly: false,
    haltCondition: false, //false == reach end of input, true == reach empty stack
    stackCount: 1,
    bookendInput: false,
    inputFrontChar: 'S',
    inputEndChar: 'E',
    stackFrontChar: 'Z',
    colourScheme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 1 : 0,
    textSize: 1
}

function newOption<T>(base: T): OptionType<T> {
    let option: OptionType<T> = {base: base, value: base}
    return option
}

let DefaultOptions: {[id: string]: OptionType<any>} = {}

//String
DefaultOptions['inputFrontChar']     = newOption<string>(base.inputFrontChar)
DefaultOptions['inputEndChar']       = newOption<string>(base.inputEndChar)
DefaultOptions['stackFrontChar']     = newOption<string>(base.stackFrontChar)

//number
DefaultOptions['animationSpeed']     = newOption<number>(base.animationSpeed)
DefaultOptions['colourScheme']       = newOption<number>(base.colourScheme)
DefaultOptions['textSize']           = newOption<number>(base.textSize)
DefaultOptions['stackCount']         = newOption<number>(base.stackCount)

//boolean
DefaultOptions['animationOn']        = newOption<boolean>(base.animationOn)
DefaultOptions['forceDeterministic'] = newOption<boolean>(base.forceDeterministic)
DefaultOptions['enableAlternating']  = newOption<boolean>(base.enableAlternating)
DefaultOptions['forceVisibly']       = newOption<boolean>(base.forceVisibly)
DefaultOptions['haltCondition']      = newOption<boolean>(base.haltCondition)
DefaultOptions['bookendInput']       = newOption<boolean>(base.bookendInput)


export default DefaultOptions