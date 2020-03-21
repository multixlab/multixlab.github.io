const headingTags = 'h2[id], h3[id], h4[id]';

window.addEventListener('DOMContentLoaded', () => {

    generateToc();

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const tocEntry = document.querySelector(`div#toc a[href="#${id}"]`);

            if (tocEntry !== null) {
                if (entry.intersectionRatio > 0) {
                    tocEntry.classList.add('active');
                } else {
                    tocEntry.classList.remove('active');
                }
            }
        });
    });

    document.querySelectorAll(headingTags)
        .forEach((heading) => {
            observer.observe(heading);
        });

});

function generateToc() {
    generateTocInId("toc");
    generateTocInId("small-toc");
}


function generateTocInId(id) {
    const firstLevelCounter = {count: 1};
    const toc = document.getElementById(id);
    const headings = document.querySelectorAll(headingTags);
    toc.appendChild(createTocTitle());

    for (let heading of headings) {
        toc.appendChild(createTocEntryFromHeading(heading, firstLevelCounter));
    }
}

function createTocTitle() {
    const title = document.createElement("div");
    title.innerHTML = "Table of content";
    title.classList.add("title");
    return title;
}

function createTocEntryFromHeading(heading, counter) {

    const title = document.createElement("a");
    let depth = heading.tagName.toLocaleLowerCase();
    let prepend = "&bull;"; /* for h3 */

    if (depth === "h2") {
        const count = counter.count;
        prepend = count + ". ";
        counter.count = count + 1
    }

    if (depth === "h4") {
        prepend = "&#8227;";
    }

    title.innerHTML = prepend + " " + heading.innerHTML;
    title.href = '#' + heading.id;
    title.classList.add(depth);

    return title
}

