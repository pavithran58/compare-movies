const autoComleteConfig = {
    rendering: (movie) => {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSrc}" />
        ${movie.Title} (${movie.Year})
        `
    },
   const proxy = 'https://cors-anywhere.herokuapp.com/';
    inputValue: (movie) => {return movie.Title},
    fetchData : async (searchTerm) => {
        
        const response = await axios.get(`${proxy}https://www.omdbapi.com/`, {
            params: {
                apikey: 'fd73f0c6',
                s: searchTerm
            }
        })
    
        return response.data.Search;
    }
}


const debounce = (funct) => {
    let timeoutId;
    return (...args) => {
        if(timeoutId) {
            clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(() => {
            //  funct.apply(null, args)
             funct(...args);
        }, 1000)
    }
}

autoComplete( {
    ...autoComleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden')
        return onMovie(movie, document.querySelector('#left-summary'), 'left')
        }
    
})

autoComplete( {
    ...autoComleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden')
        return onMovie(movie, document.querySelector('#right-summary'), 'right')
        }
    
})


let leftSide;
let rightSide;




const onMovie = async (id, summ, side) => {
    const response = await axios.get(`${proxy}https://www.omdbapi.com/`, {
        params: {
            apikey: 'fd73f0c6',
            i: id.imdbID
        }
    })
    
    const film = response.data;
    console.log(film)
    summ.innerHTML = movieTemplate(film)
    if(side === 'left') {
            leftSide = film;
    } else {
        rightSide = film;
    }
    if(leftSide && rightSide) {
        runComparison();
    }
}
const runComparison = function () {
    const leftStats = document.querySelectorAll('#left-summary .notification')
    const rightStats = document.querySelectorAll('#right-summary .notification')

    leftStats.forEach((ls, idx) => {
        const rs = rightStats[idx]

        const lvalue = parseInt(ls.dataset.value);
        const rvalue = parseInt(rs.dataset.value);
        if(lvalue > rvalue) {
            rs.classList.remove('is-primary')
            rs.classList.add('is-warning')
        }
        else {
            ls.classList.remove('is-primary')
            ls.classList.add('is-warning')
        }
    })
}

const movieTemplate = (movie) => {

    const boxoffice = parseInt(movie.BoxOffice.replace(/\$/g,'').replace(/,/g, ''))
    const metascore = parseInt(movie.Metascore)
    const imdbrating = parseFloat(movie.imdbRating)
    const votes = parseInt((movie.imdbVotes).replace(/,/g, ''))
    let awards = 0;
    const award = movie.Awards.split(' ').forEach(element => {
        const value = parseInt(element);
        if(isNaN(value)){
            return;
        }
        else {
            awards = awards + value;
        }
    });
    console.log(awards)
    return `
    <section class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movie.Poster}" />
            </p>    
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movie.Title}</h1>
                <h4>${movie.Genre}</h4>
                <p>${movie.Plot}</p>
            </div>
       </div>
    </section>
    <article data-value=${awards} class="notification is-primary">
        <p class="title">${movie.Awards}</p>
        <p class="subtitles">Awards</p>
    </article>
    <article data-value=${boxoffice} class="notification is-primary">
        <p class="title">${movie.BoxOffice}</p>
        <p class="subtitles">Box-Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
        <p class="title">${movie.Metascore}</p>
        <p class="subtitles">Metascore Rating</p>
    </article>
    <article data-value=${imdbrating} class="notification is-primary">
        <p class="title">${movie.imdbRating}</p>
        <p class="subtitles">IMDB Rating</p>
    </article>
    <article data-value=${votes} class="notification is-primary">
        <p class="title">${movie.imdbVotes}</p>
        <p class="subtitles">IMDB Votes</p>
    </article>
    `
}




