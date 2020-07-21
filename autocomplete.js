const autoComplete = ({ 
     root,
     rendering,
     onOptionSelect,
     inputValue,
     fetchData
                }) => {
    root.innerHTML = `
    <label><b>Search for a Movie</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
    </div>
    `;
    
    
    const input = root.querySelector('input')
    const results = root.querySelector('.results')
    const dropdown = root.querySelector('.dropdown')

    const onInput = async (event) => {
        const items = await fetchData(event.target.value);
        results.innerHTML="";
    
        if(!items.length) {
            dropdown.classList.remove('is-active')
            return;
        }
        dropdown.classList.add('is-active')
    
        
        for(let item of items) {
            
            let anc = document.createElement('a')
            anc.classList.add('dropdown-item')
            
            anc.innerHTML = rendering(item)
            console.log(item.Title)
            
                results.appendChild(anc)
    
    
            anc.addEventListener('click', ()=> {
                input.value = inputValue(item);
                dropdown.classList.remove('is-active')
                onOptionSelect(item);
               
            })
            
        }
    
        document.addEventListener('click', (event)=> {
            if(!root.contains(event.target)) {
                
                dropdown.classList.remove('is-active')
            }
        })
    
        
    }
    
    input.addEventListener('input', debounce(onInput))  


    }








