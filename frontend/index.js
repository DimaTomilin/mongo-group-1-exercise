document.getElementById('search').addEventListener('click', searchPerson);

async function searchPerson() {
  try {
    document.getElementById('list-of-person').innerHTML = '';
    const name = document.getElementById('name-area').value;
    let response;
    if (name) {
      response = await axios.get(
        `https://vast-tor-68806.herokuapp.com/api/person?name=${name}`
      );
      console.log(response);
      createPersonElement(response.data);
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

function createPersonElement(person) {
  const personElement = document.createElement('div');
  personElement.classList.add('person');
  personElement.innerHTML = `Name: ${person.name}<br>Number: ${person.number}`;
  document.getElementById('list-of-person').append(personElement);
}

function createPersonList(personList) {
  for (const person of personList) {
    createPersonElement(person);
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
  if (status === 200) {
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
