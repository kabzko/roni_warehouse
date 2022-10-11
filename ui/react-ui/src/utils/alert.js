// https://getbootstrap.com/docs/5.2/components/alerts/#dismissing

const alert = (message, type, divId) => {
    const wrapper = document.createElement('div');
    const alertPlaceholder = document.getElementById(divId);

    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper);
}

export default alert;