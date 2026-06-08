$(function () {
  const $window = $(window);
  const $navbar = $(".navbar");
  const $backToTop = $(".back-to-top");

  function updateChrome() {
    const isScrolled = $window.scrollTop() > 24;
    $navbar.toggleClass("scrolled", isScrolled);

    if ($window.scrollTop() > 500) {
      $backToTop.stop(true, true).fadeIn(160).css("display", "flex");
    } else {
      $backToTop.stop(true, true).fadeOut(160);
    }
  }

  updateChrome();
  $window.on("scroll", updateChrome);

  function scrollToSection(target) {
    $("html, body").stop(true).animate({ scrollTop: $(target).offset().top - 76 }, 650);
    $(".navbar-collapse").collapse("hide");
  }

  $("#mainNavbar a[href^='#'], .hero-section a[href^='#']").on("click", function (event) {
    const target = $(this).attr("href");
    if (target && target.startsWith("#") && $(target).length) {
      event.preventDefault();
      scrollToSection(target);
    }
  });

  $(".filter-btn").on("click", function () {
    const filter = $(this).data("filter");
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    $(".portfolio-item").each(function () {
      const matches = filter === "all" || $(this).data("category") === filter;
      $(this).stop(true, true)[matches ? "fadeIn" : "fadeOut"](180);
    });
  });

  $backToTop.on("click", function () {
    scrollToSection("#home");
  });

  $("#portfolioPreviewModal").on("show.bs.modal", function (event) {
    const $trigger = $(event.relatedTarget);
    const src = $trigger.data("preview-src");
    const title = $trigger.data("preview-title") || "Preview Portfolio";

    $("#portfolioPreviewTitle").text(title);
    $("#portfolioPreviewImage").attr({
      src,
      alt: `Preview ${title}`
    });
  });

  $("#contactForm").on("submit", function (event) {
    event.preventDefault();
    const name = $("#name").val().trim() || "teman";
    const email = $("#email").val().trim();
    const project = $("#project").val() || "project";
    const detail = $("#message").val().trim();
    const message = encodeURIComponent(
      `Halo BBC-Zone, saya ${name}.\n` +
      `Email: ${email}\n` +
      `Kebutuhan: ${project}\n\n` +
      detail
    );

    window.location.href = `https://wa.me/628111574745?text=${message}`;
  });
});
