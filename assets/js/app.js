const formButton = document.getElementById('submitBtn'),
      form = document.getElementById('form'),
      formBtn = document.getElementById('submit'),
      contactForm = document.getElementById('contact-form'),
      alert = document.getElementById('alert'),
      alertPrompt = document.getElementById('alertPrompt')

formButton.addEventListener('click', formSubmit);
formBtn.addEventListener('click', ContactFormSubmit);
alert.style.display = 'none';
alertPrompt.style.display = 'none';

function formSubmit(e){
    e.preventDefault();
    //read the value
    let name = document.getElementById('contact-name');
    let phone = document.getElementById('contact-phone');
    let email = document.getElementById('contact-email');
    let subject = document.getElementById('subject');
    let message = document.getElementById('contact-message');
    let emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const formObjects = {
        name: name.value,
        phone: phone.value,
        email: email.value,
        subject: subject.value,
        message: message.value
    }

    if (name.value != '' && email.value != "" && subject.value != '' && message.value != "" && emailValidation.test(email.value)) {
        //fetch request
        fetch('https://vue-http-learning-b7e81-default-rtdb.firebaseio.com/portfolio.json', {
            method: 'POST',
            headers: {
            //tells server we'll add data to the request which would be in json format
            'Content-type': 'application/json'
            },
            body: JSON.stringify( {
            formObjects: formObjects
            }),
        }).then(() => {
            //   console.log(res);
                alert.textContent = 'Successful, thanks for reaching out'
                alert.style.display = 'block';
                setTimeout(
                    () => {
                        alert.style.display = 'none'
                }, 3000); 
          }).catch(() => {
            // console.log(error);
            alert.textContent = 'Could not save data - please try again later'
            alert.style.display = 'block';
            setTimeout(
                () => {
                    alert.style.display = 'none'
                }, 3000);   
            });
    }else if (name.value != '' && email.value != "" && subject.value != '' && message.value != "" && emailValidation.test(email.value) != true){
        alert.textContent = 'Please enter valid Email address'
        alert.style.display = 'block';
        setTimeout(
            () => {
                alert.style.display = 'none'
            }, 3000);   
    }else {
        alert.textContent = 'Please enter valid response(s)'
        alert.style.display = 'block';
        setTimeout(
            () => {
                alert.style.display = 'none'
            }, 3000);     
    }

    // console.log('not working...........');
    

    //   name.value = "";
    //   phone.value = "";
    //   email.value = "";
    //   subject.value = "";
    //   message.value = "";

    // setTimeout(
    //     () => {
    //         window.location.reload();
    //     }, 4000);  
    
    setTimeout(
        () => {
            form.reset();
        }, 3000);   
    
}
function ContactFormSubmit(e){
    e.preventDefault();
    //read the value
    let name = document.getElementById('name');
    let phone = document.getElementById('phone');
    let email = document.getElementById('email');
    let subject = document.getElementById('contact-subject');
    let message = document.getElementById('message');
    let emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const formObjects = {
        name: name.value,
        phone: phone.value,
        email: email.value,
        subject: subject.value,
        message: message.value
    }

    if (name.value != '' && email.value != "" && subject.value != '' && message.value != "" && emailValidation.test(email.value)) {
        fetch('https://vue-http-learning-b7e81-default-rtdb.firebaseio.com/portfolio.json', {
            method: 'POST',
            headers: {
            'Content-type': 'application/json'
            },
            body: JSON.stringify( {
            formObjects: formObjects
            }),
        }).then(() => {
            //   console.log(res);
                alertPrompt.textContent = 'Successful, thanks for reaching out'
                alertPrompt.style.display = 'block';
                setTimeout(
                    () => {
                        alertPrompt.style.display = 'none'
                }, 3000); 
          }).catch(() => {
            // console.log(error);
            alertPrompt.textContent = 'Could not save data - please try again later'
            alertPrompt.style.display = 'block';
            setTimeout(
                () => {
                    alertPrompt.style.display = 'none'
                }, 3000);   
            });
    } else if (name.value != '' && email.value != "" && subject.value != '' && message.value != "" && emailValidation.test(email.value) != true){
        alertPrompt.textContent = 'Please enter valid Email address'
        alertPrompt.style.display = 'block';
        setTimeout(
            () => {
                alertPrompt.style.display = 'none'
            }, 3000);     
    }else {
        alertPrompt.textContent = 'Please enter valid response(s)'
        alertPrompt.style.display = 'block';
        setTimeout(
            () => {
                alertPrompt.style.display = 'none'
            }, 3000);     
    }

    // console.log('contact form section'); 
    
    setTimeout(
        () => {
            contactForm.reset();
        }, 3000);   
    
}