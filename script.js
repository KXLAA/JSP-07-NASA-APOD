//NASA API
const count = 10
const APIkey ='DEMO_KEY';
const API = `https://api.nasa.gov/planetary/apod?api_key=${APIkey}&count=${count}`;
let resultsArray = [];
let favorites = {};

const showContent = () => {
    window.scrollTo({top: 0, behaviour: 'instant'})
    loader.classList.add('hidden') 
}


const createDomNodes = (page) => {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites) //Create an array from the Object
    console.log('Current Array', page, currentArray) 

    currentArray.forEach(result => {
        //Card Container
        const card = document.createElement('div')
        card.classList.add('image__card')

        //link 
        const link = document.createElement('a')
        link.href = result.hdurl;
        link.title = 'View Full Image'
        link.target = '_blank'

            //Image
            const image = document.createElement('img')
            image.src = result.url;
            image.alt = 'NASA PICTURE OF THE DAY';
            image.loading ='lazy';
            image.classList.add('image__card--img')
        
        link.appendChild(image)
        
            //Body Card Header
            const cardHeader = document.createElement('div')
            cardHeader.classList.add('image__card-header')
                const imageTitle = document.createElement('h1')
                imageTitle.textContent = result.title.toUpperCase();
                imageTitle.classList.add('image__card-title')
                
                const addToFav = document.createElement('p')
                addToFav.classList.add('image__card-link', 'add__fav')
                if(page === 'results'){
                    addToFav.textContent = 'FAVORITE'
                    addToFav.title ='Add to Favorites'
                    addToFav.setAttribute('onclick', `saveFavorite('${result.url}')`); //Save to Local Storage
                } else {
                    addToFav.textContent = 'REMOVE'
                    addToFav.title ='Remove From Favorites'
                    addToFav.setAttribute('onclick', `removeFavorite('${result.url}')`); //Save to Local Storage
                }

                
            
        cardHeader.append(imageTitle,addToFav)


            //Body Card Txt
            const ImageDescription = document.createElement('p')
            ImageDescription.textContent = result.explanation
            ImageDescription.classList.add('image__card-txt')

            //Body Card Footer
            const cardFooter = document.createElement('div')
            const imageDate = document.createElement('p')
            const imageCopyright = document.createElement('p')
            imageDate.textContent = result.date

            const copyrightResult = result.copyright === undefined ? '' : result.copyright 
            imageCopyright.textContent = copyrightResult
            cardFooter.classList.add('image__card-footer')
            imageDate.classList.add('date')
            imageCopyright.classList.add('copyright')
        
        cardFooter.append(imageDate, imageCopyright)

        card.append(link,cardHeader,ImageDescription,cardFooter)
        console.log(card)
        cardContainer.appendChild(card)

    });
}


const viewFavBtn = document.querySelector('.view__fav')
const loadImgBtn = document.querySelector('.load__img')
const addFavBtn = document.querySelectorAll('.add__fav')
const cardContainer = document.querySelector('.images')
const saveConfirmed = document.querySelector('.save-confirmed')
const loader = document.querySelector('.loader')


const updateDom = (page) => {
    //Get Fav from Local Storage
    if(localStorage.getItem('nasaFav')){
        favorites = JSON.parse(localStorage.getItem('nasaFav'))
        console.log('favorites from local storage', favorites)
    }
    cardContainer.textContent =''; //Update Page
    createDomNodes(page);
    showContent();
    document.body.style.padding = '4rem'

}



// Get Photos
const getPhotos = async () => {
    //Show Loader
    loader.classList.remove('hidden')
    document.body.style.padding = '0rem'

    try {
        const response = await fetch(API)
        resultsArray = await response.json()
        console.log(resultsArray)
        updateDom('results');
    } catch (error) {
        //Cath Error
        
    }
}


//Add result to Favorites
const saveFavorite = (itemURL) => {
   //Loop through results array to select fav
   resultsArray.forEach(item => {
    if(item.url.includes(itemURL) && !favorites[itemURL]){
        favorites[itemURL] = item

        //Show Save confirmation for 2 seconds
        saveConfirmed.hidden = false
        setTimeout(() => {
            saveConfirmed.hidden = true
        }, 2000);

        //Save to Local Storage
        localStorage.setItem('nasaFav', JSON.stringify(favorites))
    }

   })
}

//Remove item from Favorites
const removeFavorite = (itemURL) => {
 if(favorites[itemURL]){
     delete favorites[itemURL]

        //Save new object Local Storage
        localStorage.setItem('nasaFav', JSON.stringify(favorites))
        updateDom('favorites')
    }

}

//On Load
getPhotos();