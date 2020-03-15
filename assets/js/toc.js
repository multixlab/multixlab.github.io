window.addEventListener('DOMContentLoaded', () => {

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            console.log("observer called");
            if (entry.intersectionRatio > 0) {
                document.querySelector(`div.toc a[href="#${id}"]`).classList.add('active');
            } else {
                document.querySelector(`div.toc  a[href="#${id}"]`).classList.remove('active');
            }
        });
    });

    // Track all sections that have an `id` applied
    document.querySelectorAll('h2[id]').forEach((section) => {
        console.log(section)
        observer.observe(section);
    });

});