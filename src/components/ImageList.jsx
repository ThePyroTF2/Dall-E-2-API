import { React, useEffect, useState } from 'react';
import '../css/ImageList.css'
const moment = require('moment')

const ImageList = () => {
    const [imageListElement, setImageListElement] = useState(null)
    let imageList
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/ThePyroTF2/DALL-E-2-API/master/src/images.json').then(res => {
            return res.json()
        }).then(data => {
            imageList = data
            console.log(imageList)

            setImageListElement(imageList.images.map(image => {
                let imageDate = moment(Number(image.timestamp))

                return(
                    <div className='image'>
                        <a href={image.url} target="_blank" rel="noopener noreferrer">
                            <img src={image.url} alt={image.prompt} width="200" height="200"/>
                        </a>
                        <p><i>"{image.prompt}". Generated on {imageDate.format('dddd, MMMM Do, YYYY, h:mm:ssa UTCZ')}</i></p>
                    </div>
            )}))
        })
    }, [])

    return (
        <div className='imageList'>
            {imageListElement}
        </div>
    )
}

export default ImageList