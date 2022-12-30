import React from 'react';
import { useState } from 'react';
import '../css/SearchBar.css'
import Fuse from 'fuse.js';

function SearchBar(props) {
    const [promptQuery, setPromptQuery] = useState('')

    const search = query => {
        let imageList = new Fuse(props.ImageList.images, {
            keys: ['prompt']
        })
        imageList = {
            images: imageList.search(query).map(item => {
                return item.item
            })
        }
        props.UpdateFunction(query != '' ? imageList : props.ImageList)
    }

    return (
        <div className="searchBar">
            <input
                type="text"
                onChange = {event => {
                    setPromptQuery(event.target.value)
                }}
                onKeyDown = {event => {
                    if(event.key == 'Enter') search(promptQuery)
                }}
            />
            <br/>
            <button onClick={() => search(promptQuery)}>Search</button>
        </div>
    )
}

export default SearchBar