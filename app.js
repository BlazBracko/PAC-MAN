
// univerzalni app.js file
document.addEventListener('DOMContentLoaded', function() {

    const greetingElement = document.getElementById('greeting');
    greetingElement.textContent = 'PACMAN';

    const buttonElements = document.querySelectorAll('.button');
    buttonElements.forEach(button => {
        button.addEventListener('click', function() {

            console.log('Button clicked:', button.textContent);
        });
    });
    
this.close
    function fetchData(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Data:', data);
            })
            .catch(error => {

                console.error('Error:', error);
            });
    }
});
