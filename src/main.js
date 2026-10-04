// Highlight the project currently in view and slide the numbers so the
// active one stays level with the top of the column.
(function () {
  var toc = document.querySelector('.toc');
  var links = Array.prototype.slice.call(toc.querySelectorAll('a'));
  var projects = links.map(function (link) {
    return document.getElementById(link.hash.slice(1));
  });

  function activate(index) {
    links.forEach(function (link, i) {
      link.classList.toggle('active', i === index);
    });
    var step = links[1] ? links[1].offsetTop - links[0].offsetTop : 0;
    toc.style.transform = 'translateY(' + (-index * step - 8) + 'px)';
  }

  // A project becomes active once its top crosses the middle of the screen.
  var observer = new IntersectionObserver(function () {
    var index = 0;
    projects.forEach(function (project, i) {
      if (project.getBoundingClientRect().top < window.innerHeight / 2) index = i;
    });
    activate(index);
  }, { rootMargin: '-50% 0px -50% 0px' });

  projects.forEach(function (project) { observer.observe(project); });
  activate(0);
})();
