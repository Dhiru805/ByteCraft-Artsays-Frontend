import React from 'react';
// import NavBar from '../Home/HomeComponents/NavBar';
import Sidebar from '../../Component/SocialMedia/Sidebar/Sidebar';

import Suggestion from '../../Component/SocialMedia/Suggestion/Suggestion';
import SearchBar from '../../Component/SocialMedia/Searchbar/SearchBar';


const Search = () => {
  return (
    <div className=" flex flex-col">
    
      {/* Main layout: Sidebar | Post | Suggestion */}
      <main className='grid grid-cols-12 gap-2 p-2'>
        <Sidebar />
        <SearchBar/>
        <Suggestion />
      </main>
     
    </div>
  );
};

export default Search;
