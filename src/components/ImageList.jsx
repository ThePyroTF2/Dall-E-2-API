import { React, useEffect, useState } from 'react';
import '../css/ImageList.css'
const moment = require('moment')

const ImageList = props => {

    return (
        <div className='imageList'>
            {props.ImageList}
        </div>
    )
}

export default ImageList