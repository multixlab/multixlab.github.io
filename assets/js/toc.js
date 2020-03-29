const headingTags = 'h2[id], h3[id], h4[id]';

window.addEventListener('DOMContentLoaded', () => {

    backToTop();

    const toc = document.getElementById("toc");

    if (toc != null) {
        generateToc();
    }

});

function generateToc() {
    generateTocInId("toc");
    generateTocInId("small-toc");
}

function generateTocInId(id) {
    const firstLevelCounter = {count: 1};
    const toc = document.getElementById(id);
    const headings = document.querySelectorAll(headingTags);

    if (headings.length === 0) {
        toc.classList.add("gone");
        return
    }

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

function backToTop() {

    const topButton = document.getElementById("top");

    window.onscroll = function () {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            topButton.style.display = "block";
        } else {
            topButton.style.display = "none";
        }
    };

}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

