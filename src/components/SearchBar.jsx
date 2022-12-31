import React from 'react';
import { useState } from 'react';
import '../css/SearchBar.css'
import Fuse from 'fuse.js';

function SearchBar(props) {
    const [promptQuery, setPromptQuery] = useState('')

    const search = query => {
        let filteredImageList = new Fuse(props.ImageList.images, {
            keys: ['prompt']
        })
        filteredImageList = {
            images: filteredImageList.search(query).map(item => {
                return item.item
            })
        }
        props.UpdateImageFunction(query !== '' ? filteredImageList : props.ImageList)
    }

    return (
        <div className="searchBar">
            <input
                type="text"
                onChange = {event => {
                    setPromptQuery(event.target.value)
                }}
                onKeyDown = {event => {
                    if(event.key === 'Enter') search(promptQuery)
                }}
            />
            <br/>
            <button onClick={() => search(promptQuery)}>Search</button>
        </div>
    )
}

export default SearchBar