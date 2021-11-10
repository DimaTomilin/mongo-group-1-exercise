function createElement(
  tagName,
  children = [],
  classes = [],
  attributes = {},
  eventListeners = {}
) {
  let el = document.createElement(tagName);
  //Adding children
  for (const child of children) {
    el.append(child);
  }
  //Adding classes
  for (const cls of classes) {
    el.classList.add(cls);
  }
  //Adding attributes
  for (const attr in attributes) {
    el.setAttribute(attr, attributes[attr]);
  }
  //Adding events
  for (const event in eventListeners) {
    el.addEventListener(event, eventListeners[event]);
  }
  return el;
}

document.getElementById('search').addEventListener('click', searchPerson);
document.getElementById('info').addEventListener('click', showInfo);

function numberValidator(number) {
  for (let i = 0; i < number.length; i++) {
    const char = number.charAt(i);
    if (char === '-') {
      continue;
    } else if (isNaN(Number(char))) {
      return false;
    }
  }
  return true;
}

function checkInputs() {
  const name = document.getElementById('add-name').value;
  const number = document.getElementById('add-number').value;
  if (!numberValidator(number) || !number) {
    showingAlert(500, 'Invalid number. Please use correct number.');
    return false;
  }
  if (!name) {
    showingAlert(500, 'Please use person name.');
    return false;
  }
  return true;
}

async function searchPerson() {
  try {
    document.getElementById('list-of-person').innerHTML = '';
    const name = document.getElementById('name-area').value;
    let response;
    if (name) {
      response = await axios.get(
        `https://vast-tor-68806.herokuapp.com/api/person?name=${name}`
      );
      createPersonList(response.data);
    }
    if (name === '') {
      response = await axios.get(
        `https://vast-tor-68806.herokuapp.com/api/persons`
      );

      createPersonList(response.data);
    }
  } catch (error) {
    showingAlert(error.response.status, error.response.statusText);
  }
}

async function showInfo() {
  const response = await axios.get(`https://vast-tor-68806.herokuapp.com/info`);
}

document.getElementById('add').addEventListener('click', addOrUpdate);

async function addOrUpdate() {
  const name = document.getElementById('add-name').value;
  const number = document.getElementById('add-number').value;
  if (!checkInputs()) {
    return false;
  }
  document.getElementById('add-name').value = '';
  document.getElementById('add-number').value = '';
  const response = await axios.get(
    `https://vast-tor-68806.herokuapp.com/api/person/check?name=${name}`
  );
  let result;
  if (response.data) {
    result = await updatePerson(name, number);
    showingAlert(result.status, 'Person`s number updated');
  } else {
    result = await addPerson(name, number);
    showingAlert(result.status, 'Person added to phonebook.');
  }
}

async function addPerson(name, number) {
  const response = await axios.post(
    `https://vast-tor-68806.herokuapp.com/api/person`,
    { name, number }
  );
  return response;
}

async function updatePerson(name, number) {
  const response = await axios.put(
    `https://vast-tor-68806.herokuapp.com/api/person`,
    { name, number }
  );
  return response;
}

async function deletePerson(e) {
  const removingElement = e.target.parentElement;
  const name = removingElement.firstChild.firstChild.innerHTML.slice(6);
  document.getElementById('list-of-person').removeChild(removingElement);
  const response = await axios.delete(
    `https://vast-tor-68806.herokuapp.com/api/person?name=${name}`
  );
  showingAlert(response.status, 'Person deleted.');
}

function createPersonElement(person) {
  const name = createElement('div', [`Name: ${person.name}`]);
  const number = createElement('div', [`Number: ${person.number}`]);
  const personInformation = createElement(
    'div',
    [name, number],
    ['information']
  );
  const buttonELement = createElement(
    'div',
    [],
    ['deletebtn'],
    {},
    { click: deletePerson }
  );
  buttonELement.innerHTML = '&times';
  const personElement = createElement(
    'div',
    [personInformation, buttonELement],
    ['person']
  );
  document.getElementById('list-of-person').append(personElement);
}

function createPersonList(personList) {
  let endLoop;
  if (personList.length < 10) {
    endLoop = personList.length;
  } else {
    endLoop = 10;
  }
  for (let i = 0; i < endLoop; i++) {
    createPersonElement(personList[i]);
  }
}

/*
*
*
Error Handler
*
*
*/

function showingAlert(status, message) {
  const object = document.getElementById('alert');
  object.classList.remove(object.classList.item(1));
  if (status < 300) {
    object.classList.add('success');
    object.querySelector(
      'div'
    ).innerHTML = `<strong>Success!<strong> ${message}`;
  } else {
    object.querySelector(
      'div'
    ).innerHTML = `<strong>Error!<strong> ${status} ${message}`;
  }
  object.style.display = 'block';
  object.style.opacity = '1';
}

const closeButtons = document.getElementsByClassName('closebtn');

for (const button of closeButtons) {
  button.onclick = function () {
    const div = this.parentElement;
    div.style.opacity = '0';
    setTimeout(function () {
      div.style.display = 'none';
    }, 600);
  };
}
