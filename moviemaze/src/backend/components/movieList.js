import react from 'react';

const movieList = (props) =>{
    return(
        <>
            {props.movies.map((movieList, index)=> <div>
                    <img src={movie.Poster} alt='movie'></img>
                </div>)}
        </>
    )
}

export default movieList;