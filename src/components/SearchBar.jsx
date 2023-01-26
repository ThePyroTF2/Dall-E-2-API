import React from 'react';
import { useState } from 'react';
import '../css/SearchBar.css'
import Fuse from 'fuse.js';
import { RippleButton } from './RippleButton';

function SearchBar(props) {
    const [promptQuery, setPromptQuery] = useState('')
    const [startDate, setStartDate] = useState(0)
    const [endDate, setEndDate] = useState(Infinity)

    const search = (query, startDate, endDate) => {
        let filteredImageList = new Fuse(props.ImageList.images, {
            keys: ['prompt']
        })
        filteredImageList = {
            images: filteredImageList
                .search(query)
                .filter(item => item.item.timestamp > startDate && item.item.timestamp < endDate)
                .map(item => {return item.item})
        }
        console.log(filteredImageList)
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
            Date range:
            <br/>
            <input type="datetime-local" onChange={(event) => setStartDate(!!event.target.value ? Number(new Date(event.target.value)) : 0)}/> to <input type="datetime-local" onChange={(event) => setEndDate(!!event.target.value ? Number(new Date(event.target.value)) : Infinity)}/>
            <br/>
            <RippleButton search={search} prompt={promptQuery} startDate={startDate} endDate={endDate}>Search</RippleButton>
        </div>
    )
}

export default SearchBar