import React, { useRef, useState } from 'react';
import Tooltip from 'react-tooltip';
import './Search.css'
import Card from '../../lib/Card';

const Search : React.FC<{ onSelect: Function }> = props => {
    const [token, setToken] = useState(() => () => {});
    const [results, setResults] = useState<Card[]>([]);
    const [badQuery, setBadQuery] = useState(false);
    const [hoverImage, setHoverImage] = useState<string | undefined>();
    const searchInput = useRef<HTMLInputElement>(null);

    const clear = () => {
        if (searchInput.current) { 
            searchInput.current.value = '';
            setResults([]);
            setBadQuery(false);
        }
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        if (value) {
            token();
            const controller = new AbortController();
            const signal = controller.signal;
            setToken(() => () => controller.abort());
            fetch(`https://api.scryfall.com/cards/search?q=${value}`, { signal }).then(response => {
                if (response.status !== 200) {
                    setResults([]);
                    setBadQuery(true);
                } else response.json()
                    .then(function(res) {
                        setResults(res.data);
                        setBadQuery(false);
                    }).catch((error) => {
                        console.log(error);
                    });
            }).catch((error) => {
                console.log(error);
            });
        } else {
            token();
            setResults([]);
            setBadQuery(false);
        }
    };
    
    const getImageUri = (cardId: string) => {
        let image: string | undefined;
        const card: Card | undefined = results.find((result) => result.id === cardId);
        if (card) {
            image = card.image_uris ? card.image_uris.png : undefined;
        } else {
            image = undefined;
        }

        setHoverImage(image);
    };

    return <>
        <div className="input-container">
            <input type="text" ref={searchInput} className="search-input" onChange={handleInput}></input>
            <i className="fas fa-times clear-input" onClick={clear}></i>
        </div>

        {   results.length 
                ? 
                <div className="results-container">
                    <ul>
                        {
                            results.map((card) => 
                                <li key={card.id} onClick={(e) => props.onSelect(card)}>
                                    {card.name}
                                    <i className="fas fa-camera preview-icon"
                                        data-tip
                                        data-for="image-preview"
                                        onMouseEnter={() => getImageUri(card.id)}
                                        onMouseLeave={() => getImageUri(card.id)}>
                                    </i>
                                </li>
                            )
                        }
                    </ul>
                    <Tooltip
                        id="image-preview"
                        className="preview-tooltip"
                        place="right"
                        type="light"
                        effect="float">
                        {
                            hoverImage ? <img src={hoverImage} className='tooltip-img' alt="card-preview"></img> : "Image Unavailable"
                        }
                    </Tooltip>
                </div> 
                : 
                badQuery 
                    ? 
                    <div className="results-container no-results">
                        <span className="no-results">No Results</span>
                    </div> 
                    : 
                    null
        }
    </>
}

export default Search;