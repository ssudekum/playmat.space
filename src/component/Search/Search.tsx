import React, { useRef, useState } from 'react';
import './Search.css'
import Card from '../../lib/Card';

const Search: React.FC<{ onSelect: Function }> = props => {
  const [token, setToken] = useState(() => () => { });
  const [results, setResults] = useState<Card[]>([]);
  const [badQuery, setBadQuery] = useState(false);
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
      fetch(`https://api.scryfall.com/cards/search?q=${value}`, {signal}).then((response) => {
        if (response.status !== 200) {
          setResults([]);
          setBadQuery(true);
        } else {
          response.json().then((res) => {
            setResults(res.data);
            setBadQuery(false);
          }).catch((error) => {
            console.log(error);
          });
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      token();
      setResults([]);
      setBadQuery(false);
    }
  };

  const resultItem = (card: Card) => (
    <li key={card.id} onClick={() => {
      props.onSelect(card);
      clear();
    }}>
      {card.name}
    </li>
  );

  const resultsContainer = () => (
    <div className="results-container">
      <ul>
        {results.map((card) => resultItem(card))}
      </ul>
    </div>
  );

  const noResults = () => (
    <div className="results-container no-results">
      <span className="no-results">
        No Results
      </span>
    </div>
  );

  return <>
    <div className="input-container">
      <input type="text" ref={searchInput} className="search-input" onChange={handleInput} placeholder="Search for cards to add..."></input>
      <i className="fas fa-times clear-input" onClick={clear}></i>
    </div>

    {results.length
        ? resultsContainer() 
        : badQuery
          ? noResults() 
          : null}
  </>
}

export default Search;