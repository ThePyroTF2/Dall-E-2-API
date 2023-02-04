import React from 'react';
import '../css/ImageList.css'

type props = {
    ImageList: JSX.Element[] | JSX.Element | undefined
}

const ImageList = (props: props) => {

    return (
        <div className='imageList'>
            {props.ImageList}
        </div>
    )
}

export default ImageList