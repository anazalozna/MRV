/**
 * Created by Ana Zalozna on 17.03.17.
 */
'use strict';
import Config from './config'
import VideoController from './classes/VideoControl'

/**
 * Load main page
 *
 * @returns {Element}
 */
export function component() {
    let content = document.createElement('div');

    // add search block
    getSearchBlock()
        .then(html => {
            // add genres to page
            let search = createNode(html, 'div', 'search');
            content.appendChild(search);
            search.querySelector('form').addEventListener('submit', function(event){
                filterBySearch.call(this, event, content)
            })
        })
        // add genres block
        .then(() => fetch(`http://${Config.backend_host}/genres`))
        .then(data => data.json())
        .then(genres => render('genres', {genres: genres}))
        .then(html => {
            // add genres to page
            let genres = createNode(html, 'div', 'genres');
            content.appendChild(genres);
            genres.querySelectorAll('a').forEach(element => {
                element.addEventListener('click', function(event){
                    filterByGenre.call(this, event, content)
                })
            });
        })
        // load movies
        .then(() => fetch(`http://${Config.backend_host}/movies`))
        .then(data => data.json())
        .then(movies => loadMovies(movies, content))
        .catch(error => {
            console.log(error);
        });

    return content;
}

/**
 * Get search block html
 *
 * @returns {Promise}
 */
function getSearchBlock(){
    return new Promise((resolve) => {
        let html = render('search');
        resolve(html);
    });
}

function filterBySearch(event, content){
    event.preventDefault();

    let search_value = this.querySelector('input[type="text"]').value;
    if(!search_value){
        return;
    }

    fetch(`http://${Config.backend_host}/movies/filter`, {
            method: 'POST',
            body: JSON.stringify({
                'search': search_value
            }),
        })
        .then(data => data.json())
        .then(movies => loadMovies(movies, content))
        .catch(error => {
            console.log(error);
        });
}

/**
 * Reload movie content
 *
 * @param data
 * @param content
 */
function loadMovies(data, content){
    let html = '';
    if(data.length){
        html= render('movies', {movies: data});
    }else{
        html = 'Nothing was found.';
    }


    // clean old video
    content.querySelectorAll('#movie-list li').forEach(li =>{
        li.parentNode.removeChild(li);
    });

    // add movies to page
    let movies = createNode(html, 'div', 'content');
    content.appendChild(movies);
    movies.querySelectorAll('li').forEach(element => {
        element.addEventListener('click', () => openPopUP(element))
    });
}

/**
 * Filter movie by genre
 *
 * @param event
 * @param content
 */
function filterByGenre(event, content){
    event.preventDefault();

    let genre_id = this.hash.slice(1);

    fetch(`http://${Config.backend_host}/genres/${genre_id}`)
        .then(data => data.json())
        .then(movies => loadMovies(movies, content))
        .catch(error => {
            console.log(error);
        });
}

/**
 * Render Mustache template
 *
 * @param template_name (Name of file)
 * @param data
 * @returns {*}
 */
function render(template_name, data={}){
    let template = require(`./html/${template_name}.html`);
    return template(data);
}

/**
 * Get movie data and put it to pop up
 *
 * @param element
 */
function openPopUP(element){
    let popup;

    fetch(`http://${Config.backend_host}/movies/${element.id}`)
        .then(data => data.json())
        .then(movie => render('popup', movie))
        .then(html => {
            // Put content to popup
            let popup_box = createNode(html, 'div', 'popup_box');
            popup = popup_box.querySelector('.popup_content');
            document.body.appendChild(popup_box);
        })
        .then(() => {
            // event listener to close button
            popup.querySelector('.close').addEventListener('click', event => {
                event.preventDefault();
                popup.parentNode.parentNode.removeChild(popup.parentNode)
            });
        })
        .then(() => {
            // add custom controllers to video
            let controller = new VideoController(popup.querySelector('.video'));
            controller.implement();
        })
        .then(() => addComments(element.id, popup))
        .catch(error => {
            console.log(error);
        });
}

/**
 * Add comments to popup
 *
 * @param video_id
 * @param popup
 */
function addComments(video_id, popup){
    fetch(`http://${Config.backend_host}/comments/${video_id}`)
        .then(data => data.json())
        .then(comments => render('comments', {comments: comments}))
        .then(comment_html => {
            // add comments block
            popup.appendChild(createNode(comment_html, 'div', 'comments'))
        })
        .then(() => {
            // add comment form listener
            document.querySelector('.add-comment').addEventListener('submit', function(event){
                sendComment.call(this, event, video_id)
            });
        })
}

/**
 * Send new comment to backend and add new comment
 *
 * @param event
 * @param video_id
 */
function sendComment(event, video_id){
    event.preventDefault();
    let comment = {};

    prepareForm(this)
        .then(form_data => {
            // send comment to backend
            Object.assign(comment, form_data, {date: '1 sec ago'});
            Object.assign(form_data, {video_id: video_id});

            return fetch(`http://${Config.backend_host}/comments/add`, {
                method: 'POST',
                body: JSON.stringify(form_data),
            });
        })
        .then(data => data.json())
        .then(result => {
            if(result !== 'success'){
                throw [result];
            }
        })
        .then(() => render('new_comment', comment))
        .then(html => {
            // add comment to html
            let comment_bloc = document.querySelector('.comments_block li');
            if(comment_bloc){
                comment_bloc.parentNode.insertBefore(createNode(html, 'li'), comment_bloc);
            }else{
                document.querySelector('.comments_block').appendChild(createNode(html, 'li'));
            }
        })
        .then(() => {
            //clean form
            this.querySelectorAll('input[type="text"], textarea').forEach( element => {
                element.value = '';
            });
        })
        .catch(errors => {
            if(Array.isArray(errors)){
                showErrors(this.querySelector('.errors'), errors);
            }else {
                showErrors(this.querySelector('.errors'), ['Oops, something went wrong :(']);
                console.log(errors);
            }
        });
}

/**
 * Validate form
 *
 * @param form
 * @returns {Promise}
 */
function prepareForm(form){
    return new Promise((resolve, reject) => {
        let fields = form.querySelectorAll('input[type="text"], textarea');

        let errors = validateForm(fields);
        if(errors.length){
            reject(errors);
        }

        let form_data = Object.create(null);
        fields.forEach(element => {
            form_data[element.name] = element.value;
        });

        resolve(form_data);
    });
}

/**
 * Show errors to ul block
 *
 * @param parentElement
 * @param errors
 */
function showErrors(parentElement, errors){
    // clear previous errors
    parentElement.querySelectorAll('li').forEach(li =>{
        li.parentNode.removeChild(li);
    });

    errors.forEach(error => {
        let text = document.createTextNode(error);
        let li = document.createElement('li');

        li.appendChild(text);
        parentElement.appendChild(li);
    });
}

/**
 * Validate form fields
 *
 * @param form_data
 * @returns {Array}
 */
function validateForm(form_data){
    let errors = [];
    form_data.forEach(element => {
        if(!element.value){
            errors.push(`Fiels '${element.name}' is empty!`);
        }
    });

    return errors;
}

/**
 * Create DOM elements
 *
 * @param html
 * @param tag
 * @param classes
 * @returns {Element}
 */
function createNode(html, tag='div', ...classes){
    let element = document.createElement(tag);
    classes.forEach(item => {
        element.classList.add(item);
    });

    element.innerHTML = html;

    return element;
}