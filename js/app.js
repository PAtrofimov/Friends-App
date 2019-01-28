class FriendApp {
  constructor() {
    this.persons = document.querySelector(".persons");
    this.filterInput = document.querySelector("#search");
    this.sortGender = document.querySelector("#sort-gender");
    this.sortAge = document.querySelector("#sort-age");
    this.sortName = document.querySelector("#sort-name");
    this.resetBtn = document.querySelector(".reset");
    this.friends = [];
    this.initialFriends = [];
    this.init();
    this.reset = this.reset.bind(this);
    this.sort = this.sort.bind(this);
    this.filterPersonsByText = this.filterPersonsByText.bind(this);
    this.addEventsListeners();
	this.selectedSort = "";
	this.selectedGender = "all";
  }

  init() {
    this.getPersonsFromApi();
  }
  getPersonsFromApi() {
    fetch("https://randomuser.me/api/?results=100", {
      method: "GET"
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        this.initialFriends = res.results;
        this.friends = res.results;
        this.showPersons(this.friends);
      })
      .catch(err => {
        console.log(err);
      });
  }
  showPersons(data) {
    data.forEach(person => {
      this.addCardToPersons(this.createPersonCard(person));
    });
  }

  firstLetterToUpper(name) {
    return name[0].toUpperCase() + name.slice(1);
  }

  reset() {
    this.filterInput.value = "";
    this.hidePersons();
    this.friends = this.initialFriends;
    this.showPersons(this.friends);
	this.selectedSort = "";
	this.selectedGender = "all";
  }

  createPersonCard(element) {
    const person = document.createElement("div");
    person.classList.add("person");

    const photo = document.createElement("div");
    photo.classList.add("person__photo");

    const photoImg = document.createElement("img");
    photoImg.classList.add("person__photo");
    photoImg.setAttribute("src", element.picture.large);
    photo.appendChild(photoImg);

    const fullName = document.createElement("div");
    fullName.classList.add("person__description");
    fullName.textContent = `${this.firstLetterToUpper(
      element.name.first
    )} ${this.firstLetterToUpper(element.name.last)}`;

    const location = document.createElement("div");
    location.classList.add("person__description");
    location.classList.add("person__location");
    location.textContent = this.firstLetterToUpper(element.location.city);

    const number = document.createElement("div");
    number.classList.add("person__number");
    number.classList.add("person__description");
    number.textContent = `Моб: ${element.cell}`;

    const age = document.createElement("div");
    age.classList.add("person__description");
    age.classList.add("person__age");
    age.textContent = `Возраст: ${element.dob.age}`;
    person.append(photo, fullName, location, age, number);
    return person;
  }

  addCardToPersons(card) {
    this.persons.appendChild(card);
  }

  hidePersons() {
    this.persons.innerHTML = "";
  }

  sort(e) {
    switch (e.target.value) {
      case "ageUp":
        this.filterByAge();
		this.selectedSort = e.target.value;
        break;
      case "ageDown":
        this.filterByAge(false);
		this.selectedSort = e.target.value;
        break;
      case "nameDown":
        this.filterByName(false);
		this.selectedSort = e.target.value;
        break;
      case "nameUp":
        this.filterByName();
		this.selectedSort = e.target.value;
        break;
      case "male":
        this.filterByGender("male");
		this.selectedGender = e.target.value;
        break;
      case "female":
        this.filterByGender("female");
		this.selectedGender = e.target.value;
        break;
      case "all":
        this.filterByGender("all");
		this.selectedGender = e.target.value;
    }
  }
  filterByAge(asc = true) {
    this.hidePersons();
    this.friends = this.initialFriends;
    if (this.filterInput.value) {
      this.friends = this.getPersonsByInput();
    }
	this.friends = this.getPersonsByGender();
	  
    this.showPersons(this.sortPersonsByAge(asc));
  }

  filterByName(asc = true) {
    this.hidePersons();
    this.friends = this.initialFriends;
    if (this.filterInput.value) {
      this.friends = this.getPersonsByInput();
    }
	this.friends = this.getPersonsByGender();
	   
    this.showPersons(this.sortPersonsByName(asc));
  }
  
  sortPersonsByName(asc) {
   	
    const result = !asc
      ? this.friends.sort((a, b) => {
          if (a.name.first < b.name.first) {
            return 1;
          }
          if (a.name.first > b.name.first) {
            return -1;
          }
          return 0;
        })
      : this.friends.sort((a, b) => {
          if (a.name.first < b.name.first) {
            return -1;
          }
          if (a.name.first > b.name.first) {
            return 1;
          }
          return 0;
        });
    return result;
  }
  
  
  sortPersonsByAge(asc) {
   	
    const result = asc
      ? this.friends.sort((a, b) => a.dob.age - b.dob.age)
      : this.friends.sort((a, b) => b.dob.age - a.dob.age);
    return result;
  }
  

  filterByGender(gender) {
    this.friends = this.initialFriends;
    if (this.filterInput.value) {
      this.friends = this.getPersonsByInput();
    }
	
	 if (gender !== "all") {
		 this.friends = this.friends.filter(person => person.gender === gender);
	}
    
	this.sortPersons();
	
    this.hidePersons();
    this.showPersons(this.friends);
  }
  
  
	sortPersons() {
	
	switch (this.selectedSort) {
      case "ageUp":
        this.friends = this.sortPersonsByAge();
        break;
      case "ageDown":
        this.friends = this.sortPersonsByAge(false);
		break;
      case "nameDown":
        this.friends = this.sortPersonsByName(false);
		break;
      case "nameUp":
        this.friends = this.sortPersonsByName();
		}
	}
  	
	getPersonsByGender() {
		
	const result = this.friends.filter(
      function(person) {
        return person.gender === this.selectedGender || this.selectedGender === "all" ;
      }.bind(this)
    );	
	
    return result;
  }

  getPersonsByInput() {
    const result = this.friends.filter(
      function(person) {
        return (
          person.name.first
            .toLowerCase()
            .includes(this.filterInput.value.toLowerCase()) ||
          person.name.last
            .toLowerCase()
            .includes(this.filterInput.value.toLowerCase())
        );
      }.bind(this)
    );
    return result;
  }

  filterPersonsByText() {
    this.hidePersons();
    this.friends = this.initialFriends;
    if (this.filterInput.value) {
      this.friends = this.getPersonsByInput();
    }
	this.friends = this.getPersonsByGender();
	this.sortPersons();
    this.showPersons(this.friends);
  }

  addEventsListeners() {
    this.filterInput.addEventListener("keyup", this.filterPersonsByText);
    this.sortGender.addEventListener("change", this.sort);
    this.sortAge.addEventListener("change", this.sort);
    this.sortName.addEventListener("change", this.sort);
    this.resetBtn.addEventListener("click", this.reset);
  }
}

new FriendApp();
