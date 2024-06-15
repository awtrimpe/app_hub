const json = INJECT_JSON;
let cat_container_ref;
let links_ref;

window.onload = () => {
    document.title = json.title;
    document.getElementById('page-title').innerText = json.title;
    cat_container_ref = document.getElementById('category-container');
    links_ref = document.getElementById('links');
    buildAppPage(JSON.parse(JSON.stringify(json)), cat_container_ref)
    startSearch();
}

/**
 * Initializes the app portion of the page
 * @param {object} cat_json
 * @param {HTMLDivElement} cat_container 
 */
function buildAppPage(cat_json, cat_container) {
    cat_container.replaceChildren();
    links_ref.replaceChildren();
    cat_json.categories.forEach((cat) => {
        createCategory(cat, cat_container);
    });
}

/**
 * Create a category container and trigger the app generation
 * @param {object} cat_json
 * @param {HTMLDivElement} cat_container 
 */
function createCategory(cat_json, cat_container) {
    const anchor = document.createElement('a');
    anchor.onclick = () => {
        scrollToDiv(cat_json.title)
    };
    anchor.innerText = cat_json.title;
    links_ref.appendChild(anchor);
    const cat_elem = document.createElement('div');
    cat_elem.classList.add('category');
    cat_elem.id = cat_json.title;
    const cat_title_elem = document.createElement('h3')
    cat_title_elem.innerText = cat_json.title;
    cat_elem.appendChild(cat_title_elem);
    cat_container.appendChild(cat_elem);
    const app_container = document.createElement('div');
    app_container.classList.add('app-container');
    cat_elem.appendChild(app_container);
    cat_json.apps.forEach((app) => {
        createApp(app, app_container);
    });
}

/**
 * Create an instance of an app and append it to the provided container
 * @param {object} app_json 
 * @param {HTMLDivElement} cat_elem 
 */
function createApp(app_json, app_container) {
    const app_elem = document.createElement('div');
    app_elem.classList.add('app');
    const image = document.createElement('img');
    image.src = app_json.icon;
    const image_container = document.createElement('div');
    image_container.classList.add('image_container');
    image_container.appendChild(image);
    app_elem.appendChild(image_container);
    const title = document.createElement('h5');
    title.innerText = app_json.acronym ? `${app_json.name} (${app_json.acronym})` : app_json.name;
    title.id = app_json.name;
    app_elem.appendChild(title);
    if (app_json.link) {
        const link = document.createElement('a');
        link.href = app_json.link;
        link.target = '_blank';
        link.innerText = `Launch >`;
        app_elem.appendChild(link);
    } else {
        if (app_json.environments.length > 0) {
            const panel = document.createElement('div');
            panel.classList.add('panel');
            const panel_title = document.createElement('strong');
            panel_title.innerText = 'View All ↓';
            panel.appendChild(panel_title);
            const links_con = document.createElement('div');
            links_con.classList.add('links');
            for (const ref of app_json.environments) {
                const link = document.createElement('a');
                link.href = ref.link;
                link.target = '_blank';
                link.innerText = `Launch ${ref.name} >`;
                links_con.appendChild(link);
            }
            panel.appendChild(links_con);
            app_elem.appendChild(panel);
        }
    }
    app_container.appendChild(app_elem);
}

/**
 * Initializes search monitoring. Contains the search filtering logic
 */
function startSearch() {
    const search_field = document.getElementsByTagName('input')[0];
    search_field.addEventListener('keyup', (e) => {
        if (e.target && e.target.value) {
            const s = e.target.value.toLocaleLowerCase();
            const apps_copy = JSON.parse(JSON.stringify(json));
            apps_copy.categories = apps_copy.categories.map((cat) => {
                cat.apps = cat.apps.filter((app) => {
                    return (app.name.toLocaleLowerCase().includes(s) ||
                        app.acronym.toLocaleLowerCase().includes(s) ||
                        app.link.toLocaleLowerCase().includes(s));
                });
                return cat;
            });
            apps_copy.categories = apps_copy.categories.filter((cat) => {
                return cat.apps.length > 0;
            });
            buildAppPage(apps_copy, cat_container_ref);
        } else {
            buildAppPage(json, cat_container_ref);
        }
    });
}

/**
 * Clears the input box for the search
 */
function clearSearch() {
    const search_field = document.getElementsByTagName('input')[0];
    search_field.value = '';
    buildAppPage(JSON.parse(JSON.stringify(json)), cat_container_ref)
}

/**
 * A function to scroll the page to the provided ID
 * @param id The tag's ID to scroll to
 */
function scrollToDiv(id) {
    document.getElementById(id).scrollIntoView({
        behavior: "smooth"
    });
}