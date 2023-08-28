import { useContext, useEffect, useState } from "react"
import '../App.css';
import './options.css';
import { OptionContext, OptionDispatchContext } from "../lib/OptionsContext";

export const Stack = () => {
    const [collapse, setCollapse] = useState<boolean>(true)
    const [render, setRender] = useState<boolean>(false)
    const [to, setTo] = useState<NodeJS.Timeout>()
    const options = useContext(OptionContext)
    const dispatch = useContext(OptionDispatchContext)

    const [char, setChar] = useState<string>(options['stackFrontChar'].value)


    const updateVisiblity = () => {
        if (!collapse) {
            document.getElementById('stackOptionList')?.setAttribute('class', 'options close')
            setTo(setTimeout(() => {
                setRender(false)
            }, 690))
        } else {
            setRender(true)
            clearTimeout(to)
            setTimeout(() => {
                document.getElementById('stackOptionList')?.setAttribute('class', 'options')
            }, 1)
        }
        setCollapse(!collapse)
    }

    const handleChar = (e: any) => {
        if (e.key === 'Enter') {
            dispatch({
                type: 'set',
                id: 'stackFrontChar',
                value: char
            })
        }
    }

    const handleBookendStack = () => {
        dispatch({
            type: 'set',
            id: 'bookendStack',
            value: !options['bookendStack'].value
        })
    }

    return (
        <div id='stackOptionWrapper'>
            <h1 className='optionHeader' onClick={() => {updateVisiblity()}}>{'Stack' + (collapse ? ' ▼' : ' ▲')}</h1>
            {render && 
            <div id='stackOptionList' className='options close'>
                <div id='bookendWrapper'>
                    Bookend Stack <input type='checkbox' checked={options['bookendStack'].value} onClick={handleBookendStack} />
                </div>
                <div id='charWrapper'>
                    Char <input className='optionsBoxInput' type='text' max={1} value={char} onChange={(x) => {setChar(x.currentTarget.value)}} onKeyDown={(e) => handleChar(e)}/>
                </div>
            </div>}
        </div>
    )
}