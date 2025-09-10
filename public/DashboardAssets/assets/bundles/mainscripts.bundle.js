function initSparkline() {
  $(".sparkline").each(function () {
    var e = $(this);
    e.sparkline("html", e.data());
  });
}

function skinChanger() {
  $(".choose-skin li").on("click", function () {
    var e = $("#wrapper"),
      t = $(this),
      n = $(".choose-skin li.active").data("theme");
    $(".choose-skin li").removeClass("active"),
      e.removeClass("theme-" + n),
      t.addClass("active"),
      e.addClass("theme-" + t.data("theme"));
  });
}

$(function () {
  "use strict";
  initSparkline();
  skinChanger();
  setTimeout(function () {
    $(".page-loader-wrapper").fadeOut();
  }, 5);
});

$(document).ready(function () {
  $(".sidebar").metisMenu();
  $(".btn-toggle-fullwidth").on("click", function () {
    $("body").hasClass("layout-fullwidth")
      ? $("body").removeClass("layout-fullwidth")
      : $("body").addClass("layout-fullwidth");
    $(this).find(".fa").toggleClass("fa-arrow-left fa-arrow-right");
  });
  
  $(".btn-toggle-offcanvas").on("click", function () {
    $("body").toggleClass("offcanvas-active");
  });
  
  $(".right_setting").on("click", function () {
    $(".setting_div").toggleClass("open");
  });
  
  $(".btn-toggle-offcanvas").on("click", function () {
    $(".sidebar").toggleClass("open");
  });
  
  $(".theme-rtl input").on("change", function () {
    this.checked
      ? $("body").addClass("rtl_mode")
      : $("body").removeClass("rtl_mode");
  });
  
  $("#main-content").on("click", function () {
    $("body").removeClass("offcanvas-active");
  });
  
  $(".right_icon_btn").on("click", function () {
    $("body").toggleClass("right_icon_toggle");
  });
  
  $(".dropdown").on("show.bs.dropdown", function () {
    $(this)
      .find(".dropdown-menu")
      .first()
      .stop(!0, !0)
      .animate({ top: "100%" }, 200);
  });
  
  $(".dropdown").on("hide.bs.dropdown", function () {
    $(this)
      .find(".dropdown-menu")
      .first()
      .stop(!0, !0)
      .animate({ top: "80%" }, 200);
  });
  
  $('.navbar-form.search-form input[type="text"]')
    .on("focus", function () {
      $(this).animate({ width: "+=50px" }, 300);
    })
    .on("focusout", function () {
      $(this).animate({ width: "-=50px" }, 300);
    });

  if ($('[data-toggle="tooltip"]').length > 0) {
    $('[data-toggle="tooltip"]').tooltip();
  }
  
  if ($('[data-toggle="popover"]').length > 0) {
    $('[data-toggle="popover"]').popover();
  }
  
  $(window).on("load", function () {
    if ($("#main-content").height() < $("#left-sidebar").height()) {
      $("#main-content").css(
        "min-height",
        $("#left-sidebar").innerHeight() - $("footer").innerHeight()
      );
    }
  });
  
  $(window).on("load resize", function () {
    if ($(window).innerWidth() < 1280) {
      $("body").addClass("layout-fullwidth sidebar_toggle");
    } else {
      $("body").removeClass("layout-fullwidth sidebar_toggle");
    }
  });
});

// Theme toggle logic with null check
var toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]'),
  toggleHcSwitch = document.querySelector('.theme-high-contrast input[type="checkbox"]'),
  currentTheme = localStorage.getItem("theme");

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    if (toggleHcSwitch) {
      toggleHcSwitch.checked = false;
    }
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
}

function switchHc(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "high-contrast");
    localStorage.setItem("theme", "high-contrast");
    if (toggleSwitch) {
      toggleSwitch.checked = false;
    }
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
}

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (currentTheme === "dark" && toggleSwitch) {
    toggleSwitch.checked = true;
  }
  if (currentTheme === "high-contrast" && toggleHcSwitch) {
    toggleHcSwitch.checked = true;
    if (toggleSwitch) {
      toggleSwitch.checked = false;
    }
  }
}

if (toggleSwitch) {
  toggleSwitch.addEventListener("change", switchTheme, false);
}

if (toggleHcSwitch) {
  toggleHcSwitch.addEventListener("change", switchHc, false);
}

// Additional functionality
$.fn.clickToggle = function (t, n) {
  return this.each(function () {
    var e = false;
    $(this).bind("click", function () {
      e = !e;
      return e ? t.apply(this, arguments) : n.apply(this, arguments);
    });
  });
};

$(".select-all").on("click", function () {
  var isChecked = this.checked;
  $(this)
    .parents("table")
    .find(".checkbox-tick")
    .each(function () {
      this.checked = isChecked;
    });
});

$(".checkbox-tick").on("click", function () {
  var allChecked = $(this).parents("table").find(".checkbox-tick").length ===
    $(this).parents("table").find(".checkbox-tick:checked").length;
  $(this).parents("table").find(".select-all").prop("checked", allChecked);
});

$(document).ready(function () {
  "use strict";
  $(".font_setting input:radio").click(function () {
    var e = $("[name='" + this.name + "']")
      .map(function () {
        return this.value;
      })
      .get()
      .join(" ");
    $("body").removeClass(e).addClass(this.value);
  });
});

// Tawk.to live chat script
var Tawk_API = Tawk_API || {},
  Tawk_LoadStart = new Date();
(function () {
  var e = document.createElement("script"),
    t = document.getElementsByTagName("script")[0];
  e.async = true;
  e.src = "https://embed.tawk.to/5c6d4867f324050cfe342c69/default";
  e.charset = "UTF-8";
  e.setAttribute("crossorigin", "*");
  t.parentNode.insertBefore(e, t);
})();
