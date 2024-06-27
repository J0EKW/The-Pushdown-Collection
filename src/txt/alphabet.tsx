import React, { useContext } from 'react'
import { Alphabet as AlphabetType } from '../types'
import { OptionContext } from '../lib/OptionsContext'

type AlphabetProps = {
    alphabet: AlphabetType,
    colour:string
}

export const Alphabet = (props: AlphabetProps) => {
    const options = useContext(OptionContext)

    return (
        <div id='txtAlphabetWrapper' className={props.colour}>
            <h1 className={props.colour + ' txtAlphabetHeader'}>Alphabet</h1>
            <div className={props.colour + ' listWrapper'}>
                {(options['bookendInput'].value === true) && 
                <div className='bookendWrapper'>
                    <div className='bookendInput'>
                        start: <input type='input' className={props.colour + ' boxInput'} maxLength={1}/>
                    </div>
                    <div className='bookendInput'>
                        end: <input type='input' className={props.colour + ' boxInput'} maxLength={1}/>
                    </div>
                </div>
                }
                {options['forceVisibly'].value ? 
                <>
                <div className='alphabet'>
                    Call: {props.alphabet.callChars.map((x, i) => {return x + ", "})} <input type='input' className={props.colour + ' boxInput'} maxLength={1}/>
                </div>
                <div className='alphabet'>
                    Return: {props.alphabet.returnChars.map((x, i) => {return x + ", "})} <input type='input' className={props.colour + ' boxInput'} maxLength={1}/>
                </div>
                <div className='alphabet'>
                    Internal: {props.alphabet.internalChars.map((x, i) => {return x + ", "})} <input type='input' className={props.colour + ' boxInput'} maxLength={1}/>
                </div>
                </> : 
                <div className='alphabet'>
                    {props.alphabet.miscChars.map((x, i) => {return x + ", "})} <input type='input' className={props.colour + ' boxInput'} maxLength={1}/>
                </div>
                }
            </div>
        </div>
    )
}