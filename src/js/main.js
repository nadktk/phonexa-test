let jobsJSON = `{
  "departments": {
    "Sales" : [
      "Sales Manager",
      "Account Manager"
    ],
    "Marketing" : [
      "Creative Manager",
      "Marketing Coordinator",
      "Content Writer"
    ],
    "Technology" : [
      "Project Manager",
      "Software Developer",
      "PHP programmer",
      "Front End",
      "Quality Assurance"
    ]
  }
}`;

/* custom validation methods */
$.validator.addMethod(
  'lettersOnly',
  function(value, element) {
    return this.optional(element) || /^[a-zA-Zа-яА-ЯёЁіІїЇ]+$/.test(value);
  },
  'Only letters are allowed'
);

$.validator.addMethod(
  'passwordRule',
  function(value, element) {
    return (
      this.optional(element) ||
      (/\d/.test(value) &&
        /[!@#$%^&*~]/.test(value) &&
        /[a-zA-Zа-яА-ЯёЁіІїЇ]/.test(value))
    );
  },
  'Required at least one number, uppercase and lowercase letters and at least one special character(!@#$%^&*~)'
);

/* set up validator */
const validator = $('#register-form').validate({
  rules: {
    firstname: {
      required: true,
      lettersOnly: true
    },
    lastname: {
      required: true,
      lettersOnly: true
    },
    login: 'required',
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      passwordRule: true
    },
    cpassword: {
      required: true,
      equalTo: '#password'
    },
    department: 'required',
    vacancy: 'required'
  },
  messages: {
    firstname: { required: 'Please specify your first name' },
    lastname: { required: 'Please specify your last name' },
    login: 'Please specify your login',
    email: {
      required: 'We need your email address to contact you',
      email: 'Your email address must be in the format of name@domain.com'
    },
    password: { required: 'Please specify your password' },
    cpassword: 'Must be equal to password'
  }
});

$(function() {
  const jobs = JSON.parse(jobsJSON);
  const $form = $('#register-form');
  const form = $form[0];

  const depSelect = $('#dep-select');
  const vacSelect = $('#vac-select');

  const step1 = $('#fs-step1');
  const step2 = $('#fs-step2');
  const step3 = $('#fs-step3');

  /* show departments options */
  for (let department in jobs.departments) {
    depSelect.append(`<option value="${department}">${department}</option>`);
  }

  /* show vacancies options */
  depSelect.change(function() {
    vacSelect
      .children()
      .not(':first-child')
      .remove();
    for (let vacancy of jobs.departments[this.value]) {
      vacSelect.append(`<option value="${vacancy}">${vacancy}</option>`);
    }
    vacSelect.prop('disabled', false);
  });

  /* buttons actions*/
  $('#next1').click(() => {
    const isValid = validator.form();
    if (isValid) {
      switchSteps(step1, step2);
    }
  });

  $('#next2').click(() => {
    const isValid = validator.form();
    if (isValid) {
      switchSteps(step2, step3);
      /* set info block */
      $('#name-info').text(form.firstname.value + ' ' + form.lastname.value);
      $('#login-info').text(form.login.value);
      $('#email-info').text(form.email.value);
      $('#company-info').text(form.company.value);
      $('#department-info').text(form.department.value);
      $('#vacancy-info').text(form.vacancy.value);
    }
  });

  $('#edit').click(() => switchSteps(step3, step1));

  $('#submit-register-form').click(function(e) {
    e.preventDefault();
    const newData = {
      firstname: form.firstname.value,
      lastname: form.lastname.value,
      login: form.login.value,
      email: form.email.value,
      company: form.company.value,
      password: form.password.value
    };
    window.localStorage.setItem('myData', JSON.stringify(newData));
    switchSteps(step3);
  });

  /* function for steps switching */
  function switchSteps(current, next) {
    current.animate(
      { opacity: 0, left: -400 },
      {
        duration: 200,
        easing: 'swing',
        complete: function() {
          current.hide();
          current.css({ opacity: 1, left: 0 });
          if (!next) {
            $form.children().remove();
            $form
              .append(
                `<fieldset class="step-screen"><h2>Thank you!</h2><p class="success">&#10004; Registration completed successfully</p></fieldset>`
              )
              .hide()
              .fadeIn();
          } else {
            next.fadeIn();
          }
        }
      }
    );
  }
});
