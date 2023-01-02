import React from 'react';
import { useState } from 'react';
import '../css/SearchBar.css'
import Fuse from 'fuse.js';
import { RippleButton } from './RippleButton';

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
        props.UpdateImagesFunction(query !== '' ? filteredImageList : props.ImageList)
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
            <RippleButton search={search} prompt={promptQuery}>Search</RippleButton>
        </div>
    )
}

export default SearchBar