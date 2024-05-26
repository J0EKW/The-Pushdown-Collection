import { useContext, useEffect, useState } from "react"
import '../App.css';
import { OptionContext, OptionDispatchContext } from "../lib/OptionsContext";

type StackProps = {
    colour: String
}

export const Stack = (props: StackProps) => {
    const [collapse, setCollapse] = useState<boolean>(true)
    const [render, setRender] = useState<boolean>(false)
    const [to, setTo] = useState<NodeJS.Timeout>()
    const options = useContext(OptionContext)
    const dispatch = useContext(OptionDispatchContext)

    const [char, setChar] = useState<string>(options['stackFrontChar'].value)


    const updateVisiblity = () => {
        if (!collapse) {
            document.getElementById('stackOptionList')?.setAttribute('class', props.colour + ' options close')
            setTo(setTimeout(() => {
                setRender(false)
            }, 690))
        } else {
            setRender(true)
            clearTimeout(to)
            setTimeout(() => {
                document.getElementById('stackOptionList')?.setAttribute('class', props.colour + ' options')
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

    return (
        <div id='stackOptionWrapper'>
            <h1 className={props.colour + ' optionHeader'} onClick={() => {updateVisiblity()}}>{'Stack' + (collapse ? ' ▼' : ' ▲')}</h1>
            {render && 
            <div id='stackOptionList' className={props.colour + ' options close'}>
                <div id='charWrapper'>
                    Char <input className={props.colour + ' optionsBoxInput'} type='text' maxLength={1} value={char} onChange={(x) => {setChar(x.currentTarget.value)}} onKeyDown={(e) => handleChar(e)}/>
                </div>
            </div>}
        </div>
    )
}