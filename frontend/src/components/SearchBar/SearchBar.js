import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './SearchBar.css';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const searchBarRef = useRef(null);

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

    useEffect(() => {
        const searchBarElement = searchBarRef.current;
        if (searchBarElement) {
            const rect = searchBarElement.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX
            });
        }
    }, [searchTerm]);

    const handleUserClick = (username) => {
        setSearchTerm('');  // Reset the searchTerm when a user is selected
    }

    return (
        <div className="searchBar" ref={searchBarRef}>
            <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
                <div className="searchDropdown">
                    {searchResults.length > 0 ? (
                        searchResults.map(user => (
                            <Link 
                                key={user.id} 
                                to={`/profile/${user.username}`}
                                onClick={() => handleUserClick(user.username)}
                            >
                                {user.username}
                            </Link>
                        ))
                    ) : (
                        <div>User not found</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;

