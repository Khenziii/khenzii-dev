var githubRepoCard = document.getElementById('github-repo-card')

// sum stuff
var targetBlank = true

// icons
var star = `<svg viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>`
var fork = `<svg viewBox="0 0 16 16"><path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>`
var repo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path fill="none" d="M0 0h24v24H0z"/><path d="M13 21v2.5l-3-2-3 2V21h-.5A3.5 3.5 0 0 1 3 17.5V5a3 3 0 0 1 3-3h14a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1h-7zm-6-2v-2h6v2h6v-3H6.5a1.5 1.5 0 0 0 0 3H7zM7 5v2h2V5H7zm0 3v2h2V8H7zm0 3v2h2v-2H7z"/></g></svg>`

// newCard creates a HTML card for provided params.
function newCard(title, htmlUrl, desc, githubRepoCard, language, stars, forks) {
    targetBlank = githubRepoCard.dataset.targetBlank ? "target='_blank' rel='noopener'" : ""

    desc = desc ? desc : ''

    language = language ? `<p class="lang lang-sub align-center"><span class="lang-color ${language}"></span> ${language}</p>` : ''

    let showStars = stars <= 0 ? '' : `<a class="stars stars-forks col-6" href="${htmlUrl + '/stargazers'}" ${targetBlank}>${star} <span>${stars}</span></a>`

    let showForks = forks <= 0 ? '' : `<a class="forks stars-forks col-6" href="${htmlUrl + '/network/members'}" ${targetBlank}>${fork} <span>${forks}</span></a>`

    return `
    <div class="github-repo-card">
        <div>
            <p class="lang align-center">
                <span class="lang-color">${repo}</span>
                <a href="${htmlUrl}" ${targetBlank}>${title}</a>
            </p>
            ${language}
            <p class="desc">${desc}</p>
        </div>

        <div class="footer-info row">
            ${showStars}
            ${showForks}
        </div>
    </div>
    `
}

function fetchUserRepo(user, repo_name, githubRepoCard) {
    console.log(`https://api.github.com/repos/${user}/${repo_name}`)
    fetch(`https://api.github.com/repos/${user}/${repo_name}`).then(res => res.json()).then(repo => {
        githubRepoCard.innerHTML = newCard(repo.full_name, repo.html_url, repo.description, githubRepoCard, repo.language, repo.stargazers_count, repo.forks)
    })
}

console.log(githubRepoCard)
console.log(githubRepoCard.dataset)
fetchUserRepo(githubRepoCard.dataset.user, githubRepoCard.dataset.repo_name, githubRepoCard)

githubRepoCard.style.background = githubRepoCard.dataset.background ? githubRepoCard.dataset.background : '#171617'
githubRepoCard.style.color = githubRepoCard.dataset.background ? githubRepoCard.dataset.background : '#171617'