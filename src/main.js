// Highlight the project currently in view and slide the numbers so the
// active one stays level with that project's heading.
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

  // A project is active once its top reaches the top of the window, which is
  // when its heading lines up with the highlighted number. At the very bottom
  // of the page the last project wins, even if it's too short to get there.
  function update() {
    var index = 0;
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) {
      index = projects.length - 1;
    } else {
      projects.forEach(function (project, i) {
        if (project.getBoundingClientRect().top <= 10) index = i;
      });
    }
    activate(index);
  }

  var pending = false;
  function onScroll() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      update();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
