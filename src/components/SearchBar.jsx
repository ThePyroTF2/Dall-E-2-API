import React from 'react';
import { useState } from 'react';
import '../css/SearchBar.css'

function SearchBar() {
    const [promptQuery, setPromptQuery] = useState('')

    const search = query => {
        console.log(query)
    }

    return (
        <div className="searchBar">
            <input
                type="text"
                onChange = {event => {
                    setPromptQuery(event.target.value)
                }}
            />
            <br/>
            <button onClick={() => search(promptQuery)}>Search</button>
        </div>
    )
}

export default SearchBar