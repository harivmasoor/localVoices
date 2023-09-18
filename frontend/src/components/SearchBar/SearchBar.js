// frontend/src/components/SearchBar/SearchBar.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (searchTerm) {
            // Make an API call to fetch users based on the searchTerm
            fetch(`/api/users/search?query=${searchTerm}`)
                .then(response => response.json())
                .then(data => setSearchResults(data));
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);
    const handleUserClick = (username) => {
        setSearchTerm('');  // Reset the searchTerm when a user is selected
    }
    return (
        <div className="searchBar">
            <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
                <div className="searchDropdown">
                    {searchResults.map(user => (
                        <Link 
                            key={user.id} 
                            to={`/profile/${user.username}`}
                            onClick={() => handleUserClick(user.username)}  // Handle the click event
                        >
                            {user.username}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
