import React from 'react'
import './css/App.css'
import SearchBar from './components/SearchBar'
import ImageList from './components/ImageList'

const App = () => {
    return (
        <div className="App">
            <SearchBar/>
            <ImageList/>
        </div>
    )
}

export default App