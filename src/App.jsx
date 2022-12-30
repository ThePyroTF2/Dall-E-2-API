import { React, useState, useEffect } from 'react'
import './css/App.css'
import SearchBar from './components/SearchBar'
import ImageList from './components/ImageList'
const moment = require('moment')

const App = () => {
    const [imageListElements, setImageListElements] = useState(null)
    let unstatefulImageList
    const [statefulImageList, setStatefulImageList] = useState(null)

    const updateImages = (newList) => {
        setImageListElements(newList.images.map(image => {
            let imageDate = moment(Number(image.timestamp))

            return(
                <div className='image'>
                    <a href={image.url} target="_blank" rel="noopener noreferrer">
                        <img src={image.url} alt={image.prompt} width="200" height="200"/>
                    </a>
                    <p><i>"{image.prompt}". Generated on {imageDate.format('dddd, MMMM Do, YYYY, h:mm:ssa UTCZ')}</i></p>
                </div>
        )}))
    }

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/ThePyroTF2/DALL-E-2-API/master/src/images.json').then(res => {
            return res.json()
        }).then(data => {
            console.log(data)
            unstatefulImageList = data
            updateImages(unstatefulImageList)
            setStatefulImageList(unstatefulImageList)
        })
    }, [])


    return (
        <div className="App">
            <SearchBar UpdateFunction={updateImages} ImageList={statefulImageList}/>
            <ImageList ImageList={imageListElements}/>
        </div>
    )
}

export default App