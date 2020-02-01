class Github {
  constructor() {
    this.client_id = "1dc54fa2d632c8d78104";
    this.client_secret = "b8a3d2405c5f4dfc4a62b030b9cf218c07caeca4";
    this.base = `https://api.github.com/users/`;
  }
  async ajaxApı(userValue) {
    const baseUrl = `${this.base}${userValue}?client_id=${this.client_id}&client_secret=${this.client_secret}`;
    const reposUrl = `${this.base}${userValue}/repos?client_id=${this.client_id}&client_secret=${this.client_secret}`;

    const userData = await fetch(baseUrl);
    const user = await userData.json();
    const reposData = await fetch(reposUrl);
    const repos = await reposData.json();
    return {
      user,
      repos
    };
  }
}
class UI {
  constructor() {
    this.feedback = document.querySelector(".feedback");
  }
  showFeedback(text) {
    this.feedback.classList.add("showItem");
    this.feedback.innerHTML = `<p>${text}</p>`;
    setTimeout(() => {
      this.feedback.classList.remove("showItem");
    }, 3000);
  }
  getUser(user) {
    const {
      avatar_url: image,
      name,
      login,
      blog,
      html_url: link,
      public_repos: repos,
      message
    } = user;
    if (message === "Not Found") {
      this.showFeedback("This user is not available");
    } else {
      this.displayUser(image, link, repos, name, login);
      const searchUser = document.getElementById("searchUser");
      searchUser.value = "";
    }
  }
  displayUser(image, link, repos, name, login) {
    const githubUsers = document.getElementById("github-users");
    const div = document.createElement("div");
    div.className = "row single-user my-3";
    div.innerHTML = `<div class=" col-sm-6 col-md-4 user-photo my-2">
                        <img src="${image}" class="img-fluid" alt="">
                    </div>
                    <div class="col-sm-6 col-md-4 user-info text-capitalize my-2">
                        <h6>name : <span>${name}</span></h6>
                        <h6>github : <a href="${link}" class="badge badge-primary">link</a> </h6>
                        <h6>public repos : <span class="badge badge-success">${repos}</span> </h6>
                    </div>
                    <div class=" col-sm-6 col-md-4 user-repos my-2">
                        <button type="button" data-id='${login}' id="getRepos" class="btn reposBtn text-capitalize mt-3">
                            get repos
                        </button>
                    </div>`;
    githubUsers.appendChild(div);
  }
  displayRepos(userId, repos) {
    const reposBtn = document.querySelectorAll("[data-id]");
    reposBtn.forEach(btn => {
      if (btn.dataset.id === userId) {
        const parent = btn.parentNode;
        repos.forEach(repo => {
          const parag = document.createElement("p");
          parag.innerHTML = `<p><a href='${repo.html_url}' target='_blank'>${repo.name}</a></p>`;
          parent.appendChild(parag);
        });
      }
    });
  }
}

(function() {
  const githubApi = new Github();
  const ui = new UI();

  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchUser");
  const userList = document.getElementById("github-users");

  form.addEventListener("submit", event => {
    event.preventDefault();
    let user = input.value;
    if (user.length === 0) {
      ui.showFeedback("Search a valid name");
    } else {
      githubApi
        .ajaxApı(user)
        .then(data => ui.getUser(data.user))
        .catch(error => console.log(error));
    }
  });

  userList.addEventListener("click", event => {
    if (event.target.classList.contains("reposBtn")) {
      const userID = event.target.dataset.id;
      githubApi
        .ajaxApı(userID)
        .then(data => ui.displayRepos(userID, data.repos))
        .catch(error => console.log(error));
    }
  });
})();
