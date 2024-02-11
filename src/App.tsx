import React, { useState, useEffect } from 'react'
import './css/App.css'
import SearchBar from './components/SearchBar'
import ImageList from './components/ImageList'
const moment = require('moment')

type ImageObject = {
    prompt: string
    url: string
    timestamp: number
}

type ObjectArrayImages = {
    images: Array<ImageObject>
}

const App = () => {
    const [elementsArray, setElementsArray] = useState<JSX.Element[] | JSX.Element>()
    let unstatefulObjectsArray: ObjectArrayImages
    const [statefulObjectsArray, setStatefulObjectsArray] = useState<ObjectArrayImages>({images: []})

    const updateImages = (newList: ObjectArrayImages) => {
        setElementsArray(
            newList.images.length !== 0 ?
                newList.images.map(image => {
                    let imageDate = moment(Number(image.timestamp))

                    return(
                        <div className='image'>
                            <a href={image.url} target="_blank" rel="noopener noreferrer">
                                <img src={image.url} alt={image.prompt} width="200" height="200"/>
                            </a>
                            <p><i>"{image.prompt}". Generated on {imageDate.format('dddd, MMMM Do, YYYY, h:mm:ssa UTCZ')}</i></p>
                        </div>
                )})
            : 
                <p>No results</p>
        )
    }

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/justDeeevin/DALL-E-2-API/master/src/images.json')
        .then(res => {
            return res.json()
        })
        .then(data => {
            unstatefulObjectsArray = data
            updateImages(unstatefulObjectsArray)
            setStatefulObjectsArray(unstatefulObjectsArray)
        })
    }, [])


    return (
        <div className="App">
            <SearchBar UpdateImagesFunction={updateImages} ImageList={statefulObjectsArray}/>
            <ImageList ImageList={elementsArray}/>
            <a href="https://github.com/justDeeevin/DALL-E-2-API" className="SourceLink">Source code</a>
        </div>
    )
}

export default App
export type { ObjectArrayImages }
export type { ImageObject }
