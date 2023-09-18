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
                        <Link key={user.id} to={`/profile/${user.username}`}>
                            {user.username}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
