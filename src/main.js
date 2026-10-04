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

// Videos play muted while at least half visible and pause when scrolled away.
// A video the visitor paused stays paused, and one that has finished (without
// looping) resets to its poster and waits until it is scrolled back into view.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  Array.prototype.forEach.call(document.querySelectorAll('.player'), function (player) {
    var video = player.querySelector('video');
    var mute = player.querySelector('.player-mute');
    var fullscreen = player.querySelector('.player-fullscreen');
    var bar = player.querySelector('.player-bar');
    var progress = player.querySelector('.player-progress');
    var pausedByVisitor = false;
    var finished = false;

    function sync() {
      player.classList.toggle('is-playing', !video.paused);
      player.classList.toggle('is-muted', video.muted);
      mute.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
    }

    function togglePlay() {
      if (video.paused) {
        pausedByVisitor = false;
        finished = false;
        video.play().catch(sync);
      } else {
        pausedByVisitor = true;
        video.pause();
      }
    }

    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('volumechange', sync);
    video.addEventListener('ended', function () {
      finished = true;
      video.load(); // back to the poster image
    });

    player.addEventListener('click', function (event) {
      if (!event.target.closest('button, .player-bar')) togglePlay();
    });
    player.querySelector('.player-play').addEventListener('click', togglePlay);
    mute.addEventListener('click', function () {
      video.muted = !video.muted;
    });

    if (fullscreen) {
      fullscreen.addEventListener('click', function () {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (player.requestFullscreen) {
          player.requestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen(); // iPhone
        }
      });
    }

    // Subtitles are drawn in our own overlay (the track stays "hidden") so they
    // look the same in every browser and sit above the buttons.
    var track = video.textTracks[0];
    var captions = player.querySelector('.player-captions');
    var ccButton = player.querySelector('.player-cc');
    if (track && captions) {
      var hideNativeCues = function () { track.mode = 'hidden'; };
      hideNativeCues();
      // Back at the poster after load(), so no subtitles until it plays again
      video.addEventListener('loadstart', function () {
        hideNativeCues();
        player.classList.remove('has-started');
      });
      video.addEventListener('playing', function () {
        player.classList.add('has-started');
      });
      track.addEventListener('cuechange', function () {
        var cues = track.activeCues || [];
        captions.textContent = Array.prototype.map.call(cues, function (cue) {
          return cue.text;
        }).join('\n');
      });
      ccButton.addEventListener('click', function () {
        var on = player.classList.toggle('captions-off') === false;
        ccButton.setAttribute('aria-pressed', String(on));
      });
    }

    if (bar) {
      video.addEventListener('timeupdate', function () {
        var percent = video.duration ? video.currentTime / video.duration * 100 : 0;
        progress.style.transform = 'scaleX(' + percent / 100 + ')';
        bar.setAttribute('aria-valuenow', Math.round(percent));
      });

      var seek = function (event) {
        var rect = bar.getBoundingClientRect();
        var ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
        if (video.duration) video.currentTime = ratio * video.duration;
      };
      bar.addEventListener('pointerdown', function (event) {
        seek(event);
        bar.addEventListener('pointermove', seek);
        bar.setPointerCapture(event.pointerId);
      });
      bar.addEventListener('pointerup', function () {
        bar.removeEventListener('pointermove', seek);
      });
      bar.addEventListener('keydown', function (event) {
        var step = { ArrowLeft: -5, ArrowRight: 5 }[event.key];
        if (step && video.duration) {
          video.currentTime = Math.min(Math.max(video.currentTime + step, 0), video.duration);
          event.preventDefault();
        }
      });
    }

    new IntersectionObserver(function (entries) {
      var entry = entries[0];
      if (entry.isIntersecting) {
        if (!pausedByVisitor && !finished && !reduceMotion) video.play().catch(sync);
      } else {
        finished = false;
        if (!video.paused) video.pause();
      }
    }, { threshold: 0.5 }).observe(video);
  });
})();
