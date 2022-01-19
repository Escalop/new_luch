$(".root a").click(function () {
  if (1) {
    var t = $(this);
    void 0 !== t.attr("href") &&
      void 0 === t.attr("target") &&
      "" !== t.attr("href") &&
      (t.hasClass("no_fade") ||
        t.hasClass("popup_trigger") ||
        t.attr("href").indexOf("mailto:") > -1 ||
        (!t.hasClass("force_fade") &&
          (t.attr("href").indexOf("#") > -1 || t.hasClass("no_fade"))) ||
        $(".root").removeClass("doc-ready"));
  }
});

$(document).ready(function (e) {
  var selectorDatePicker = $(".js-date_picker");
//  selectorDatePicker.preventDefault()
  if (selectorDatePicker.length) {
    datepicker(".js-date_picker", {
      customDays: [" Пн ", " Вт ", " Ср ", " Чт ", " Пт ", " Сб ", " Вс "],
      customMonths: [
        " Январь ",
        " Февраль ",
        " Март ",
        " Апрель ",
        " Май ",
        " Июнь ",
        " Июль ",
        " Август ",
        " Сентябрь ",
        " Октябрь ",
        " Ноябрь ",
        " Декабрь ",
      ],
      dateFormat: "DD.MM.YYYY",
      minDate: new Date(2004, 1, 1),
      maxDate: new Date(2020, 1, 1),
      dateSelected: new Date(2014, 1, 1),
      formatter: (input, date, instance) => {
        input.value = moment(date).format("DD.MM.YYYY");
      },
    });
  }

  $(".scene").parallax();

  $(".root").addClass("doc-ready");

  $(".radio, .checkbox, .number, .form-file").styler();

  $(".select").select2();

  $(".modal").on("shown.bs.modal", function (e) {
    $(".modal-scroll").scrollTop(0);
  });

  $(".js-filterReset").click(function (e) {
    $(".select").select2({
      allowClear: true,
    });
  });

  $(".js-showPass").click(function (e) {
    var target = e.currentTarget;
    $(target).hasClass("show")
      ? hidePassword($(target))
      : showPassword($(target));
  });
  function hidePassword(e) {
    e.removeClass("show").addClass("hide");
    e.prev("input").attr("type", "password");
  }
  function showPassword(e) {
    e.removeClass("hide").addClass("show");
    e.prev("input").attr("type", "text");
  }

  $(".js-Up").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
    return false;
  });

  $(".js-catalogBuy").click(function (e) {
    e.preventDefault();
    $(this).hide();
    $(this).parents(".buys").find(".quants").show();
  });

  $(".inputlabel").each(function () {
    var $inp = $(this).find("input:text"),
      $cle = $(this).find(".js-inputClear");
    $inp.on("input", function () {
      $cle.toggle(!!this.value);
    });
    $cle.on("touchstart click", function (e) {
      e.preventDefault();
      $inp.val("").trigger("input");
    });
  });

  $(".inputlabel__label").click(function () {
    $(this).next("input").focus();
  });

  $(window).scroll(function () {
    var sticky = $(".js-Up"),
      scroll = $(window).scrollTop();

    if (scroll >= 1000) sticky.addClass("fixed");
    else sticky.removeClass("fixed");
  });

  $(".js-showMenu").click(function (e) {
    $("body").toggleClass("header--menushowed");
  });
  $(document).click(function (e) {
    if ($(e.target).closest(".js-showMenu, .header").length === 0) {
      $("body").removeClass("header--menushowed");
    }
  });

  $(".js-Up").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
    return false;
  });

  if ($(".gallery-weeks__btn").length > 0) {
    getWeeklyWinners($(".gallery-weeks__btn").first().data("pk"));
  }

  try {
    submitGalleryForm(1);
  } catch (e) {
    // console.log('SubmitGalleryErr', e);
  }

  try {
    submitOldWinnersForm(1);
  } catch (e) {
    // console.log('SubmitOldWinnersErr', e);
  }

  if (window.location.href.indexOf("#passReset") != -1) {
    $("#modal-pass-change").modal("show");
  }

  if (window.location.href.indexOf("#login") != -1) {
    $("#modal-log").modal("show");
  }

  if (window.location.href.indexOf("#verifySucess") != -1) {
    $("#modal-verify-profile").modal("show");
  }

//  var phoneMask = IMask(document.querySelector("input[name='phone']"), {
//    mask: "+{7}(900)000-00-00",
//  });

  var goodKey = '0123456789+';

  var phoneValidate = function(e) {
      var filtered = this.value.split('').filter(filterInput);
      this.value = filtered.join("");
  }

  var filterInput = function(val) {
    return (goodKey.indexOf(val) > -1);
  }

  var phoneInput = document.querySelector("input[name='phone']");
  phoneInput.addEventListener('input', phoneValidate);

  var emailMask = IMask(document.querySelector("input[name='email']"), {
    mask: /^\S*@?\S*$/,
  });

  // weeklyRatingList();
});


function pagiUserModalClick(page) {
  let loading = $("#modal-user").attr("loading");
  if (loading == 'true') {
    return
  }
  $("#modal-user").attr("loading", true);
  let pk = $("#modal-user").attr("user-pk");
  // let page = $(event.target).data("page");
  $(".user-detail-item:not(#detail-work-placeholder)").remove();
  $("#modal-user .gallery-items").append(`<div class="loader"></div>`);
  showUserDetail(page, pk);
  $("#modal-user").animate(
    {
      scrollTop: $("#modal-user").offset().top,
    },
    800
  );
}

function showRatingList(rating_type) {
  let url = `/api/v1/${rating_type}`;
  fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
  })
    .then((data) => {
      status = data.status;
      if (data.ok) {
        return data.json();
      }
    })
    .then((data) => {
      if (status == 403) {
        $("#rating-list").attr("style", "display: none;");
        $("#rating-not-auth").removeAttr("style");
      } else {
        let table = $("#modal-rating").find(".ratings-table").first();

        let save = $("#rating-item-placeholder").detach();

        $.when(table.fadeTo("fast", 0))
          .then(function () {
            table.empty().append(save);
            table.append(
              "<tr> <th>Место</th> <th>Имя участника</th> <th>Баллы</th> </tr>"
            );
            data.forEach((item, ind) => {
              let tr_item = $("#rating-item-placeholder").clone();
              tr_item.removeAttr("style");
              tr_item
                .find(".ratings-num")
                .first()
                .text(`${ind + 1}`);
              tr_item
                .find(".ratings-name")
                .first()
                .text(`${item["full_name"]}`);
              tr_item.find(".ratings-name").first().attr("data-pk", item["pk"]);
              tr_item.find(".ratings-points").first().text(`${item["points"]}`);

              table.append(tr_item);
            });
          })
          .then(function () {
            table.fadeTo("fast", 1);
          });
      }
    })
    .catch((error) => {
      // console.log(error)
    });
}

$("#modal-rating").on("show.bs.modal", function (e) {
  // weeklyRatingList();
  let active_tab = $("ul.nav a.btabs__link.active");
  let id = active_tab.attr("id");
  showRatingList(id);
});

$('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
  let active_tab = $("ul.nav a.btabs__link.active");
  let id = active_tab.attr("id");
  if (id == "total_rating_list") {
    $("#rating-list .rulz-item__text").fadeIn();
  } else {
    $("#rating-list .rulz-item__text").fadeOut();
  }
  showRatingList(active_tab.attr("id"));
});

$("body").on("click", ".like-toggle", likeToggleListener);

$("body").on("click", "#search-button", function (e) {
  e.preventDefault();
  if ($("#rating-sort").is(":checked")) {
    $("#rating-sort").prop("checked", false);
    // $(this).addClass("btn--border");
    $("#date-sort").prop("checked", false);
  } else {
    $("#rating-sort").prop("checked", true);
    // $(this).removeClass("btn--border");
    $("#date-sort").prop("checked", false);
  }
  submitGalleryForm(1);
});

$("#gallery-sort-form").submit(function (e) {
  e.preventDefault();
  submitGalleryForm(1);
});




$("body").on("click", ".user-detail", function () {
  const pk = $(this).data("pk");
  showUserDetail(1, pk);
});


function showPagination(paginator_id, data, onclickCallback) {
  console.log("show pagination");

  $(paginator_id).empty();

  let offset = 2;

  if (data["previous"]) {
    let prevPages =
      data["current"] - offset > 0 ? data["current"] - offset : 1;
    let i;
    for (i = prevPages; i < data["current"]; i++) {
      $(paginator_id).append(
        `<a class="pagi-link" onclick="${onclickCallback}(${i})" data-page="${i}">${i}</a>`
      );
    }
    // $(paginator_id).append(
    //   `<a class="pagi-link" onclick="${onclickCallback}(${i})" data-page="${i}">${i}</a>`
    // );
    // $(paginator_id).append(
    //   `<a class="pagi-link">...</a>`
    // );
  }

  if (data["lastPage"] != 1) {
    $(paginator_id).append(
      `<a class="pagi-link pagi-link--active" data-page="${data["current"]}">${data["current"]}</a>`
    );
  }

  if (data["next"]) {
    let nextPages =
      data["current"] + offset <= data["lastPage"]
        ? data["current"] + offset
        : data["lastPage"];
    let i;
    for (i = data["current"] + 1; i <= nextPages; i++) {
      $(paginator_id).append(
        `<a class="pagi-link" onclick="${onclickCallback}(${i})" data-page="${i}">${i}</a>`
      );
    }
  }
}

function showUserDetail(page, pk) {
  const getUserData = async function(pk) {
    const url = "/api/v1/user/" + pk;

    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
      });
    return await response.json();
  };

  const getUserWorks = async function(pk) {
    const url = `/api/v1/participant_images/?page=${page}&user_pk=${pk}`;
    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
      });
    return await response.json();
  };

  getUserData(pk).then((data) => {
      $("#modal-user .mprod-name").text(`${data["full_name"]}`);
      $("#modal-user .mprod-age").text(
        `Возраст: ${data["age"]} ${ageRepresent(data["age"])}`
      );
    })
  .then(()=>{return getUserWorks(pk)})
  .then((data) => {
      let content = $(".user-detail-items > div:not(.loader):not(#detail-work-placeholder)");
      content.fadeTo("fast", 0);

      let save = $("#detail-work-placeholder").detach();
      $("#modal-user .gallery-items").empty().append(save);
      $("#modal-user").attr("user-pk", pk)

      showPagination("#paginator-user-modal", data, "pagiUserModalClick");

      if (data["results"].length === 0) {
        $(".user-detail-items").append(`<div class="user-detail-not-found"><h4>Работ не найдено</h4></div>`); 
      }

      data["results"].forEach((item, ind) => {
        let div_item = save.clone();
        div_item.removeAttr("style");

        div_item.attr("id", "");
        div_item.find("a").first().attr("data-fancybox", "gallery");
        // div.attr("data-fancybox", "gallery2")

        let a_item = $(div_item).find("a.gallery-item__imgwrap").first();
        
        a_item.attr(
          "data-caption",
          `${item['_user']["full_name"]} <br> ${item['_user']["age"]} ${ageRepresent(
            item['_user']["age"]
          )}`
        );

        $(div_item)
          .find(".gallery-item__img")
          .first()
          .css("background-image", `url("${item["preview"]}")`);

        $(div_item)
          .find("a.gallery-item__imgwrap")
          .first()
          .attr("href", item["file"]);
        $(div_item).find(".gallery-item__name").first().text(data["full_name"]);
        $(div_item)
          .find(".gallery-item__age")
          .first()
          .text(`Возраст: ${data["age"]} ${ageRepresent(data["age"])}`);

        a_item = $(div_item).find(".gallery-item__like").first();
        a_item.attr("data-pk", item["pk"]);
        a_item.text(item["calculated_likes_count"]);

        item["liked"] ? a_item.addClass("gallery-item__like--active") : {};

        $("#modal-user .gallery-items").append(div_item);
        // $("#modal-user").modal("show");        
      });
      content.fadeTo("fast", 1);
      $("#modal-user").removeAttr("loading");

  });
}


function submitGalleryForm(page) {
  let loading = $("#gallery-sort-form").attr("loading");
  if (loading == 'true') {
    return
  }
  $("#gallery-sort-form").attr("loading", true);
  
  let sort_form = document.getElementById("gallery-sort-form");
  let formData = new FormData(sort_form);
  let date = $("#date-sort").attr('value');
  let rating = $("#rating-sort").attr('value');
  let search = formData.get("search");
  let url = new URL("/api/v1/participant_images/", window.location.origin);

  let params = {
    //        sort: sort,
    page: page,
    date_sort: date,
    rate_sort: rating,
    q: search,
  };

  let esc = encodeURIComponent;
  let query = Object.keys(params)
    .map((k) => esc(k) + "=" + esc(params[k]))
    .join("&");

  url.search = new URLSearchParams(params).toString();

  fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
  })
    .then((data) => {
      status = data.status;
      if (data.ok) {
        return data.json();
      }
    })
    .then((data) => {
      let content = $("#gallery-all");
      $.when(content.fadeTo("fast", 0))
        .then(function () {
          content.empty();

//          console.log(data["results"].length);

          if (data["results"].length == 0) {
            content.append(
              `<div align="center">По вашему запросу ничего не найдено</div>`
            );
          }

          data["results"].forEach((item) => {
            let div = $("#gallery-item-placeholder").clone();
            div.removeAttr("style");
            div.attr("id", "");
            div.find("a").first().attr("data-fancybox", "gallery2");
            // div.attr("data-fancybox", "gallery2")

            let a_item = $(div).find("a.gallery-item__imgwrap").first();
            a_item.attr(
              "data-caption",
              `${item["_user"]["full_name"]} <br> ${
                item["_user"]["age"]
              } ${ageRepresent(item["_user"]["age"])}`
            );
            // a_item.attr("data-fancybox", "gallery2");

            $(div)
              .find(".gallery-item__img")
              .first()
              .css("background-image", `url("${item["preview"]}")`);

            $(div)
              .find("a.gallery-item__imgwrap")
              .first()
              .attr("href", item["file"]);
            $(div)
              .find(".gallery-item__name")
              .first()
              .text(item["_user"]["full_name"]);
            $(div)
              .find(".gallery-item__name")
              .first()
              .attr("data-pk", item["_user"]["pk"]);
            $(div)
              .find(".gallery-item__age")
              .first()
              .text(
                `Возраст: ${item["_user"]["age"]} ${ageRepresent(
                  item["_user"]["age"]
                )}`
              );
            $(div)
              .find(".gallery-item__age")
              .last()
              .text(`Загружено: ${item["created_at"]}`);

            a_item = $(div).find(".gallery-item__like").first();
            a_item.attr("data-pk", item["pk"]);
            a_item.text(item["calculated_likes_count"]);

            item["liked"] ? a_item.addClass("gallery-item__like--active") : {};

            content.append(div);
          });
        })
        .then(function () {
          // $(content).fadeIn("fast");
          content.fadeTo("fast", 1);

          $("#paginator")
            .find("a")
            .bind("click", (event) => {
              let page = $(event.target).data("page");
              submitGalleryForm(page);
              $("body,html").animate(
                {
                  scrollTop: $("#all-works").offset().top,
                },
                800
              );
            });
        });

      $("#paginator").empty();

      let offset = 2;

      if (data["previous"]) {
        // $("#paginator").append(`<a class="pagi-link pagi-prev" data-page="${data['current'] - 1}">`);
        let prevPages =
          data["current"] - offset > 0 ? data["current"] - offset : 1;
        let i;
        for (i = prevPages; i < data["current"]; i++) {
          $("#paginator").append(
            `<a class="pagi-link" data-page="${i}">${i}</a>`
          );
        }
      }

      if (data["lastPage"] != 1) {
        $("#paginator").append(
          `<a class="pagi-link pagi-link--active" data-page="${data["current"]}">${data["current"]}</a>`
        );
      }

      if (data["next"]) {
        let nextPages =
          data["current"] + offset <= data["lastPage"]
            ? data["current"] + offset
            : data["lastPage"];
        let i;
        for (i = data["current"] + 1; i <= nextPages; i++) {
          $("#paginator").append(
            `<a class="pagi-link" data-page="${i}">${i}</a>`
          );
        }
        // $("#paginator").append(`<a class="pagi-link pagi-next" data-page="${data['current'] + 1}">`);
      }
      $("#gallery-sort-form").removeAttr("loading");
    })
    .catch((error) => {
      // console.log(error)
    });
}

function submitOldWinnersForm(page) {
  let form = document.getElementById("old-winners-form");

  let formData = new FormData(form);

  let url = new URL("/api/v1/old_winners/", window.location.origin);

  let params = { page: page };

  url.search = new URLSearchParams(params).toString();

  fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
  })
    .then((data) => {
      status = data.status;
      if (data.ok) {
        return data.json();
      }
    })
    .then((data) => {
      let content = $("#old-winners-all");
      $.when($(content).fadeTo("fast", 0))
        .then(function () {
          content.empty();
          data["results"].forEach((item) => {
            let div = $("#old-winner-item-placeholder").clone();
            div.removeAttr("style");
            div.attr("id", "");
            div.find("a").first().attr("data-fancybox", "gallery3");

            // div.attr("data-fancybox", "gallery2")

            let a_item = $(div).find("a.gallery-item__imgwrap").first();
            
            a_item.attr(
              "data-caption",
              `${item["_user"]["full_name"]} <br> Возраст: ${
                item["_user"]["age"]
              } ${ageRepresent(item["_user"]["age"])}`
            );
            // a_item.attr("data-fancybox", "gallery2");

            $(div)
              .find(".gallery-item__img")
              .first()
              .css("background-image", `url("${item["preview"]}")`);

            src = "../../static/images/sprize3.png";

            let prize_num = 3 - Math.trunc(item["win_place"] / 2);

            prize_num = prize_num == 0 ? 1 : prize_num;
            prize_num = prize_num == 1 ? 2 : prize_num;

            $(div)
              .find(".gallery-item__prize")
              .first()
              .attr("src", `../../static/images/sprize${prize_num}.png`);

            $(div)
              .find("a.gallery-item__imgwrap")
              .first()
              .attr("href", item["file"]);

            $(div)
              .find(".gallery-item__name")
              .first()
              .text(item["_user"]["full_name"]);

            $(div)
              .find(".gallery-item__age")
              .first()
              .text(
                `Возраст: ${item["_user"]["age"]} ${ageRepresent(
                  item["_user"]["age"]
                )}`
              );

            // $(div).find(".gallery-item__age").last().text(`Загружено: ${item['created_at']}`);

            a_item = $(div).find(".gallery-item__like").first();
            a_item.attr("data-pk", item["pk"]);
            a_item.text(item["calculated_likes_count"]);

            // item['liked'] ? a_item.addClass("gallery-item__like--active") : {};

            content.append(div);

            $("[data-fancybox]").fancybox({
              lang: "ru",
              i18n: {
                ru: {
                  CLOSE: "Закрыть",
                  NEXT: "Далее",
                  PREV: "Назад",
                  ERROR: "Ошибка загрузки. <br/> Попробуйте снова.",
                  PLAY_START: "Запустить слайдшоу",
                  PLAY_STOP: "Пауза",
                  FULL_SCREEN: "На весь экран",
                  THUMBS: "Превью",
                  DOWNLOAD: "Скачать",
                  SHARE: "Поделиться",
                  ZOOM: "Увеличить",
                },
              },
            });
          });
        })
        .then(function () {
          $(content).fadeTo("fast", 1);
          // $("a.like-toggle").bind("click", likeToggleListener);

          $("#old-winners-paginator")
            .find("a")
            .bind("click", (event) => {
              let page = $(event.target).data("page");
              submitOldWinnersForm(page);
              //   $("body,html").animate(
              //     {
              //       scrollTop: $("#old-winners").offset().top,
              //     },
              //     800
              //   );
            });
        });
      //
      $("#old-winners-paginator").empty();

      let offset = 2;

      if (data["previous"]) {
        // $("#old-winners-paginator").append(`<a class="pagi-link pagi-prev" data-page="${data['current'] - 1}">`);
        let prevPages =
          data["current"] - offset > 0 ? data["current"] - offset : 1;
        let i;
        for (i = prevPages; i < data["current"]; i++) {
          $("#old-winners-paginator").append(
            `<a class="pagi-link" data-page="${i}">${i}</a>`
          );
        }
      }

      if (data["lastPage"] != 1) {
        $("#old-winners-paginator").append(
          `<a class="pagi-link pagi-link--active" data-page="${data["current"]}">${data["current"]}</a>`
        );
      }

      if (data["next"]) {
        let nextPages =
          data["current"] + offset <= data["lastPage"]
            ? data["current"] + offset
            : data["lastPage"];
        let i;
        for (i = data["current"] + 1; i <= nextPages; i++) {
          $("#old-winners-paginator").append(
            `<a class="pagi-link" data-page="${i}">${i}</a>`
          );
        }
        // $("#old-winners-paginator").append(`<a class="pagi-link pagi-next" data-page="${data['current'] + 1}">`);
      }
    })
    .catch((error) => {
      // console.log(error)
    });
}

function likeToggleListener() {
  let pk = $(this).data("pk");
  let url = "/api/v1/participant_image/" + pk + "/like/";

  if ($(this).hasClass("gallery-item__like--active")) {
    $(this).removeClass("gallery-item__like--active");
  } else {
    $(this).addClass("gallery-item__like--active");
  }

  fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      status = data.status;
      return data.json();
    })
    .then((data) => {
      if (data["liked"] == true) {
        $(this).addClass("gallery-item__like--active");
        $(this).text(data["count"]);
      } else {
        $(this).removeClass("gallery-item__like--active");
        $(this).text(data["count"]);
      }
    })
    .catch((error) => {
      // console.log(error)
    });
}

$("#label-date").click(function () {
  if ($("#date-sort").is(":checked")) {
    $("#date-sort").prop("checked", false);
    $(this).removeClass("desc");
    $(this).addClass("asc");
    $("#date-sort").attr('value', "desc");
    //        $("#rating-sort").prop("checked", false);
    //        $("#label-rating").addClass("btn--border");
  } else {
    $("#date-sort").prop("checked", true);
    $(this).removeClass("asc");
    $(this).addClass("desc");
    $("#date-sort").attr('value', "asc");
    //        $("#rating-sort").prop("checked", false);
    //        $("#label-rating").addClass("btn--border");
  }
  submitGalleryForm(1);
});

$("#label-rating").click(function () {
  if ($("#rating-sort").is(":checked")) {
    $("#rating-sort").prop("checked", false);
    //        $(this).addClass("btn--border");
    $(this).removeClass("desc");
    $(this).addClass("asc");
    $("#rating-sort").attr('value', "desc");
    //        $("#date-sort").prop("checked", false);
  } else {
    $("#rating-sort").prop("checked", true);
    //        $(this).removeClass("btn--border");
    $(this).removeClass("asc");
    $(this).addClass("desc");
    $("#rating-sort").attr('value', "asc");

    //        $("#date-sort").prop("checked", false);
  }
  submitGalleryForm(1);
});

/* jQuery Form Styler v1.7.8 | (c) Dimox | https://github.com/Dimox/jQueryFormStyler */
!(function (e) {
  "function" == typeof define && define.amd
    ? define(["jquery"], e)
    : "object" == typeof exports
    ? (module.exports = e($ || require("jquery")))
    : e(jQuery);
})(function (e) {
  "use strict";

  function t(t, s) {
    (this.element = t), (this.options = e.extend({}, l, s));
    var i = this.options.locale;
    void 0 !== this.options.locales[i] &&
      e.extend(this.options, this.options.locales[i]),
      this.init();
  }

  function s(t) {
    if (
      !e(t.target).parents().hasClass("jq-selectbox") &&
      "OPTION" != t.target.nodeName &&
      e("div.jq-selectbox.opened").length
    ) {
      var s = e("div.jq-selectbox.opened"),
        l = e("div.jq-selectbox__search input", s),
        o = e("div.jq-selectbox__dropdown", s),
        a = s.find("select").data("_" + i).options;
      a.onSelectClosed.call(s),
        l.length && l.val("").keyup(),
        o.hide().find("li.sel").addClass("selected"),
        s.removeClass("focused opened dropup dropdowns");
    }
  }

  var i = "styler",
    l = {
      idSuffix: "-styler",
      filePlaceholder: "Прикрепить файлы",
      fileBrowse: "Выбрать файл",
      fileNumber: "Выбрано файлов: %s",
      selectPlaceholder: "Выберите...",
      selectSearch: !1,
      selectSearchLimit: 10,
      selectSearchNotFound: "Совпадений не найдено",
      selectSearchPlaceholder: "Поиск...",
      selectVisibleOptions: 0,
      singleSelectzIndex: "100",
      selectSmartPositioning: !0,
      locale: "ru",
      locales: {
        en: {
          filePlaceholder: "No file selected",
          fileBrowse: "Browse...",
          fileNumber: "Selected files: %s",
          selectPlaceholder: "Select...",
          selectSearchNotFound: "No matches found",
          selectSearchPlaceholder: "Search...",
        },
      },
      onSelectOpened: function () {},
      onSelectClosed: function () {},
      onFormStyled: function () {},
    };
  (t.prototype = {
    init: function () {
      function t() {
        void 0 !== i.attr("id") &&
          "" !== i.attr("id") &&
          (this.id = i.attr("id") + l.idSuffix),
          (this.title = i.attr("title")),
          (this.classes = i.attr("class")),
          (this.data = i.data());
      }

      var i = e(this.element),
        l = this.options,
        o = !(
          !navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ||
          navigator.userAgent.match(/(Windows\sPhone)/i)
        ),
        a = !(
          !navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/(Windows\sPhone)/i)
        );
      if (i.is(":checkbox")) {
        var d = function () {
          var s = new t(),
            l = e(
              '<div class="jq-checkbox"><div class="jq-checkbox__div"></div></div>'
            )
              .attr({
                id: s.id,
                title: s.title,
              })
              .addClass(s.classes)
              .data(s.data);
          i
            .css({
              position: "absolute",
              zIndex: "-1",
              opacity: 0,
              margin: 0,
              padding: 0,
            })
            .after(l)
            .prependTo(l),
            l.attr("unselectable", "on").css({
              "-webkit-user-select": "none",
              "-moz-user-select": "none",
              "-ms-user-select": "none",
              "-o-user-select": "none",
              "user-select": "none",
              display: "inline-block",
              position: "relative",
              overflow: "hidden",
            }),
            i.is(":checked") && l.addClass("checked"),
            i.is(":disabled") && l.addClass("disabled"),
            l.click(function (e) {
              e.preventDefault(),
                l.is(".disabled") ||
                  (i.is(":checked")
                    ? (i.prop("checked", !1), l.removeClass("checked"))
                    : (i.prop("checked", !0), l.addClass("checked")),
                  i.focus().change());
            }),
            i
              .closest("label")
              .add('label[for="' + i.attr("id") + '"]')
              .on("click.styler", function (t) {
                e(t.target).is("a") ||
                  e(t.target).closest(l).length ||
                  (l.triggerHandler("click"), t.preventDefault());
              }),
            i
              .on("change.styler", function () {
                i.is(":checked")
                  ? l.addClass("checked")
                  : l.removeClass("checked");
              })
              .on("keydown.styler", function (e) {
                32 == e.which && l.click();
              })
              .on("focus.styler", function () {
                l.is(".disabled") || l.addClass("focused");
              })
              .on("blur.styler", function () {
                l.removeClass("focused");
              });
        };
        d(),
          i.on("refresh", function () {
            i
              .closest("label")
              .add('label[for="' + i.attr("id") + '"]')
              .off(".styler"),
              i.off(".styler").parent().before(i).remove(),
              d();
          });
      } else if (i.is(":radio")) {
        var r = function () {
          var s = new t(),
            l = e(
              '<div class="jq-radio"><div class="jq-radio__div"></div></div>'
            )
              .attr({
                id: s.id,
                title: s.title,
              })
              .addClass(s.classes)
              .data(s.data);
          i
            .css({
              position: "absolute",
              zIndex: "-1",
              opacity: 0,
              margin: 0,
              padding: 0,
            })
            .after(l)
            .prependTo(l),
            l.attr("unselectable", "on").css({
              "-webkit-user-select": "none",
              "-moz-user-select": "none",
              "-ms-user-select": "none",
              "-o-user-select": "none",
              "user-select": "none",
              display: "inline-block",
              position: "relative",
            }),
            i.is(":checked") && l.addClass("checked"),
            i.is(":disabled") && l.addClass("disabled"),
            (e.fn.commonParents = function () {
              var t = this;
              return t
                .first()
                .parents()
                .filter(function () {
                  return e(this).find(t).length === t.length;
                });
            }),
            (e.fn.commonParent = function () {
              return e(this).commonParents().first();
            }),
            l.click(function (t) {
              if ((t.preventDefault(), !l.is(".disabled"))) {
                var s = e('input[name="' + i.attr("name") + '"]');
                s
                  .commonParent()
                  .find(s)
                  .prop("checked", !1)
                  .parent()
                  .removeClass("checked"),
                  i.prop("checked", !0).parent().addClass("checked"),
                  i.focus().change();
              }
            }),
            i
              .closest("label")
              .add('label[for="' + i.attr("id") + '"]')
              .on("click.styler", function (t) {
                e(t.target).is("a") ||
                  e(t.target).closest(l).length ||
                  (l.triggerHandler("click"), t.preventDefault());
              }),
            i
              .on("change.styler", function () {
                i.parent().addClass("checked");
              })
              .on("focus.styler", function () {
                l.is(".disabled") || l.addClass("focused");
              })
              .on("blur.styler", function () {
                l.removeClass("focused");
              });
        };
        r(),
          i.on("refresh", function () {
            i
              .closest("label")
              .add('label[for="' + i.attr("id") + '"]')
              .off(".styler"),
              i.off(".styler").parent().before(i).remove(),
              r();
          });
      } else if (i.is(":file")) {
        i.css({
          position: "absolute",
          top: 0,
          right: 0,
          margin: 0,
          padding: 0,
          opacity: 0,
          fontSize: "100px",
        });
        var n = function () {
          var s = new t(),
            o = i.data("placeholder");
          void 0 === o && (o = l.filePlaceholder);
          var a = i.data("browse");
          (void 0 !== a && "" !== a) || (a = l.fileBrowse);
          var d = e(
            '<div class="jq-file"><div class="jq-file__name">' +
              o +
              '</div><div class="jq-file__browse">' +
              a +
              "</div></div>"
          )
            .css({
              display: "inline-block",
              position: "relative",
              overflow: "hidden",
            })
            .attr({ id: s.id, title: s.title })
            .addClass(s.classes)
            .data(s.data);
          i.after(d).appendTo(d),
            i.is(":disabled") && d.addClass("disabled"),
            i
              .on("change.styler", function () {
                var t = i.val(),
                  s = e("div.jq-file__browse", d);
                if (i.is("[multiple]")) {
                  t = "";
                  var a = i[0].files.length;
                  if (a > 0) {
                    var r = i.data("number");
                    void 0 === r && (r = l.fileNumber),
                      (r = r.replace("%s", a)),
                      (t = r);
                  }
                }
                s.text(t.replace(/.+[\\\/]/, "")),
                  "" === t
                    ? (s.text(o), d.removeClass("changed"))
                    : d.addClass("changed");
              })
              .on("focus.styler", function () {
                d.addClass("focused");
              })
              .on("blur.styler", function () {
                d.removeClass("focused");
              })
              .on("click.styler", function () {
                d.removeClass("focused");
              });
        };
        n(),
          i.on("refresh", function () {
            i.off(".styler").parent().before(i).remove(), n();
          });
      } else if (i.is('input[type="number"]')) {
        var c = function () {
          var s = new t(),
            l = e(
              '<div class="jq-number"><div class="jq-number__spin minus"></div><div class="jq-number__spin plus"></div></div>'
            )
              .attr({
                id: s.id,
                title: s.title,
              })
              .addClass(s.classes)
              .data(s.data);
          i.after(l).prependTo(l).wrap('<div class="jq-number__field"></div>'),
            i.is(":disabled") && l.addClass("disabled");
          var o,
            a,
            d,
            r = null,
            n = null;
          void 0 !== i.attr("min") && (o = i.attr("min")),
            void 0 !== i.attr("max") && (a = i.attr("max")),
            (d =
              void 0 !== i.attr("step") && e.isNumeric(i.attr("step"))
                ? Number(i.attr("step"))
                : Number(1));
          var c = function (t) {
            var s,
              l = i.val();
            e.isNumeric(l) || ((l = 0), i.val("0")),
              t.is(".minus")
                ? (s = Number(l) - d)
                : t.is(".plus") && (s = Number(l) + d);
            var r = (d.toString().split(".")[1] || []).length;
            if (r > 0) {
              for (var n = "1"; n.length <= r; ) n += "0";
              s = Math.round(s * n) / n;
            }
            e.isNumeric(o) && e.isNumeric(a)
              ? s >= o && a >= s && i.val(s)
              : e.isNumeric(o) && !e.isNumeric(a)
              ? s >= o && i.val(s)
              : !e.isNumeric(o) && e.isNumeric(a)
              ? a >= s && i.val(s)
              : i.val(s);
          };
          l.is(".disabled") ||
            (l
              .on("mousedown", "div.jq-number__spin", function () {
                var t = e(this);
                c(t),
                  (r = setTimeout(function () {
                    n = setInterval(function () {
                      c(t);
                    }, 40);
                  }, 350));
              })
              .on("mouseup mouseout", "div.jq-number__spin", function () {
                clearTimeout(r), clearInterval(n);
              })
              .on("mouseup", "div.jq-number__spin", function () {
                i.change();
              }),
            i
              .on("focus.styler", function () {
                l.addClass("focused");
              })
              .on("blur.styler", function () {
                l.removeClass("focused");
              }));
        };
        c(),
          i.on("refresh", function () {
            i.off(".styler").closest(".jq-number").before(i).remove(), c();
          });
      } else if (i.is("select")) {
        var f = function () {
          function d(t) {
            t.off("mousewheel DOMMouseScroll").on(
              "mousewheel DOMMouseScroll",
              function (t) {
                var s = null;
                "mousewheel" == t.type
                  ? (s = -1 * t.originalEvent.wheelDelta)
                  : "DOMMouseScroll" == t.type &&
                    (s = 40 * t.originalEvent.detail),
                  s &&
                    (t.stopPropagation(),
                    t.preventDefault(),
                    e(this).scrollTop(s + e(this).scrollTop()));
              }
            );
          }

          function r() {
            for (var e = 0; e < f.length; e++) {
              var t = f.eq(e),
                s = "",
                i = "",
                o = "",
                a = "",
                d = "",
                r = "",
                n = "",
                c = "",
                u = "",
                p = "disabled",
                v = "selected sel disabled";
              t.prop("selected") && (i = "selected sel"),
                t.is(":disabled") && (i = p),
                t.is(":selected:disabled") && (i = v),
                void 0 !== t.attr("id") &&
                  "" !== t.attr("id") &&
                  (a = ' id="' + t.attr("id") + l.idSuffix + '"'),
                void 0 !== t.attr("title") &&
                  "" !== f.attr("title") &&
                  (d = ' title="' + t.attr("title") + '"'),
                void 0 !== t.attr("class") &&
                  ((n = " " + t.attr("class")),
                  (u = ' data-jqfs-class="' + t.attr("class") + '"'));
              var m = t.data();
              for (var g in m)
                "" !== m[g] && (r += " data-" + g + '="' + m[g] + '"');
              i + n !== "" && (o = ' class="' + i + n + '"'),
                (s = "<li" + u + r + o + d + a + ">" + t.html() + "</li>"),
                t.parent().is("optgroup") &&
                  (void 0 !== t.parent().attr("class") &&
                    (c = " " + t.parent().attr("class")),
                  (s =
                    "<li" +
                    u +
                    r +
                    ' class="' +
                    i +
                    n +
                    " option" +
                    c +
                    '"' +
                    d +
                    a +
                    ">" +
                    t.html() +
                    "</li>"),
                  t.is(":first-child") &&
                    (s =
                      '<li class="optgroup' +
                      c +
                      '">' +
                      t.parent().attr("label") +
                      "</li>" +
                      s)),
                (h += s);
            }
          }

          function n() {
            var a = new t(),
              n = "",
              c = i.data("placeholder"),
              u = i.data("search"),
              p = i.data("search-limit"),
              v = i.data("search-not-found"),
              m = i.data("search-placeholder"),
              g = i.data("z-index"),
              b = i.data("smart-positioning");
            void 0 === c && (c = l.selectPlaceholder),
              (void 0 !== u && "" !== u) || (u = l.selectSearch),
              (void 0 !== p && "" !== p) || (p = l.selectSearchLimit),
              (void 0 !== v && "" !== v) || (v = l.selectSearchNotFound),
              void 0 === m && (m = l.selectSearchPlaceholder),
              (void 0 !== g && "" !== g) || (g = l.singleSelectzIndex),
              (void 0 !== b && "" !== b) || (b = l.selectSmartPositioning);
            var y = e(
              '<div class="jq-selectbox jqselect"><div class="jq-selectbox__select" style="position: relative"><div class="jq-selectbox__select-text"></div><div class="jq-selectbox__trigger"><div class="jq-selectbox__trigger-arrow"></div></div></div></div>'
            )
              .css({
                display: "inline-block",
                position: "relative",
                zIndex: g,
              })
              .attr({ id: a.id, title: a.title })
              .addClass(a.classes)
              .data(a.data);
            i.css({ margin: 0, padding: 0 }).after(y).prependTo(y);
            var C = e("div.jq-selectbox__select", y),
              x = e("div.jq-selectbox__select-text", y),
              w = f.filter(":selected");
            r(),
              u &&
                (n =
                  '<div class="jq-selectbox__search"><input type="search" autocomplete="off" placeholder="' +
                  m +
                  '"></div><div class="jq-selectbox__not-found">' +
                  v +
                  "</div>");
            var q = e(
              '<div class="jq-selectbox__dropdown" style="position: absolute">' +
                n +
                '<ul style="position: relative; list-style: none; overflow: auto; overflow-x: hidden">' +
                h +
                "</ul></div>"
            );
            y.append(q);
            var _ = e("ul", q),
              j = e("li", q),
              k = e("input", q),
              S = e("div.jq-selectbox__not-found", q).hide();
            j.length < p && k.parent().hide(),
              "" === f.first().text() && f.first().is(":selected") && c !== !1
                ? x.text(c).addClass("placeholder")
                : x.text(w.text());
            var T = 0,
              N = 0;
            if (
              (j.css({ display: "inline-block" }),
              j.each(function () {
                var t = e(this);
                t.innerWidth() > T && ((T = t.innerWidth()), (N = t.width()));
              }),
              j.css({ display: "" }),
              x.is(".placeholder") && x.width() > T)
            )
              x.width(x.width());
            else {
              var P = y.clone().appendTo("body").width("auto"),
                A = P.outerWidth();
              P.remove(), A == y.outerWidth() && x.width(N);
            }
            T > y.width() && q.width(T),
              "" === f.first().text() &&
                "" !== i.data("placeholder") &&
                j.first().hide(),
              i.css({
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
              });
            var D = y.outerHeight(!0),
              H = k.parent().outerHeight(!0) || 0,
              I = _.css("max-height"),
              z = j.filter(".selected");
            if (
              (z.length < 1 && j.first().addClass("selected sel"),
              void 0 === j.data("li-height"))
            ) {
              var K = j.outerHeight();
              c !== !1 && (K = j.eq(1).outerHeight()), j.data("li-height", K);
            }
            var M = q.css("top");
            if (
              ("auto" == q.css("left") && q.css({ left: 0 }),
              "auto" == q.css("top") && (q.css({ top: D }), (M = D)),
              q.hide(),
              z.length &&
                (f.first().text() != w.text() && y.addClass("changed"),
                y.data("jqfs-class", z.data("jqfs-class")),
                y.addClass(z.data("jqfs-class"))),
              i.is(":disabled"))
            )
              return y.addClass("disabled"), !1;
            C.click(function () {
              if (
                (e("div.jq-selectbox").filter(".opened").length &&
                  l.onSelectClosed.call(
                    e("div.jq-selectbox").filter(".opened")
                  ),
                i.focus(),
                !o)
              ) {
                var t = e(window),
                  s = j.data("li-height"),
                  a = y.offset().top,
                  r = t.height() - D - (a - t.scrollTop()),
                  n = i.data("visible-options");
                (void 0 !== n && "" !== n) || (n = l.selectVisibleOptions);
                var c = 5 * s,
                  h = s * n;
                n > 0 && 6 > n && (c = h), 0 === n && (h = "auto");
                var u = function () {
                    q.height("auto").css({ bottom: "auto", top: M });
                    var e = function () {
                      _.css("max-height", Math.floor((r - 20 - H) / s) * s);
                    };
                    e(),
                      _.css("max-height", h),
                      "none" != I && _.css("max-height", I),
                      r < q.outerHeight() + 20 && e();
                  },
                  p = function () {
                    q.height("auto").css({ top: "auto", bottom: M });
                    var e = function () {
                      _.css(
                        "max-height",
                        Math.floor((a - t.scrollTop() - 20 - H) / s) * s
                      );
                    };
                    e(),
                      _.css("max-height", h),
                      "none" != I && _.css("max-height", I),
                      a - t.scrollTop() - 20 < q.outerHeight() + 20 && e();
                  };
                b === !0 || 1 === b
                  ? r > c + H + 20
                    ? (u(), y.removeClass("dropup").addClass("dropdowns"))
                    : (p(), y.removeClass("dropdowns").addClass("dropup"))
                  : b === !1 || 0 === b
                  ? r > c + H + 20 &&
                    (u(), y.removeClass("dropup").addClass("dropdowns"))
                  : (q.height("auto").css({
                      bottom: "auto",
                      top: M,
                    }),
                    _.css("max-height", h),
                    "none" != I && _.css("max-height", I)),
                  y.offset().left + q.outerWidth() > t.width() &&
                    q.css({
                      left: "auto",
                      right: 0,
                    }),
                  e("div.jqselect")
                    .css({ zIndex: g - 1 })
                    .removeClass("opened"),
                  y.css({ zIndex: g }),
                  q.is(":hidden")
                    ? (e("div.jq-selectbox__dropdown:visible").hide(),
                      q.show(),
                      y.addClass("opened focused"),
                      l.onSelectOpened.call(y))
                    : (q.hide(),
                      y.removeClass("opened dropup dropdowns"),
                      e("div.jq-selectbox").filter(".opened").length &&
                        l.onSelectClosed.call(y)),
                  k.length &&
                    (k.val("").keyup(),
                    S.hide(),
                    k.keyup(function () {
                      var t = e(this).val();
                      j.each(function () {
                        e(this)
                          .html()
                          .match(new RegExp(".*?" + t + ".*?", "i"))
                          ? e(this).show()
                          : e(this).hide();
                      }),
                        "" === f.first().text() &&
                          "" !== i.data("placeholder") &&
                          j.first().hide(),
                        j.filter(":visible").length < 1 ? S.show() : S.hide();
                    })),
                  j.filter(".selected").length &&
                    ("" === i.val()
                      ? _.scrollTop(0)
                      : ((_.innerHeight() / s) % 2 !== 0 && (s /= 2),
                        _.scrollTop(
                          _.scrollTop() +
                            j.filter(".selected").position().top -
                            _.innerHeight() / 2 +
                            s
                        ))),
                  d(_);
              }
            }),
              j.hover(function () {
                e(this).siblings().removeClass("selected");
              });
            var O = j.filter(".selected").text();
            j.filter(":not(.disabled):not(.optgroup)").click(function () {
              i.focus();
              var t = e(this),
                s = t.text();
              if (!t.is(".selected")) {
                var o = t.index();
                (o -= t.prevAll(".optgroup").length),
                  t
                    .addClass("selected sel")
                    .siblings()
                    .removeClass("selected sel"),
                  f.prop("selected", !1).eq(o).prop("selected", !0),
                  (O = s),
                  x.text(s),
                  y.data("jqfs-class") && y.removeClass(y.data("jqfs-class")),
                  y.data("jqfs-class", t.data("jqfs-class")),
                  y.addClass(t.data("jqfs-class")),
                  i.change();
              }
              q.hide(),
                y.removeClass("opened dropup dropdowns"),
                l.onSelectClosed.call(y);
            }),
              q.mouseout(function () {
                e("li.sel", q).addClass("selected");
              }),
              i
                .on("change.styler", function () {
                  x
                    .text(f.filter(":selected").text())
                    .removeClass("placeholder"),
                    j
                      .removeClass("selected sel")
                      .not(".optgroup")
                      .eq(i[0].selectedIndex)
                      .addClass("selected sel"),
                    f.first().text() != j.filter(".selected").text()
                      ? y.addClass("changed")
                      : y.removeClass("changed");
                })
                .on("focus.styler", function () {
                  y.addClass("focused"),
                    e("div.jqselect")
                      .not(".focused")
                      .removeClass("opened dropup dropdowns")
                      .find("div.jq-selectbox__dropdown")
                      .hide();
                })
                .on("blur.styler", function () {
                  y.removeClass("focused");
                })
                .on("keydown.styler keyup.styler", function (e) {
                  var t = j.data("li-height");
                  "" === i.val()
                    ? x.text(c).addClass("placeholder")
                    : x.text(f.filter(":selected").text()),
                    j
                      .removeClass("selected sel")
                      .not(".optgroup")
                      .eq(i[0].selectedIndex)
                      .addClass("selected sel"),
                    (38 != e.which &&
                      37 != e.which &&
                      33 != e.which &&
                      36 != e.which) ||
                      ("" === i.val()
                        ? _.scrollTop(0)
                        : _.scrollTop(
                            _.scrollTop() + j.filter(".selected").position().top
                          )),
                    (40 != e.which &&
                      39 != e.which &&
                      34 != e.which &&
                      35 != e.which) ||
                      _.scrollTop(
                        _.scrollTop() +
                          j.filter(".selected").position().top -
                          _.innerHeight() +
                          t
                      ),
                    13 == e.which &&
                      (e.preventDefault(),
                      q.hide(),
                      y.removeClass("opened dropup dropdowns"),
                      l.onSelectClosed.call(y));
                })
                .on("keydown.styler", function (e) {
                  32 == e.which && (e.preventDefault(), C.click());
                }),
              s.registered || (e(document).on("click", s), (s.registered = !0));
          }

          function c() {
            var s = new t(),
              l = e('<div class="jq-select-multiple jqselect"></div>')
                .css({
                  display: "inline-block",
                  position: "relative",
                })
                .attr({ id: s.id, title: s.title })
                .addClass(s.classes)
                .data(s.data);
            i.css({ margin: 0, padding: 0 }).after(l),
              r(),
              l.append("<ul>" + h + "</ul>");
            var o = e("ul", l).css({
                position: "relative",
                "overflow-x": "hidden",
                "-webkit-overflow-scrolling": "touch",
              }),
              a = e("li", l).attr("unselectable", "on"),
              n = i.attr("size"),
              c = o.outerHeight(),
              u = a.outerHeight();
            void 0 !== n && n > 0
              ? o.css({ height: u * n })
              : o.css({ height: 4 * u }),
              c > l.height() &&
                (o.css("overflowY", "scroll"),
                d(o),
                a.filter(".selected").length &&
                  o.scrollTop(
                    o.scrollTop() + a.filter(".selected").position().top
                  )),
              i.prependTo(l).css({
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
              }),
              i.is(":disabled")
                ? (l.addClass("disabled"),
                  f.each(function () {
                    e(this).is(":selected") &&
                      a.eq(e(this).index()).addClass("selected");
                  }))
                : (a
                    .filter(":not(.disabled):not(.optgroup)")
                    .click(function (t) {
                      i.focus();
                      var s = e(this);
                      if (
                        (t.ctrlKey || t.metaKey || s.addClass("selected"),
                        t.shiftKey || s.addClass("first"),
                        t.ctrlKey ||
                          t.metaKey ||
                          t.shiftKey ||
                          s.siblings().removeClass("selected first"),
                        (t.ctrlKey || t.metaKey) &&
                          (s.is(".selected")
                            ? s.removeClass("selected first")
                            : s.addClass("selected first"),
                          s.siblings().removeClass("first")),
                        t.shiftKey)
                      ) {
                        var l = !1,
                          o = !1;
                        s
                          .siblings()
                          .removeClass("selected")
                          .siblings(".first")
                          .addClass("selected"),
                          s.prevAll().each(function () {
                            e(this).is(".first") && (l = !0);
                          }),
                          s.nextAll().each(function () {
                            e(this).is(".first") && (o = !0);
                          }),
                          l &&
                            s.prevAll().each(function () {
                              return e(this).is(".selected")
                                ? !1
                                : void e(this)
                                    .not(".disabled, .optgroup")
                                    .addClass("selected");
                            }),
                          o &&
                            s.nextAll().each(function () {
                              return e(this).is(".selected")
                                ? !1
                                : void e(this)
                                    .not(".disabled, .optgroup")
                                    .addClass("selected");
                            }),
                          1 == a.filter(".selected").length &&
                            s.addClass("first");
                      }
                      f.prop("selected", !1),
                        a.filter(".selected").each(function () {
                          var t = e(this),
                            s = t.index();
                          t.is(".option") &&
                            (s -= t.prevAll(".optgroup").length),
                            f.eq(s).prop("selected", !0);
                        }),
                        i.change();
                    }),
                  f.each(function (t) {
                    e(this).data("optionIndex", t);
                  }),
                  i
                    .on("change.styler", function () {
                      a.removeClass("selected");
                      var t = [];
                      f.filter(":selected").each(function () {
                        t.push(e(this).data("optionIndex"));
                      }),
                        a
                          .not(".optgroup")
                          .filter(function (s) {
                            return e.inArray(s, t) > -1;
                          })
                          .addClass("selected");
                    })
                    .on("focus.styler", function () {
                      l.addClass("focused");
                    })
                    .on("blur.styler", function () {
                      l.removeClass("focused");
                    }),
                  c > l.height() &&
                    i.on("keydown.styler", function (e) {
                      (38 != e.which && 37 != e.which && 33 != e.which) ||
                        o.scrollTop(
                          o.scrollTop() +
                            a.filter(".selected").position().top -
                            u
                        ),
                        (40 != e.which && 39 != e.which && 34 != e.which) ||
                          o.scrollTop(
                            o.scrollTop() +
                              a.filter(".selected:last").position().top -
                              o.innerHeight() +
                              2 * u
                          );
                    }));
          }

          var f = e("option", i),
            h = "";
          if (i.is("[multiple]")) {
            if (a || o) return;
            c();
          } else n();
        };
        f(),
          i.on("refresh", function () {
            i.off(".styler").parent().before(i).remove(), f();
          });
      } else
        i.is(":reset") &&
          i.on("click", function () {
            setTimeout(function () {
              i.closest("form").find("input, select").trigger("refresh");
            }, 1);
          });
    },
    destroy: function () {
      var t = e(this.element);
      t.is(":checkbox") || t.is(":radio")
        ? (t
            .removeData("_" + i)
            .off(".styler refresh")
            .removeAttr("style")
            .parent()
            .before(t)
            .remove(),
          t
            .closest("label")
            .add('label[for="' + t.attr("id") + '"]')
            .off(".styler"))
        : t.is('input[type="number"]')
        ? t
            .removeData("_" + i)
            .off(".styler refresh")
            .closest(".jq-number")
            .before(t)
            .remove()
        : (t.is(":file") || t.is("select")) &&
          t
            .removeData("_" + i)
            .off(".styler refresh")
            .removeAttr("style")
            .parent()
            .before(t)
            .remove();
    },
  }),
    (e.fn[i] = function (s) {
      var l = arguments;
      if (void 0 === s || "object" == typeof s)
        return (
          this.each(function () {
            e.data(this, "_" + i) || e.data(this, "_" + i, new t(this, s));
          })
            .promise()
            .done(function () {
              var t = e(this[0]).data("_" + i);
              t && t.options.onFormStyled.call();
            }),
          this
        );
      if ("string" == typeof s && "_" !== s[0] && "init" !== s) {
        var o;
        return (
          this.each(function () {
            var a = e.data(this, "_" + i);
            a instanceof t &&
              "function" == typeof a[s] &&
              (o = a[s].apply(a, Array.prototype.slice.call(l, 1)));
          }),
          void 0 !== o ? o : this
        );
      }
    }),
    (s.registered = !1);
});

/*! Select2 4.0.7 | https://github.com/select2/select2/blob/master/LICENSE.md */
!(function (n) {
  "function" == typeof define && define.amd
    ? define(["jquery"], n)
    : "object" == typeof module && module.exports
    ? (module.exports = function (e, t) {
        return (
          void 0 === t &&
            (t =
              "undefined" != typeof window
                ? require("jquery")
                : require("jquery")(e)),
          n(t),
          t
        );
      })
    : n(jQuery);
})(function (d) {
  var e = (function () {
      if (d && d.fn && d.fn.select2 && d.fn.select2.amd)
        var e = d.fn.select2.amd;
      var t, n, i, h, o, s, f, g, m, v, y, _, r, a, w, l;
      function b(e, t) {
        return r.call(e, t);
      }
      function c(e, t) {
        var n,
          i,
          r,
          o,
          s,
          a,
          l,
          c,
          u,
          d,
          p,
          h = t && t.split("/"),
          f = y.map,
          g = (f && f["*"]) || {};
        if (e) {
          for (
            s = (e = e.split("/")).length - 1,
              y.nodeIdCompat && w.test(e[s]) && (e[s] = e[s].replace(w, "")),
              "." === e[0].charAt(0) &&
                h &&
                (e = h.slice(0, h.length - 1).concat(e)),
              u = 0;
            u < e.length;
            u++
          )
            if ("." === (p = e[u])) e.splice(u, 1), (u -= 1);
            else if (".." === p) {
              if (0 === u || (1 === u && ".." === e[2]) || ".." === e[u - 1])
                continue;
              0 < u && (e.splice(u - 1, 2), (u -= 2));
            }
          e = e.join("/");
        }
        if ((h || g) && f) {
          for (u = (n = e.split("/")).length; 0 < u; u -= 1) {
            if (((i = n.slice(0, u).join("/")), h))
              for (d = h.length; 0 < d; d -= 1)
                if ((r = (r = f[h.slice(0, d).join("/")]) && r[i])) {
                  (o = r), (a = u);
                  break;
                }
            if (o) break;
            !l && g && g[i] && ((l = g[i]), (c = u));
          }
          !o && l && ((o = l), (a = c)),
            o && (n.splice(0, a, o), (e = n.join("/")));
        }
        return e;
      }
      function A(t, n) {
        return function () {
          var e = a.call(arguments, 0);
          return (
            "string" != typeof e[0] && 1 === e.length && e.push(null),
            s.apply(h, e.concat([t, n]))
          );
        };
      }
      function x(t) {
        return function (e) {
          m[t] = e;
        };
      }
      function S(e) {
        if (b(v, e)) {
          var t = v[e];
          delete v[e], (_[e] = !0), o.apply(h, t);
        }
        if (!b(m, e) && !b(_, e)) throw new Error("No " + e);
        return m[e];
      }
      function u(e) {
        var t,
          n = e ? e.indexOf("!") : -1;
        return (
          -1 < n &&
            ((t = e.substring(0, n)), (e = e.substring(n + 1, e.length))),
          [t, e]
        );
      }
      function D(e) {
        return e ? u(e) : [];
      }
      return (
        (e && e.requirejs) ||
          (e ? (n = e) : (e = {}),
          (m = {}),
          (v = {}),
          (y = {}),
          (_ = {}),
          (r = Object.prototype.hasOwnProperty),
          (a = [].slice),
          (w = /\.js$/),
          (f = function (e, t) {
            var n,
              i = u(e),
              r = i[0],
              o = t[1];
            return (
              (e = i[1]),
              r && (n = S((r = c(r, o)))),
              r
                ? (e =
                    n && n.normalize
                      ? n.normalize(
                          e,
                          (function (t) {
                            return function (e) {
                              return c(e, t);
                            };
                          })(o)
                        )
                      : c(e, o))
                : ((r = (i = u((e = c(e, o))))[0]),
                  (e = i[1]),
                  r && (n = S(r))),
              { f: r ? r + "!" + e : e, n: e, pr: r, p: n }
            );
          }),
          (g = {
            require: function (e) {
              return A(e);
            },
            exports: function (e) {
              var t = m[e];
              return void 0 !== t ? t : (m[e] = {});
            },
            module: function (e) {
              return {
                id: e,
                uri: "",
                exports: m[e],
                config: (function (e) {
                  return function () {
                    return (y && y.config && y.config[e]) || {};
                  };
                })(e),
              };
            },
          }),
          (o = function (e, t, n, i) {
            var r,
              o,
              s,
              a,
              l,
              c,
              u,
              d = [],
              p = typeof n;
            if (((c = D((i = i || e))), "undefined" == p || "function" == p)) {
              for (
                t =
                  !t.length && n.length ? ["require", "exports", "module"] : t,
                  l = 0;
                l < t.length;
                l += 1
              )
                if ("require" === (o = (a = f(t[l], c)).f)) d[l] = g.require(e);
                else if ("exports" === o) (d[l] = g.exports(e)), (u = !0);
                else if ("module" === o) r = d[l] = g.module(e);
                else if (b(m, o) || b(v, o) || b(_, o)) d[l] = S(o);
                else {
                  if (!a.p) throw new Error(e + " missing " + o);
                  a.p.load(a.n, A(i, !0), x(o), {}), (d[l] = m[o]);
                }
              (s = n ? n.apply(m[e], d) : void 0),
                e &&
                  (r && r.exports !== h && r.exports !== m[e]
                    ? (m[e] = r.exports)
                    : (s === h && u) || (m[e] = s));
            } else e && (m[e] = n);
          }),
          (t = n = s = function (e, t, n, i, r) {
            if ("string" == typeof e) return g[e] ? g[e](t) : S(f(e, D(t)).f);
            if (!e.splice) {
              if (((y = e).deps && s(y.deps, y.callback), !t)) return;
              t.splice ? ((e = t), (t = n), (n = null)) : (e = h);
            }
            return (
              (t = t || function () {}),
              "function" == typeof n && ((n = i), (i = r)),
              i
                ? o(h, e, t, n)
                : setTimeout(function () {
                    o(h, e, t, n);
                  }, 4),
              s
            );
          }),
          (s.config = function (e) {
            return s(e);
          }),
          (t._defined = m),
          ((i = function (e, t, n) {
            if ("string" != typeof e)
              throw new Error(
                "See almond README: incorrect module build, no module name"
              );
            t.splice || ((n = t), (t = [])),
              b(m, e) || b(v, e) || (v[e] = [e, t, n]);
          }).amd = { jQuery: !0 }),
          (e.requirejs = t),
          (e.require = n),
          (e.define = i)),
        e.define("almond", function () {}),
        e.define("jquery", [], function () {
          var e = d || $;
          return (
            null == e &&
              console &&
              console.error &&
              console.error(
                "Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."
              ),
            e
          );
        }),
        e.define("select2/utils", ["jquery"], function (o) {
          var r = {};
          function u(e) {
            var t = e.prototype,
              n = [];
            for (var i in t) {
              "function" == typeof t[i] && "constructor" !== i && n.push(i);
            }
            return n;
          }
          (r.Extend = function (e, t) {
            var n = {}.hasOwnProperty;
            function i() {
              this.constructor = e;
            }
            for (var r in t) n.call(t, r) && (e[r] = t[r]);
            return (
              (i.prototype = t.prototype),
              (e.prototype = new i()),
              (e.__super__ = t.prototype),
              e
            );
          }),
            (r.Decorate = function (i, r) {
              var e = u(r),
                t = u(i);
              function o() {
                var e = Array.prototype.unshift,
                  t = r.prototype.constructor.length,
                  n = i.prototype.constructor;
                0 < t &&
                  (e.call(arguments, i.prototype.constructor),
                  (n = r.prototype.constructor)),
                  n.apply(this, arguments);
              }
              (r.displayName = i.displayName),
                (o.prototype = new (function () {
                  this.constructor = o;
                })());
              for (var n = 0; n < t.length; n++) {
                var s = t[n];
                o.prototype[s] = i.prototype[s];
              }
              function a(e) {
                var t = function () {};
                e in o.prototype && (t = o.prototype[e]);
                var n = r.prototype[e];
                return function () {
                  return (
                    Array.prototype.unshift.call(arguments, t),
                    n.apply(this, arguments)
                  );
                };
              }
              for (var l = 0; l < e.length; l++) {
                var c = e[l];
                o.prototype[c] = a(c);
              }
              return o;
            });
          function e() {
            this.listeners = {};
          }
          (e.prototype.on = function (e, t) {
            (this.listeners = this.listeners || {}),
              e in this.listeners
                ? this.listeners[e].push(t)
                : (this.listeners[e] = [t]);
          }),
            (e.prototype.trigger = function (e) {
              var t = Array.prototype.slice,
                n = t.call(arguments, 1);
              (this.listeners = this.listeners || {}),
                null == n && (n = []),
                0 === n.length && n.push({}),
                (n[0]._type = e) in this.listeners &&
                  this.invoke(this.listeners[e], t.call(arguments, 1)),
                "*" in this.listeners &&
                  this.invoke(this.listeners["*"], arguments);
            }),
            (e.prototype.invoke = function (e, t) {
              for (var n = 0, i = e.length; n < i; n++) e[n].apply(this, t);
            }),
            (r.Observable = e),
            (r.generateChars = function (e) {
              for (var t = "", n = 0; n < e; n++) {
                t += Math.floor(36 * Math.random()).toString(36);
              }
              return t;
            }),
            (r.bind = function (e, t) {
              return function () {
                e.apply(t, arguments);
              };
            }),
            (r._convertData = function (e) {
              for (var t in e) {
                var n = t.split("-"),
                  i = e;
                if (1 !== n.length) {
                  for (var r = 0; r < n.length; r++) {
                    var o = n[r];
                    (o = o.substring(0, 1).toLowerCase() + o.substring(1)) in
                      i || (i[o] = {}),
                      r == n.length - 1 && (i[o] = e[t]),
                      (i = i[o]);
                  }
                  delete e[t];
                }
              }
              return e;
            }),
            (r.hasScroll = function (e, t) {
              var n = o(t),
                i = t.style.overflowX,
                r = t.style.overflowY;
              return (
                (i !== r || ("hidden" !== r && "visible" !== r)) &&
                ("scroll" === i ||
                  "scroll" === r ||
                  n.innerHeight() < t.scrollHeight ||
                  n.innerWidth() < t.scrollWidth)
              );
            }),
            (r.escapeMarkup = function (e) {
              var t = {
                "\\": "&#92;",
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
                "/": "&#47;",
              };
              return "string" != typeof e
                ? e
                : String(e).replace(/[&<>"'\/\\]/g, function (e) {
                    return t[e];
                  });
            }),
            (r.appendMany = function (e, t) {
              if ("1.7" === o.fn.jquery.substr(0, 3)) {
                var n = o();
                o.map(t, function (e) {
                  n = n.add(e);
                }),
                  (t = n);
              }
              e.append(t);
            }),
            (r.__cache = {});
          var n = 0;
          return (
            (r.GetUniqueElementId = function (e) {
              var t = e.getAttribute("data-select2-id");
              return (
                null == t &&
                  (e.id
                    ? ((t = e.id), e.setAttribute("data-select2-id", t))
                    : (e.setAttribute("data-select2-id", ++n),
                      (t = n.toString()))),
                t
              );
            }),
            (r.StoreData = function (e, t, n) {
              var i = r.GetUniqueElementId(e);
              r.__cache[i] || (r.__cache[i] = {}), (r.__cache[i][t] = n);
            }),
            (r.GetData = function (e, t) {
              var n = r.GetUniqueElementId(e);
              return t
                ? r.__cache[n] && null != r.__cache[n][t]
                  ? r.__cache[n][t]
                  : o(e).data(t)
                : r.__cache[n];
            }),
            (r.RemoveData = function (e) {
              var t = r.GetUniqueElementId(e);
              null != r.__cache[t] && delete r.__cache[t];
            }),
            r
          );
        }),
        e.define("select2/results", ["jquery", "./utils"], function (p, h) {
          function i(e, t, n) {
            (this.$element = e),
              (this.data = n),
              (this.options = t),
              i.__super__.constructor.call(this);
          }
          return (
            h.Extend(i, h.Observable),
            (i.prototype.render = function () {
              var e = p(
                '<ul class="select2-results__options" role="tree"></ul>'
              );
              return (
                this.options.get("multiple") &&
                  e.attr("aria-multiselectable", "true"),
                (this.$results = e)
              );
            }),
            (i.prototype.clear = function () {
              this.$results.empty();
            }),
            (i.prototype.displayMessage = function (e) {
              var t = this.options.get("escapeMarkup");
              this.clear(), this.hideLoading();
              var n = p(
                  '<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'
                ),
                i = this.options.get("translations").get(e.message);
              n.append(t(i(e.args))),
                (n[0].className += " select2-results__message"),
                this.$results.append(n);
            }),
            (i.prototype.hideMessages = function () {
              this.$results.find(".select2-results__message").remove();
            }),
            (i.prototype.append = function (e) {
              this.hideLoading();
              var t = [];
              if (null != e.results && 0 !== e.results.length) {
                e.results = this.sort(e.results);
                for (var n = 0; n < e.results.length; n++) {
                  var i = e.results[n],
                    r = this.option(i);
                  t.push(r);
                }
                this.$results.append(t);
              } else
                0 === this.$results.children().length &&
                  this.trigger("results:message", { message: "noResults" });
            }),
            (i.prototype.position = function (e, t) {
              t.find(".select2-results").append(e);
            }),
            (i.prototype.sort = function (e) {
              return this.options.get("sorter")(e);
            }),
            (i.prototype.highlightFirstItem = function () {
              var e = this.$results.find(
                  ".select2-results__option[aria-selected]"
                ),
                t = e.filter("[aria-selected=true]");
              0 < t.length
                ? t.first().trigger("mouseenter")
                : e.first().trigger("mouseenter"),
                this.ensureHighlightVisible();
            }),
            (i.prototype.setClasses = function () {
              var t = this;
              this.data.current(function (e) {
                var i = p.map(e, function (e) {
                  return e.id.toString();
                });
                t.$results
                  .find(".select2-results__option[aria-selected]")
                  .each(function () {
                    var e = p(this),
                      t = h.GetData(this, "data"),
                      n = "" + t.id;
                    (null != t.element && t.element.selected) ||
                    (null == t.element && -1 < p.inArray(n, i))
                      ? e.attr("aria-selected", "true")
                      : e.attr("aria-selected", "false");
                  });
              });
            }),
            (i.prototype.showLoading = function (e) {
              this.hideLoading();
              var t = {
                  disabled: !0,
                  loading: !0,
                  text: this.options.get("translations").get("searching")(e),
                },
                n = this.option(t);
              (n.className += " loading-results"), this.$results.prepend(n);
            }),
            (i.prototype.hideLoading = function () {
              this.$results.find(".loading-results").remove();
            }),
            (i.prototype.option = function (e) {
              var t = document.createElement("li");
              t.className = "select2-results__option";
              var n = { role: "treeitem", "aria-selected": "false" };
              for (var i in (e.disabled &&
                (delete n["aria-selected"], (n["aria-disabled"] = "true")),
              null == e.id && delete n["aria-selected"],
              null != e._resultId && (t.id = e._resultId),
              e.title && (t.title = e.title),
              e.children &&
                ((n.role = "group"),
                (n["aria-label"] = e.text),
                delete n["aria-selected"]),
              n)) {
                var r = n[i];
                t.setAttribute(i, r);
              }
              if (e.children) {
                var o = p(t),
                  s = document.createElement("strong");
                s.className = "select2-results__group";
                p(s);
                this.template(e, s);
                for (var a = [], l = 0; l < e.children.length; l++) {
                  var c = e.children[l],
                    u = this.option(c);
                  a.push(u);
                }
                var d = p("<ul></ul>", {
                  class:
                    "select2-results__options select2-results__options--nested",
                });
                d.append(a), o.append(s), o.append(d);
              } else this.template(e, t);
              return h.StoreData(t, "data", e), t;
            }),
            (i.prototype.bind = function (t, e) {
              var l = this,
                n = t.id + "-results";
              this.$results.attr("id", n),
                t.on("results:all", function (e) {
                  l.clear(),
                    l.append(e.data),
                    t.isOpen() && (l.setClasses(), l.highlightFirstItem());
                }),
                t.on("results:append", function (e) {
                  l.append(e.data), t.isOpen() && l.setClasses();
                }),
                t.on("query", function (e) {
                  l.hideMessages(), l.showLoading(e);
                }),
                t.on("select", function () {
                  t.isOpen() &&
                    (l.setClasses(),
                    l.options.get("scrollAfterSelect") &&
                      l.highlightFirstItem());
                }),
                t.on("unselect", function () {
                  t.isOpen() &&
                    (l.setClasses(),
                    l.options.get("scrollAfterSelect") &&
                      l.highlightFirstItem());
                }),
                t.on("open", function () {
                  l.$results.attr("aria-expanded", "true"),
                    l.$results.attr("aria-hidden", "false"),
                    l.setClasses(),
                    l.ensureHighlightVisible();
                }),
                t.on("close", function () {
                  l.$results.attr("aria-expanded", "false"),
                    l.$results.attr("aria-hidden", "true"),
                    l.$results.removeAttr("aria-activedescendant");
                }),
                t.on("results:toggle", function () {
                  var e = l.getHighlightedResults();
                  0 !== e.length && e.trigger("mouseup");
                }),
                t.on("results:select", function () {
                  var e = l.getHighlightedResults();
                  if (0 !== e.length) {
                    var t = h.GetData(e[0], "data");
                    "true" == e.attr("aria-selected")
                      ? l.trigger("close", {})
                      : l.trigger("select", { data: t });
                  }
                }),
                t.on("results:previous", function () {
                  var e = l.getHighlightedResults(),
                    t = l.$results.find("[aria-selected]"),
                    n = t.index(e);
                  if (!(n <= 0)) {
                    var i = n - 1;
                    0 === e.length && (i = 0);
                    var r = t.eq(i);
                    r.trigger("mouseenter");
                    var o = l.$results.offset().top,
                      s = r.offset().top,
                      a = l.$results.scrollTop() + (s - o);
                    0 === i
                      ? l.$results.scrollTop(0)
                      : s - o < 0 && l.$results.scrollTop(a);
                  }
                }),
                t.on("results:next", function () {
                  var e = l.getHighlightedResults(),
                    t = l.$results.find("[aria-selected]"),
                    n = t.index(e) + 1;
                  if (!(n >= t.length)) {
                    var i = t.eq(n);
                    i.trigger("mouseenter");
                    var r =
                        l.$results.offset().top + l.$results.outerHeight(!1),
                      o = i.offset().top + i.outerHeight(!1),
                      s = l.$results.scrollTop() + o - r;
                    0 === n
                      ? l.$results.scrollTop(0)
                      : r < o && l.$results.scrollTop(s);
                  }
                }),
                t.on("results:focus", function (e) {
                  e.element.addClass("select2-results__option--highlighted");
                }),
                t.on("results:message", function (e) {
                  l.displayMessage(e);
                }),
                p.fn.mousewheel &&
                  this.$results.on("mousewheel", function (e) {
                    var t = l.$results.scrollTop(),
                      n = l.$results.get(0).scrollHeight - t + e.deltaY,
                      i = 0 < e.deltaY && t - e.deltaY <= 0,
                      r = e.deltaY < 0 && n <= l.$results.height();
                    i
                      ? (l.$results.scrollTop(0),
                        e.preventDefault(),
                        e.stopPropagation())
                      : r &&
                        (l.$results.scrollTop(
                          l.$results.get(0).scrollHeight - l.$results.height()
                        ),
                        e.preventDefault(),
                        e.stopPropagation());
                  }),
                this.$results.on(
                  "mouseup",
                  ".select2-results__option[aria-selected]",
                  function (e) {
                    var t = p(this),
                      n = h.GetData(this, "data");
                    "true" !== t.attr("aria-selected")
                      ? l.trigger("select", { originalEvent: e, data: n })
                      : l.options.get("multiple")
                      ? l.trigger("unselect", { originalEvent: e, data: n })
                      : l.trigger("close", {});
                  }
                ),
                this.$results.on(
                  "mouseenter",
                  ".select2-results__option[aria-selected]",
                  function (e) {
                    var t = h.GetData(this, "data");
                    l
                      .getHighlightedResults()
                      .removeClass("select2-results__option--highlighted"),
                      l.trigger("results:focus", { data: t, element: p(this) });
                  }
                );
            }),
            (i.prototype.getHighlightedResults = function () {
              return this.$results.find(
                ".select2-results__option--highlighted"
              );
            }),
            (i.prototype.destroy = function () {
              this.$results.remove();
            }),
            (i.prototype.ensureHighlightVisible = function () {
              var e = this.getHighlightedResults();
              if (0 !== e.length) {
                var t = this.$results.find("[aria-selected]").index(e),
                  n = this.$results.offset().top,
                  i = e.offset().top,
                  r = this.$results.scrollTop() + (i - n),
                  o = i - n;
                (r -= 2 * e.outerHeight(!1)),
                  t <= 2
                    ? this.$results.scrollTop(0)
                    : (o > this.$results.outerHeight() || o < 0) &&
                      this.$results.scrollTop(r);
              }
            }),
            (i.prototype.template = function (e, t) {
              var n = this.options.get("templateResult"),
                i = this.options.get("escapeMarkup"),
                r = n(e, t);
              null == r
                ? (t.style.display = "none")
                : "string" == typeof r
                ? (t.innerHTML = i(r))
                : p(t).append(r);
            }),
            i
          );
        }),
        e.define("select2/keys", [], function () {
          return {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            ESC: 27,
            SPACE: 32,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            DELETE: 46,
          };
        }),
        e.define(
          "select2/selection/base",
          ["jquery", "../utils", "../keys"],
          function (n, i, r) {
            function o(e, t) {
              (this.$element = e),
                (this.options = t),
                o.__super__.constructor.call(this);
            }
            return (
              i.Extend(o, i.Observable),
              (o.prototype.render = function () {
                var e = n(
                  '<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>'
                );
                return (
                  (this._tabindex = 0),
                  null != i.GetData(this.$element[0], "old-tabindex")
                    ? (this._tabindex = i.GetData(
                        this.$element[0],
                        "old-tabindex"
                      ))
                    : null != this.$element.attr("tabindex") &&
                      (this._tabindex = this.$element.attr("tabindex")),
                  e.attr("title", this.$element.attr("title")),
                  e.attr("tabindex", this._tabindex),
                  (this.$selection = e)
                );
              }),
              (o.prototype.bind = function (e, t) {
                var n = this,
                  i = (e.id, e.id + "-results");
                (this.container = e),
                  this.$selection.on("focus", function (e) {
                    n.trigger("focus", e);
                  }),
                  this.$selection.on("blur", function (e) {
                    n._handleBlur(e);
                  }),
                  this.$selection.on("keydown", function (e) {
                    n.trigger("keypress", e),
                      e.which === r.SPACE && e.preventDefault();
                  }),
                  e.on("results:focus", function (e) {
                    n.$selection.attr(
                      "aria-activedescendant",
                      e.data._resultId
                    );
                  }),
                  e.on("selection:update", function (e) {
                    n.update(e.data);
                  }),
                  e.on("open", function () {
                    n.$selection.attr("aria-expanded", "true"),
                      n.$selection.attr("aria-owns", i),
                      n._attachCloseHandler(e);
                  }),
                  e.on("close", function () {
                    n.$selection.attr("aria-expanded", "false"),
                      n.$selection.removeAttr("aria-activedescendant"),
                      n.$selection.removeAttr("aria-owns"),
                      window.setTimeout(function () {
                        n.$selection.focus();
                      }, 0),
                      n._detachCloseHandler(e);
                  }),
                  e.on("enable", function () {
                    n.$selection.attr("tabindex", n._tabindex);
                  }),
                  e.on("disable", function () {
                    n.$selection.attr("tabindex", "-1");
                  });
              }),
              (o.prototype._handleBlur = function (e) {
                var t = this;
                window.setTimeout(function () {
                  document.activeElement == t.$selection[0] ||
                    n.contains(t.$selection[0], document.activeElement) ||
                    t.trigger("blur", e);
                }, 1);
              }),
              (o.prototype._attachCloseHandler = function (e) {
                n(document.body).on("mousedown.select2." + e.id, function (e) {
                  var t = n(e.target).closest(".select2");
                  n(".select2.select2-container--open").each(function () {
                    n(this);
                    this != t[0] && i.GetData(this, "element").select2("close");
                  });
                });
              }),
              (o.prototype._detachCloseHandler = function (e) {
                n(document.body).off("mousedown.select2." + e.id);
              }),
              (o.prototype.position = function (e, t) {
                t.find(".selection").append(e);
              }),
              (o.prototype.destroy = function () {
                this._detachCloseHandler(this.container);
              }),
              (o.prototype.update = function (e) {
                throw new Error(
                  "The `update` method must be defined in child classes."
                );
              }),
              o
            );
          }
        ),
        e.define(
          "select2/selection/single",
          ["jquery", "./base", "../utils", "../keys"],
          function (e, t, n, i) {
            function r() {
              r.__super__.constructor.apply(this, arguments);
            }
            return (
              n.Extend(r, t),
              (r.prototype.render = function () {
                var e = r.__super__.render.call(this);
                return (
                  e.addClass("select2-selection--single"),
                  e.html(
                    '<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'
                  ),
                  e
                );
              }),
              (r.prototype.bind = function (t, e) {
                var n = this;
                r.__super__.bind.apply(this, arguments);
                var i = t.id + "-container";
                this.$selection
                  .find(".select2-selection__rendered")
                  .attr("id", i)
                  .attr("role", "textbox")
                  .attr("aria-readonly", "true"),
                  this.$selection.attr("aria-labelledby", i),
                  this.$selection.on("mousedown", function (e) {
                    1 === e.which && n.trigger("toggle", { originalEvent: e });
                  }),
                  this.$selection.on("focus", function (e) {}),
                  this.$selection.on("blur", function (e) {}),
                  t.on("focus", function (e) {
                    t.isOpen() || n.$selection.focus();
                  });
              }),
              (r.prototype.clear = function () {
                var e = this.$selection.find(".select2-selection__rendered");
                e.empty(), e.removeAttr("title");
              }),
              (r.prototype.display = function (e, t) {
                var n = this.options.get("templateSelection");
                return this.options.get("escapeMarkup")(n(e, t));
              }),
              (r.prototype.selectionContainer = function () {
                return e("<span></span>");
              }),
              (r.prototype.update = function (e) {
                if (0 !== e.length) {
                  var t = e[0],
                    n = this.$selection.find(".select2-selection__rendered"),
                    i = this.display(t, n);
                  n.empty().append(i), n.attr("title", t.title || t.text);
                } else this.clear();
              }),
              r
            );
          }
        ),
        e.define(
          "select2/selection/multiple",
          ["jquery", "./base", "../utils"],
          function (r, e, a) {
            function n(e, t) {
              n.__super__.constructor.apply(this, arguments);
            }
            return (
              a.Extend(n, e),
              (n.prototype.render = function () {
                var e = n.__super__.render.call(this);
                return (
                  e.addClass("select2-selection--multiple"),
                  e.html('<ul class="select2-selection__rendered"></ul>'),
                  e
                );
              }),
              (n.prototype.bind = function (e, t) {
                var i = this;
                n.__super__.bind.apply(this, arguments),
                  this.$selection.on("click", function (e) {
                    i.trigger("toggle", { originalEvent: e });
                  }),
                  this.$selection.on(
                    "click",
                    ".select2-selection__choice__remove",
                    function (e) {
                      if (!i.options.get("disabled")) {
                        var t = r(this).parent(),
                          n = a.GetData(t[0], "data");
                        i.trigger("unselect", { originalEvent: e, data: n });
                      }
                    }
                  );
              }),
              (n.prototype.clear = function () {
                var e = this.$selection.find(".select2-selection__rendered");
                e.empty(), e.removeAttr("title");
              }),
              (n.prototype.display = function (e, t) {
                var n = this.options.get("templateSelection");
                return this.options.get("escapeMarkup")(n(e, t));
              }),
              (n.prototype.selectionContainer = function () {
                return r(
                  '<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>'
                );
              }),
              (n.prototype.update = function (e) {
                if ((this.clear(), 0 !== e.length)) {
                  for (var t = [], n = 0; n < e.length; n++) {
                    var i = e[n],
                      r = this.selectionContainer(),
                      o = this.display(i, r);
                    r.append(o),
                      r.attr("title", i.title || i.text),
                      a.StoreData(r[0], "data", i),
                      t.push(r);
                  }
                  var s = this.$selection.find(".select2-selection__rendered");
                  a.appendMany(s, t);
                }
              }),
              n
            );
          }
        ),
        e.define("select2/selection/placeholder", ["../utils"], function (e) {
          function t(e, t, n) {
            (this.placeholder = this.normalizePlaceholder(
              n.get("placeholder")
            )),
              e.call(this, t, n);
          }
          return (
            (t.prototype.normalizePlaceholder = function (e, t) {
              return "string" == typeof t && (t = { id: "", text: t }), t;
            }),
            (t.prototype.createPlaceholder = function (e, t) {
              var n = this.selectionContainer();
              return (
                n.html(this.display(t)),
                n
                  .addClass("select2-selection__placeholder")
                  .removeClass("select2-selection__choice"),
                n
              );
            }),
            (t.prototype.update = function (e, t) {
              var n = 1 == t.length && t[0].id != this.placeholder.id;
              if (1 < t.length || n) return e.call(this, t);
              this.clear();
              var i = this.createPlaceholder(this.placeholder);
              this.$selection.find(".select2-selection__rendered").append(i);
            }),
            t
          );
        }),
        e.define(
          "select2/selection/allowClear",
          ["jquery", "../keys", "../utils"],
          function (r, i, a) {
            function e() {}
            return (
              (e.prototype.bind = function (e, t, n) {
                var i = this;
                e.call(this, t, n),
                  null == this.placeholder &&
                    this.options.get("debug") &&
                    window.console &&
                    console.error &&
                    console.error(
                      "Select2: The `allowClear` option should be used in combination with the `placeholder` option."
                    ),
                  this.$selection.on(
                    "mousedown",
                    ".select2-selection__clear",
                    function (e) {
                      i._handleClear(e);
                    }
                  ),
                  t.on("keypress", function (e) {
                    i._handleKeyboardClear(e, t);
                  });
              }),
              (e.prototype._handleClear = function (e, t) {
                if (!this.options.get("disabled")) {
                  var n = this.$selection.find(".select2-selection__clear");
                  if (0 !== n.length) {
                    t.stopPropagation();
                    var i = a.GetData(n[0], "data"),
                      r = this.$element.val();
                    this.$element.val(this.placeholder.id);
                    var o = { data: i };
                    if ((this.trigger("clear", o), o.prevented))
                      this.$element.val(r);
                    else {
                      for (var s = 0; s < i.length; s++)
                        if (
                          ((o = { data: i[s] }),
                          this.trigger("unselect", o),
                          o.prevented)
                        )
                          return void this.$element.val(r);
                      this.$element.trigger("change"),
                        this.trigger("toggle", {});
                    }
                  }
                }
              }),
              (e.prototype._handleKeyboardClear = function (e, t, n) {
                n.isOpen() ||
                  (t.which != i.DELETE && t.which != i.BACKSPACE) ||
                  this._handleClear(t);
              }),
              (e.prototype.update = function (e, t) {
                if (
                  (e.call(this, t),
                  !(
                    0 <
                      this.$selection.find(".select2-selection__placeholder")
                        .length || 0 === t.length
                  ))
                ) {
                  var n = this.options
                      .get("translations")
                      .get("removeAllItems"),
                    i = r(
                      '<span class="select2-selection__clear" title="' +
                        n() +
                        '">&times;</span>'
                    );
                  a.StoreData(i[0], "data", t),
                    this.$selection
                      .find(".select2-selection__rendered")
                      .prepend(i);
                }
              }),
              e
            );
          }
        ),
        e.define(
          "select2/selection/search",
          ["jquery", "../utils", "../keys"],
          function (i, s, a) {
            function e(e, t, n) {
              e.call(this, t, n);
            }
            return (
              (e.prototype.render = function (e) {
                var t = i(
                  '<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>'
                );
                (this.$searchContainer = t), (this.$search = t.find("input"));
                var n = e.call(this);
                return this._transferTabIndex(), n;
              }),
              (e.prototype.bind = function (e, t, n) {
                var i = this;
                e.call(this, t, n),
                  t.on("open", function () {
                    i.$search.trigger("focus");
                  }),
                  t.on("close", function () {
                    i.$search.val(""),
                      i.$search.removeAttr("aria-activedescendant"),
                      i.$search.trigger("focus");
                  }),
                  t.on("enable", function () {
                    i.$search.prop("disabled", !1), i._transferTabIndex();
                  }),
                  t.on("disable", function () {
                    i.$search.prop("disabled", !0);
                  }),
                  t.on("focus", function (e) {
                    i.$search.trigger("focus");
                  }),
                  t.on("results:focus", function (e) {
                    i.$search.attr("aria-activedescendant", e.id);
                  }),
                  this.$selection.on(
                    "focusin",
                    ".select2-search--inline",
                    function (e) {
                      i.trigger("focus", e);
                    }
                  ),
                  this.$selection.on(
                    "focusout",
                    ".select2-search--inline",
                    function (e) {
                      i._handleBlur(e);
                    }
                  ),
                  this.$selection.on(
                    "keydown",
                    ".select2-search--inline",
                    function (e) {
                      if (
                        (e.stopPropagation(),
                        i.trigger("keypress", e),
                        (i._keyUpPrevented = e.isDefaultPrevented()),
                        e.which === a.BACKSPACE && "" === i.$search.val())
                      ) {
                        var t = i.$searchContainer.prev(
                          ".select2-selection__choice"
                        );
                        if (0 < t.length) {
                          var n = s.GetData(t[0], "data");
                          i.searchRemoveChoice(n), e.preventDefault();
                        }
                      }
                    }
                  );
                var r = document.documentMode,
                  o = r && r <= 11;
                this.$selection.on(
                  "input.searchcheck",
                  ".select2-search--inline",
                  function (e) {
                    o
                      ? i.$selection.off("input.search input.searchcheck")
                      : i.$selection.off("keyup.search");
                  }
                ),
                  this.$selection.on(
                    "keyup.search input.search",
                    ".select2-search--inline",
                    function (e) {
                      if (o && "input" === e.type)
                        i.$selection.off("input.search input.searchcheck");
                      else {
                        var t = e.which;
                        t != a.SHIFT &&
                          t != a.CTRL &&
                          t != a.ALT &&
                          t != a.TAB &&
                          i.handleSearch(e);
                      }
                    }
                  );
              }),
              (e.prototype._transferTabIndex = function (e) {
                this.$search.attr("tabindex", this.$selection.attr("tabindex")),
                  this.$selection.attr("tabindex", "-1");
              }),
              (e.prototype.createPlaceholder = function (e, t) {
                this.$search.attr("placeholder", t.text);
              }),
              (e.prototype.update = function (e, t) {
                var n = this.$search[0] == document.activeElement;
                this.$search.attr("placeholder", ""),
                  e.call(this, t),
                  this.$selection
                    .find(".select2-selection__rendered")
                    .append(this.$searchContainer),
                  this.resizeSearch(),
                  n &&
                    (this.$element.find("[data-select2-tag]").length
                      ? this.$element.focus()
                      : this.$search.focus());
              }),
              (e.prototype.handleSearch = function () {
                if ((this.resizeSearch(), !this._keyUpPrevented)) {
                  var e = this.$search.val();
                  this.trigger("query", { term: e });
                }
                this._keyUpPrevented = !1;
              }),
              (e.prototype.searchRemoveChoice = function (e, t) {
                this.trigger("unselect", { data: t }),
                  this.$search.val(t.text),
                  this.handleSearch();
              }),
              (e.prototype.resizeSearch = function () {
                this.$search.css("width", "25px");
                var e = "";
                "" !== this.$search.attr("placeholder")
                  ? (e = this.$selection
                      .find(".select2-selection__rendered")
                      .innerWidth())
                  : (e = 0.75 * (this.$search.val().length + 1) + "em");
                this.$search.css("width", e);
              }),
              e
            );
          }
        ),
        e.define("select2/selection/eventRelay", ["jquery"], function (s) {
          function e() {}
          return (
            (e.prototype.bind = function (e, t, n) {
              var i = this,
                r = [
                  "open",
                  "opening",
                  "close",
                  "closing",
                  "select",
                  "selecting",
                  "unselect",
                  "unselecting",
                  "clear",
                  "clearing",
                ],
                o = [
                  "opening",
                  "closing",
                  "selecting",
                  "unselecting",
                  "clearing",
                ];
              e.call(this, t, n),
                t.on("*", function (e, t) {
                  if (-1 !== s.inArray(e, r)) {
                    t = t || {};
                    var n = s.Event("select2:" + e, { params: t });
                    i.$element.trigger(n),
                      -1 !== s.inArray(e, o) &&
                        (t.prevented = n.isDefaultPrevented());
                  }
                });
            }),
            e
          );
        }),
        e.define("select2/translation", ["jquery", "require"], function (t, n) {
          function i(e) {
            this.dict = e || {};
          }
          return (
            (i.prototype.all = function () {
              return this.dict;
            }),
            (i.prototype.get = function (e) {
              return this.dict[e];
            }),
            (i.prototype.extend = function (e) {
              this.dict = t.extend({}, e.all(), this.dict);
            }),
            (i._cache = {}),
            (i.loadPath = function (e) {
              if (!(e in i._cache)) {
                var t = n(e);
                i._cache[e] = t;
              }
              return new i(i._cache[e]);
            }),
            i
          );
        }),
        e.define("select2/diacritics", [], function () {
          return {
            "Ⓐ": "A",
            Ａ: "A",
            À: "A",
            Á: "A",
            Â: "A",
            Ầ: "A",
            Ấ: "A",
            Ẫ: "A",
            Ẩ: "A",
            Ã: "A",
            Ā: "A",
            Ă: "A",
            Ằ: "A",
            Ắ: "A",
            Ẵ: "A",
            Ẳ: "A",
            Ȧ: "A",
            Ǡ: "A",
            Ä: "A",
            Ǟ: "A",
            Ả: "A",
            Å: "A",
            Ǻ: "A",
            Ǎ: "A",
            Ȁ: "A",
            Ȃ: "A",
            Ạ: "A",
            Ậ: "A",
            Ặ: "A",
            Ḁ: "A",
            Ą: "A",
            Ⱥ: "A",
            Ɐ: "A",
            Ꜳ: "AA",
            Æ: "AE",
            Ǽ: "AE",
            Ǣ: "AE",
            Ꜵ: "AO",
            Ꜷ: "AU",
            Ꜹ: "AV",
            Ꜻ: "AV",
            Ꜽ: "AY",
            "Ⓑ": "B",
            Ｂ: "B",
            Ḃ: "B",
            Ḅ: "B",
            Ḇ: "B",
            Ƀ: "B",
            Ƃ: "B",
            Ɓ: "B",
            "Ⓒ": "C",
            Ｃ: "C",
            Ć: "C",
            Ĉ: "C",
            Ċ: "C",
            Č: "C",
            Ç: "C",
            Ḉ: "C",
            Ƈ: "C",
            Ȼ: "C",
            Ꜿ: "C",
            "Ⓓ": "D",
            Ｄ: "D",
            Ḋ: "D",
            Ď: "D",
            Ḍ: "D",
            Ḑ: "D",
            Ḓ: "D",
            Ḏ: "D",
            Đ: "D",
            Ƌ: "D",
            Ɗ: "D",
            Ɖ: "D",
            Ꝺ: "D",
            Ǳ: "DZ",
            Ǆ: "DZ",
            ǲ: "Dz",
            ǅ: "Dz",
            "Ⓔ": "E",
            Ｅ: "E",
            È: "E",
            É: "E",
            Ê: "E",
            Ề: "E",
            Ế: "E",
            Ễ: "E",
            Ể: "E",
            Ẽ: "E",
            Ē: "E",
            Ḕ: "E",
            Ḗ: "E",
            Ĕ: "E",
            Ė: "E",
            Ë: "E",
            Ẻ: "E",
            Ě: "E",
            Ȅ: "E",
            Ȇ: "E",
            Ẹ: "E",
            Ệ: "E",
            Ȩ: "E",
            Ḝ: "E",
            Ę: "E",
            Ḙ: "E",
            Ḛ: "E",
            Ɛ: "E",
            Ǝ: "E",
            "Ⓕ": "F",
            Ｆ: "F",
            Ḟ: "F",
            Ƒ: "F",
            Ꝼ: "F",
            "Ⓖ": "G",
            Ｇ: "G",
            Ǵ: "G",
            Ĝ: "G",
            Ḡ: "G",
            Ğ: "G",
            Ġ: "G",
            Ǧ: "G",
            Ģ: "G",
            Ǥ: "G",
            Ɠ: "G",
            Ꞡ: "G",
            Ᵹ: "G",
            Ꝿ: "G",
            "Ⓗ": "H",
            Ｈ: "H",
            Ĥ: "H",
            Ḣ: "H",
            Ḧ: "H",
            Ȟ: "H",
            Ḥ: "H",
            Ḩ: "H",
            Ḫ: "H",
            Ħ: "H",
            Ⱨ: "H",
            Ⱶ: "H",
            Ɥ: "H",
            "Ⓘ": "I",
            Ｉ: "I",
            Ì: "I",
            Í: "I",
            Î: "I",
            Ĩ: "I",
            Ī: "I",
            Ĭ: "I",
            İ: "I",
            Ï: "I",
            Ḯ: "I",
            Ỉ: "I",
            Ǐ: "I",
            Ȉ: "I",
            Ȋ: "I",
            Ị: "I",
            Į: "I",
            Ḭ: "I",
            Ɨ: "I",
            "Ⓙ": "J",
            Ｊ: "J",
            Ĵ: "J",
            Ɉ: "J",
            "Ⓚ": "K",
            Ｋ: "K",
            Ḱ: "K",
            Ǩ: "K",
            Ḳ: "K",
            Ķ: "K",
            Ḵ: "K",
            Ƙ: "K",
            Ⱪ: "K",
            Ꝁ: "K",
            Ꝃ: "K",
            Ꝅ: "K",
            Ꞣ: "K",
            "Ⓛ": "L",
            Ｌ: "L",
            Ŀ: "L",
            Ĺ: "L",
            Ľ: "L",
            Ḷ: "L",
            Ḹ: "L",
            Ļ: "L",
            Ḽ: "L",
            Ḻ: "L",
            Ł: "L",
            Ƚ: "L",
            Ɫ: "L",
            Ⱡ: "L",
            Ꝉ: "L",
            Ꝇ: "L",
            Ꞁ: "L",
            Ǉ: "LJ",
            ǈ: "Lj",
            "Ⓜ": "M",
            Ｍ: "M",
            Ḿ: "M",
            Ṁ: "M",
            Ṃ: "M",
            Ɱ: "M",
            Ɯ: "M",
            "Ⓝ": "N",
            Ｎ: "N",
            Ǹ: "N",
            Ń: "N",
            Ñ: "N",
            Ṅ: "N",
            Ň: "N",
            Ṇ: "N",
            Ņ: "N",
            Ṋ: "N",
            Ṉ: "N",
            Ƞ: "N",
            Ɲ: "N",
            Ꞑ: "N",
            Ꞥ: "N",
            Ǌ: "NJ",
            ǋ: "Nj",
            "Ⓞ": "O",
            Ｏ: "O",
            Ò: "O",
            Ó: "O",
            Ô: "O",
            Ồ: "O",
            Ố: "O",
            Ỗ: "O",
            Ổ: "O",
            Õ: "O",
            Ṍ: "O",
            Ȭ: "O",
            Ṏ: "O",
            Ō: "O",
            Ṑ: "O",
            Ṓ: "O",
            Ŏ: "O",
            Ȯ: "O",
            Ȱ: "O",
            Ö: "O",
            Ȫ: "O",
            Ỏ: "O",
            Ő: "O",
            Ǒ: "O",
            Ȍ: "O",
            Ȏ: "O",
            Ơ: "O",
            Ờ: "O",
            Ớ: "O",
            Ỡ: "O",
            Ở: "O",
            Ợ: "O",
            Ọ: "O",
            Ộ: "O",
            Ǫ: "O",
            Ǭ: "O",
            Ø: "O",
            Ǿ: "O",
            Ɔ: "O",
            Ɵ: "O",
            Ꝋ: "O",
            Ꝍ: "O",
            Œ: "OE",
            Ƣ: "OI",
            Ꝏ: "OO",
            Ȣ: "OU",
            "Ⓟ": "P",
            Ｐ: "P",
            Ṕ: "P",
            Ṗ: "P",
            Ƥ: "P",
            Ᵽ: "P",
            Ꝑ: "P",
            Ꝓ: "P",
            Ꝕ: "P",
            "Ⓠ": "Q",
            Ｑ: "Q",
            Ꝗ: "Q",
            Ꝙ: "Q",
            Ɋ: "Q",
            "Ⓡ": "R",
            Ｒ: "R",
            Ŕ: "R",
            Ṙ: "R",
            Ř: "R",
            Ȑ: "R",
            Ȓ: "R",
            Ṛ: "R",
            Ṝ: "R",
            Ŗ: "R",
            Ṟ: "R",
            Ɍ: "R",
            Ɽ: "R",
            Ꝛ: "R",
            Ꞧ: "R",
            Ꞃ: "R",
            "Ⓢ": "S",
            Ｓ: "S",
            ẞ: "S",
            Ś: "S",
            Ṥ: "S",
            Ŝ: "S",
            Ṡ: "S",
            Š: "S",
            Ṧ: "S",
            Ṣ: "S",
            Ṩ: "S",
            Ș: "S",
            Ş: "S",
            Ȿ: "S",
            Ꞩ: "S",
            Ꞅ: "S",
            "Ⓣ": "T",
            Ｔ: "T",
            Ṫ: "T",
            Ť: "T",
            Ṭ: "T",
            Ț: "T",
            Ţ: "T",
            Ṱ: "T",
            Ṯ: "T",
            Ŧ: "T",
            Ƭ: "T",
            Ʈ: "T",
            Ⱦ: "T",
            Ꞇ: "T",
            Ꜩ: "TZ",
            "Ⓤ": "U",
            Ｕ: "U",
            Ù: "U",
            Ú: "U",
            Û: "U",
            Ũ: "U",
            Ṹ: "U",
            Ū: "U",
            Ṻ: "U",
            Ŭ: "U",
            Ü: "U",
            Ǜ: "U",
            Ǘ: "U",
            Ǖ: "U",
            Ǚ: "U",
            Ủ: "U",
            Ů: "U",
            Ű: "U",
            Ǔ: "U",
            Ȕ: "U",
            Ȗ: "U",
            Ư: "U",
            Ừ: "U",
            Ứ: "U",
            Ữ: "U",
            Ử: "U",
            Ự: "U",
            Ụ: "U",
            Ṳ: "U",
            Ų: "U",
            Ṷ: "U",
            Ṵ: "U",
            Ʉ: "U",
            "Ⓥ": "V",
            Ｖ: "V",
            Ṽ: "V",
            Ṿ: "V",
            Ʋ: "V",
            Ꝟ: "V",
            Ʌ: "V",
            Ꝡ: "VY",
            "Ⓦ": "W",
            Ｗ: "W",
            Ẁ: "W",
            Ẃ: "W",
            Ŵ: "W",
            Ẇ: "W",
            Ẅ: "W",
            Ẉ: "W",
            Ⱳ: "W",
            "Ⓧ": "X",
            Ｘ: "X",
            Ẋ: "X",
            Ẍ: "X",
            "Ⓨ": "Y",
            Ｙ: "Y",
            Ỳ: "Y",
            Ý: "Y",
            Ŷ: "Y",
            Ỹ: "Y",
            Ȳ: "Y",
            Ẏ: "Y",
            Ÿ: "Y",
            Ỷ: "Y",
            Ỵ: "Y",
            Ƴ: "Y",
            Ɏ: "Y",
            Ỿ: "Y",
            "Ⓩ": "Z",
            Ｚ: "Z",
            Ź: "Z",
            Ẑ: "Z",
            Ż: "Z",
            Ž: "Z",
            Ẓ: "Z",
            Ẕ: "Z",
            Ƶ: "Z",
            Ȥ: "Z",
            Ɀ: "Z",
            Ⱬ: "Z",
            Ꝣ: "Z",
            "ⓐ": "a",
            ａ: "a",
            ẚ: "a",
            à: "a",
            á: "a",
            â: "a",
            ầ: "a",
            ấ: "a",
            ẫ: "a",
            ẩ: "a",
            ã: "a",
            ā: "a",
            ă: "a",
            ằ: "a",
            ắ: "a",
            ẵ: "a",
            ẳ: "a",
            ȧ: "a",
            ǡ: "a",
            ä: "a",
            ǟ: "a",
            ả: "a",
            å: "a",
            ǻ: "a",
            ǎ: "a",
            ȁ: "a",
            ȃ: "a",
            ạ: "a",
            ậ: "a",
            ặ: "a",
            ḁ: "a",
            ą: "a",
            ⱥ: "a",
            ɐ: "a",
            ꜳ: "aa",
            æ: "ae",
            ǽ: "ae",
            ǣ: "ae",
            ꜵ: "ao",
            ꜷ: "au",
            ꜹ: "av",
            ꜻ: "av",
            ꜽ: "ay",
            "ⓑ": "b",
            ｂ: "b",
            ḃ: "b",
            ḅ: "b",
            ḇ: "b",
            ƀ: "b",
            ƃ: "b",
            ɓ: "b",
            "ⓒ": "c",
            ｃ: "c",
            ć: "c",
            ĉ: "c",
            ċ: "c",
            č: "c",
            ç: "c",
            ḉ: "c",
            ƈ: "c",
            ȼ: "c",
            ꜿ: "c",
            ↄ: "c",
            "ⓓ": "d",
            ｄ: "d",
            ḋ: "d",
            ď: "d",
            ḍ: "d",
            ḑ: "d",
            ḓ: "d",
            ḏ: "d",
            đ: "d",
            ƌ: "d",
            ɖ: "d",
            ɗ: "d",
            ꝺ: "d",
            ǳ: "dz",
            ǆ: "dz",
            "ⓔ": "e",
            ｅ: "e",
            è: "e",
            é: "e",
            ê: "e",
            ề: "e",
            ế: "e",
            ễ: "e",
            ể: "e",
            ẽ: "e",
            ē: "e",
            ḕ: "e",
            ḗ: "e",
            ĕ: "e",
            ė: "e",
            ë: "e",
            ẻ: "e",
            ě: "e",
            ȅ: "e",
            ȇ: "e",
            ẹ: "e",
            ệ: "e",
            ȩ: "e",
            ḝ: "e",
            ę: "e",
            ḙ: "e",
            ḛ: "e",
            ɇ: "e",
            ɛ: "e",
            ǝ: "e",
            "ⓕ": "f",
            ｆ: "f",
            ḟ: "f",
            ƒ: "f",
            ꝼ: "f",
            "ⓖ": "g",
            ｇ: "g",
            ǵ: "g",
            ĝ: "g",
            ḡ: "g",
            ğ: "g",
            ġ: "g",
            ǧ: "g",
            ģ: "g",
            ǥ: "g",
            ɠ: "g",
            ꞡ: "g",
            ᵹ: "g",
            ꝿ: "g",
            "ⓗ": "h",
            ｈ: "h",
            ĥ: "h",
            ḣ: "h",
            ḧ: "h",
            ȟ: "h",
            ḥ: "h",
            ḩ: "h",
            ḫ: "h",
            ẖ: "h",
            ħ: "h",
            ⱨ: "h",
            ⱶ: "h",
            ɥ: "h",
            ƕ: "hv",
            "ⓘ": "i",
            ｉ: "i",
            ì: "i",
            í: "i",
            î: "i",
            ĩ: "i",
            ī: "i",
            ĭ: "i",
            ï: "i",
            ḯ: "i",
            ỉ: "i",
            ǐ: "i",
            ȉ: "i",
            ȋ: "i",
            ị: "i",
            į: "i",
            ḭ: "i",
            ɨ: "i",
            ı: "i",
            "ⓙ": "j",
            ｊ: "j",
            ĵ: "j",
            ǰ: "j",
            ɉ: "j",
            "ⓚ": "k",
            ｋ: "k",
            ḱ: "k",
            ǩ: "k",
            ḳ: "k",
            ķ: "k",
            ḵ: "k",
            ƙ: "k",
            ⱪ: "k",
            ꝁ: "k",
            ꝃ: "k",
            ꝅ: "k",
            ꞣ: "k",
            "ⓛ": "l",
            ｌ: "l",
            ŀ: "l",
            ĺ: "l",
            ľ: "l",
            ḷ: "l",
            ḹ: "l",
            ļ: "l",
            ḽ: "l",
            ḻ: "l",
            ſ: "l",
            ł: "l",
            ƚ: "l",
            ɫ: "l",
            ⱡ: "l",
            ꝉ: "l",
            ꞁ: "l",
            ꝇ: "l",
            ǉ: "lj",
            "ⓜ": "m",
            ｍ: "m",
            ḿ: "m",
            ṁ: "m",
            ṃ: "m",
            ɱ: "m",
            ɯ: "m",
            "ⓝ": "n",
            ｎ: "n",
            ǹ: "n",
            ń: "n",
            ñ: "n",
            ṅ: "n",
            ň: "n",
            ṇ: "n",
            ņ: "n",
            ṋ: "n",
            ṉ: "n",
            ƞ: "n",
            ɲ: "n",
            ŉ: "n",
            ꞑ: "n",
            ꞥ: "n",
            ǌ: "nj",
            "ⓞ": "o",
            ｏ: "o",
            ò: "o",
            ó: "o",
            ô: "o",
            ồ: "o",
            ố: "o",
            ỗ: "o",
            ổ: "o",
            õ: "o",
            ṍ: "o",
            ȭ: "o",
            ṏ: "o",
            ō: "o",
            ṑ: "o",
            ṓ: "o",
            ŏ: "o",
            ȯ: "o",
            ȱ: "o",
            ö: "o",
            ȫ: "o",
            ỏ: "o",
            ő: "o",
            ǒ: "o",
            ȍ: "o",
            ȏ: "o",
            ơ: "o",
            ờ: "o",
            ớ: "o",
            ỡ: "o",
            ở: "o",
            ợ: "o",
            ọ: "o",
            ộ: "o",
            ǫ: "o",
            ǭ: "o",
            ø: "o",
            ǿ: "o",
            ɔ: "o",
            ꝋ: "o",
            ꝍ: "o",
            ɵ: "o",
            œ: "oe",
            ƣ: "oi",
            ȣ: "ou",
            ꝏ: "oo",
            "ⓟ": "p",
            ｐ: "p",
            ṕ: "p",
            ṗ: "p",
            ƥ: "p",
            ᵽ: "p",
            ꝑ: "p",
            ꝓ: "p",
            ꝕ: "p",
            "ⓠ": "q",
            ｑ: "q",
            ɋ: "q",
            ꝗ: "q",
            ꝙ: "q",
            "ⓡ": "r",
            ｒ: "r",
            ŕ: "r",
            ṙ: "r",
            ř: "r",
            ȑ: "r",
            ȓ: "r",
            ṛ: "r",
            ṝ: "r",
            ŗ: "r",
            ṟ: "r",
            ɍ: "r",
            ɽ: "r",
            ꝛ: "r",
            ꞧ: "r",
            ꞃ: "r",
            "ⓢ": "s",
            ｓ: "s",
            ß: "s",
            ś: "s",
            ṥ: "s",
            ŝ: "s",
            ṡ: "s",
            š: "s",
            ṧ: "s",
            ṣ: "s",
            ṩ: "s",
            ș: "s",
            ş: "s",
            ȿ: "s",
            ꞩ: "s",
            ꞅ: "s",
            ẛ: "s",
            "ⓣ": "t",
            ｔ: "t",
            ṫ: "t",
            ẗ: "t",
            ť: "t",
            ṭ: "t",
            ț: "t",
            ţ: "t",
            ṱ: "t",
            ṯ: "t",
            ŧ: "t",
            ƭ: "t",
            ʈ: "t",
            ⱦ: "t",
            ꞇ: "t",
            ꜩ: "tz",
            "ⓤ": "u",
            ｕ: "u",
            ù: "u",
            ú: "u",
            û: "u",
            ũ: "u",
            ṹ: "u",
            ū: "u",
            ṻ: "u",
            ŭ: "u",
            ü: "u",
            ǜ: "u",
            ǘ: "u",
            ǖ: "u",
            ǚ: "u",
            ủ: "u",
            ů: "u",
            ű: "u",
            ǔ: "u",
            ȕ: "u",
            ȗ: "u",
            ư: "u",
            ừ: "u",
            ứ: "u",
            ữ: "u",
            ử: "u",
            ự: "u",
            ụ: "u",
            ṳ: "u",
            ų: "u",
            ṷ: "u",
            ṵ: "u",
            ʉ: "u",
            "ⓥ": "v",
            ｖ: "v",
            ṽ: "v",
            ṿ: "v",
            ʋ: "v",
            ꝟ: "v",
            ʌ: "v",
            ꝡ: "vy",
            "ⓦ": "w",
            ｗ: "w",
            ẁ: "w",
            ẃ: "w",
            ŵ: "w",
            ẇ: "w",
            ẅ: "w",
            ẘ: "w",
            ẉ: "w",
            ⱳ: "w",
            "ⓧ": "x",
            ｘ: "x",
            ẋ: "x",
            ẍ: "x",
            "ⓨ": "y",
            ｙ: "y",
            ỳ: "y",
            ý: "y",
            ŷ: "y",
            ỹ: "y",
            ȳ: "y",
            ẏ: "y",
            ÿ: "y",
            ỷ: "y",
            ẙ: "y",
            ỵ: "y",
            ƴ: "y",
            ɏ: "y",
            ỿ: "y",
            "ⓩ": "z",
            ｚ: "z",
            ź: "z",
            ẑ: "z",
            ż: "z",
            ž: "z",
            ẓ: "z",
            ẕ: "z",
            ƶ: "z",
            ȥ: "z",
            ɀ: "z",
            ⱬ: "z",
            ꝣ: "z",
            Ά: "Α",
            Έ: "Ε",
            Ή: "Η",
            Ί: "Ι",
            Ϊ: "Ι",
            Ό: "Ο",
            Ύ: "Υ",
            Ϋ: "Υ",
            Ώ: "Ω",
            ά: "α",
            έ: "ε",
            ή: "η",
            ί: "ι",
            ϊ: "ι",
            ΐ: "ι",
            ό: "ο",
            ύ: "υ",
            ϋ: "υ",
            ΰ: "υ",
            ώ: "ω",
            ς: "σ",
            "’": "'",
          };
        }),
        e.define("select2/data/base", ["../utils"], function (i) {
          function n(e, t) {
            n.__super__.constructor.call(this);
          }
          return (
            i.Extend(n, i.Observable),
            (n.prototype.current = function (e) {
              throw new Error(
                "The `current` method must be defined in child classes."
              );
            }),
            (n.prototype.query = function (e, t) {
              throw new Error(
                "The `query` method must be defined in child classes."
              );
            }),
            (n.prototype.bind = function (e, t) {}),
            (n.prototype.destroy = function () {}),
            (n.prototype.generateResultId = function (e, t) {
              var n = e.id + "-result-";
              return (
                (n += i.generateChars(4)),
                null != t.id
                  ? (n += "-" + t.id.toString())
                  : (n += "-" + i.generateChars(4)),
                n
              );
            }),
            n
          );
        }),
        e.define(
          "select2/data/select",
          ["./base", "../utils", "jquery"],
          function (e, a, l) {
            function n(e, t) {
              (this.$element = e),
                (this.options = t),
                n.__super__.constructor.call(this);
            }
            return (
              a.Extend(n, e),
              (n.prototype.current = function (e) {
                var n = [],
                  i = this;
                this.$element.find(":selected").each(function () {
                  var e = l(this),
                    t = i.item(e);
                  n.push(t);
                }),
                  e(n);
              }),
              (n.prototype.select = function (r) {
                var o = this;
                if (((r.selected = !0), l(r.element).is("option")))
                  return (
                    (r.element.selected = !0),
                    void this.$element.trigger("change")
                  );
                if (this.$element.prop("multiple"))
                  this.current(function (e) {
                    var t = [];
                    (r = [r]).push.apply(r, e);
                    for (var n = 0; n < r.length; n++) {
                      var i = r[n].id;
                      -1 === l.inArray(i, t) && t.push(i);
                    }
                    o.$element.val(t), o.$element.trigger("change");
                  });
                else {
                  var e = r.id;
                  this.$element.val(e), this.$element.trigger("change");
                }
              }),
              (n.prototype.unselect = function (r) {
                var o = this;
                if (this.$element.prop("multiple")) {
                  if (((r.selected = !1), l(r.element).is("option")))
                    return (
                      (r.element.selected = !1),
                      void this.$element.trigger("change")
                    );
                  this.current(function (e) {
                    for (var t = [], n = 0; n < e.length; n++) {
                      var i = e[n].id;
                      i !== r.id && -1 === l.inArray(i, t) && t.push(i);
                    }
                    o.$element.val(t), o.$element.trigger("change");
                  });
                }
              }),
              (n.prototype.bind = function (e, t) {
                var n = this;
                (this.container = e).on("select", function (e) {
                  n.select(e.data);
                }),
                  e.on("unselect", function (e) {
                    n.unselect(e.data);
                  });
              }),
              (n.prototype.destroy = function () {
                this.$element.find("*").each(function () {
                  a.RemoveData(this);
                });
              }),
              (n.prototype.query = function (i, e) {
                var r = [],
                  o = this;
                this.$element.children().each(function () {
                  var e = l(this);
                  if (e.is("option") || e.is("optgroup")) {
                    var t = o.item(e),
                      n = o.matches(i, t);
                    null !== n && r.push(n);
                  }
                }),
                  e({ results: r });
              }),
              (n.prototype.addOptions = function (e) {
                a.appendMany(this.$element, e);
              }),
              (n.prototype.option = function (e) {
                var t;
                e.children
                  ? ((t = document.createElement("optgroup")).label = e.text)
                  : void 0 !==
                    (t = document.createElement("option")).textContent
                  ? (t.textContent = e.text)
                  : (t.innerText = e.text),
                  void 0 !== e.id && (t.value = e.id),
                  e.disabled && (t.disabled = !0),
                  e.selected && (t.selected = !0),
                  e.title && (t.title = e.title);
                var n = l(t),
                  i = this._normalizeItem(e);
                return (i.element = t), a.StoreData(t, "data", i), n;
              }),
              (n.prototype.item = function (e) {
                var t = {};
                if (null != (t = a.GetData(e[0], "data"))) return t;
                if (e.is("option"))
                  t = {
                    id: e.val(),
                    text: e.text(),
                    disabled: e.prop("disabled"),
                    selected: e.prop("selected"),
                    title: e.prop("title"),
                  };
                else if (e.is("optgroup")) {
                  t = {
                    text: e.prop("label"),
                    children: [],
                    title: e.prop("title"),
                  };
                  for (
                    var n = e.children("option"), i = [], r = 0;
                    r < n.length;
                    r++
                  ) {
                    var o = l(n[r]),
                      s = this.item(o);
                    i.push(s);
                  }
                  t.children = i;
                }
                return (
                  ((t = this._normalizeItem(t)).element = e[0]),
                  a.StoreData(e[0], "data", t),
                  t
                );
              }),
              (n.prototype._normalizeItem = function (e) {
                e !== Object(e) && (e = { id: e, text: e });
                return (
                  null != (e = l.extend({}, { text: "" }, e)).id &&
                    (e.id = e.id.toString()),
                  null != e.text && (e.text = e.text.toString()),
                  null == e._resultId &&
                    e.id &&
                    null != this.container &&
                    (e._resultId = this.generateResultId(this.container, e)),
                  l.extend({}, { selected: !1, disabled: !1 }, e)
                );
              }),
              (n.prototype.matches = function (e, t) {
                return this.options.get("matcher")(e, t);
              }),
              n
            );
          }
        ),
        e.define(
          "select2/data/array",
          ["./select", "../utils", "jquery"],
          function (e, f, g) {
            function i(e, t) {
              var n = t.get("data") || [];
              i.__super__.constructor.call(this, e, t),
                this.addOptions(this.convertToOptions(n));
            }
            return (
              f.Extend(i, e),
              (i.prototype.select = function (n) {
                var e = this.$element.find("option").filter(function (e, t) {
                  return t.value == n.id.toString();
                });
                0 === e.length && ((e = this.option(n)), this.addOptions(e)),
                  i.__super__.select.call(this, n);
              }),
              (i.prototype.convertToOptions = function (e) {
                var t = this,
                  n = this.$element.find("option"),
                  i = n
                    .map(function () {
                      return t.item(g(this)).id;
                    })
                    .get(),
                  r = [];
                function o(e) {
                  return function () {
                    return g(this).val() == e.id;
                  };
                }
                for (var s = 0; s < e.length; s++) {
                  var a = this._normalizeItem(e[s]);
                  if (0 <= g.inArray(a.id, i)) {
                    var l = n.filter(o(a)),
                      c = this.item(l),
                      u = g.extend(!0, {}, a, c),
                      d = this.option(u);
                    l.replaceWith(d);
                  } else {
                    var p = this.option(a);
                    if (a.children) {
                      var h = this.convertToOptions(a.children);
                      f.appendMany(p, h);
                    }
                    r.push(p);
                  }
                }
                return r;
              }),
              i
            );
          }
        ),
        e.define(
          "select2/data/ajax",
          ["./array", "../utils", "jquery"],
          function (e, t, o) {
            function n(e, t) {
              (this.ajaxOptions = this._applyDefaults(t.get("ajax"))),
                null != this.ajaxOptions.processResults &&
                  (this.processResults = this.ajaxOptions.processResults),
                n.__super__.constructor.call(this, e, t);
            }
            return (
              t.Extend(n, e),
              (n.prototype._applyDefaults = function (e) {
                var t = {
                  data: function (e) {
                    return o.extend({}, e, { q: e.term });
                  },
                  transport: function (e, t, n) {
                    var i = o.ajax(e);
                    return i.then(t), i.fail(n), i;
                  },
                };
                return o.extend({}, t, e, !0);
              }),
              (n.prototype.processResults = function (e) {
                return e;
              }),
              (n.prototype.query = function (n, i) {
                var r = this;
                null != this._request &&
                  (o.isFunction(this._request.abort) && this._request.abort(),
                  (this._request = null));
                var t = o.extend({ type: "GET" }, this.ajaxOptions);
                function e() {
                  var e = t.transport(
                    t,
                    function (e) {
                      var t = r.processResults(e, n);
                      r.options.get("debug") &&
                        window.console &&
                        console.error &&
                        ((t && t.results && o.isArray(t.results)) ||
                          console.error(
                            "Select2: The AJAX results did not return an array in the `results` key of the response."
                          )),
                        i(t);
                    },
                    function () {
                      ("status" in e && (0 === e.status || "0" === e.status)) ||
                        r.trigger("results:message", {
                          message: "errorLoading",
                        });
                    }
                  );
                  r._request = e;
                }
                "function" == typeof t.url &&
                  (t.url = t.url.call(this.$element, n)),
                  "function" == typeof t.data &&
                    (t.data = t.data.call(this.$element, n)),
                  this.ajaxOptions.delay && null != n.term
                    ? (this._queryTimeout &&
                        window.clearTimeout(this._queryTimeout),
                      (this._queryTimeout = window.setTimeout(
                        e,
                        this.ajaxOptions.delay
                      )))
                    : e();
              }),
              n
            );
          }
        ),
        e.define("select2/data/tags", ["jquery"], function (u) {
          function e(e, t, n) {
            var i = n.get("tags"),
              r = n.get("createTag");
            void 0 !== r && (this.createTag = r);
            var o = n.get("insertTag");
            if (
              (void 0 !== o && (this.insertTag = o),
              e.call(this, t, n),
              u.isArray(i))
            )
              for (var s = 0; s < i.length; s++) {
                var a = i[s],
                  l = this._normalizeItem(a),
                  c = this.option(l);
                this.$element.append(c);
              }
          }
          return (
            (e.prototype.query = function (e, c, u) {
              var d = this;
              this._removeOldTags(),
                null != c.term && null == c.page
                  ? e.call(this, c, function e(t, n) {
                      for (var i = t.results, r = 0; r < i.length; r++) {
                        var o = i[r],
                          s =
                            null != o.children &&
                            !e({ results: o.children }, !0);
                        if (
                          (o.text || "").toUpperCase() ===
                            (c.term || "").toUpperCase() ||
                          s
                        )
                          return !n && ((t.data = i), void u(t));
                      }
                      if (n) return !0;
                      var a = d.createTag(c);
                      if (null != a) {
                        var l = d.option(a);
                        l.attr("data-select2-tag", !0),
                          d.addOptions([l]),
                          d.insertTag(i, a);
                      }
                      (t.results = i), u(t);
                    })
                  : e.call(this, c, u);
            }),
            (e.prototype.createTag = function (e, t) {
              var n = u.trim(t.term);
              return "" === n ? null : { id: n, text: n };
            }),
            (e.prototype.insertTag = function (e, t, n) {
              t.unshift(n);
            }),
            (e.prototype._removeOldTags = function (e) {
              this._lastTag;
              this.$element.find("option[data-select2-tag]").each(function () {
                this.selected || u(this).remove();
              });
            }),
            e
          );
        }),
        e.define("select2/data/tokenizer", ["jquery"], function (d) {
          function e(e, t, n) {
            var i = n.get("tokenizer");
            void 0 !== i && (this.tokenizer = i), e.call(this, t, n);
          }
          return (
            (e.prototype.bind = function (e, t, n) {
              e.call(this, t, n),
                (this.$search =
                  t.dropdown.$search ||
                  t.selection.$search ||
                  n.find(".select2-search__field"));
            }),
            (e.prototype.query = function (e, t, n) {
              var i = this;
              t.term = t.term || "";
              var r = this.tokenizer(t, this.options, function (e) {
                var t = i._normalizeItem(e);
                if (
                  !i.$element.find("option").filter(function () {
                    return d(this).val() === t.id;
                  }).length
                ) {
                  var n = i.option(t);
                  n.attr("data-select2-tag", !0),
                    i._removeOldTags(),
                    i.addOptions([n]);
                }
                !(function (e) {
                  i.trigger("select", { data: e });
                })(t);
              });
              r.term !== t.term &&
                (this.$search.length &&
                  (this.$search.val(r.term), this.$search.focus()),
                (t.term = r.term)),
                e.call(this, t, n);
            }),
            (e.prototype.tokenizer = function (e, t, n, i) {
              for (
                var r = n.get("tokenSeparators") || [],
                  o = t.term,
                  s = 0,
                  a =
                    this.createTag ||
                    function (e) {
                      return { id: e.term, text: e.term };
                    };
                s < o.length;

              ) {
                var l = o[s];
                if (-1 !== d.inArray(l, r)) {
                  var c = o.substr(0, s),
                    u = a(d.extend({}, t, { term: c }));
                  null != u
                    ? (i(u), (o = o.substr(s + 1) || ""), (s = 0))
                    : s++;
                } else s++;
              }
              return { term: o };
            }),
            e
          );
        }),
        e.define("select2/data/minimumInputLength", [], function () {
          function e(e, t, n) {
            (this.minimumInputLength = n.get("minimumInputLength")),
              e.call(this, t, n);
          }
          return (
            (e.prototype.query = function (e, t, n) {
              (t.term = t.term || ""),
                t.term.length < this.minimumInputLength
                  ? this.trigger("results:message", {
                      message: "inputTooShort",
                      args: {
                        minimum: this.minimumInputLength,
                        input: t.term,
                        params: t,
                      },
                    })
                  : e.call(this, t, n);
            }),
            e
          );
        }),
        e.define("select2/data/maximumInputLength", [], function () {
          function e(e, t, n) {
            (this.maximumInputLength = n.get("maximumInputLength")),
              e.call(this, t, n);
          }
          return (
            (e.prototype.query = function (e, t, n) {
              (t.term = t.term || ""),
                0 < this.maximumInputLength &&
                t.term.length > this.maximumInputLength
                  ? this.trigger("results:message", {
                      message: "inputTooLong",
                      args: {
                        maximum: this.maximumInputLength,
                        input: t.term,
                        params: t,
                      },
                    })
                  : e.call(this, t, n);
            }),
            e
          );
        }),
        e.define("select2/data/maximumSelectionLength", [], function () {
          function e(e, t, n) {
            (this.maximumSelectionLength = n.get("maximumSelectionLength")),
              e.call(this, t, n);
          }
          return (
            (e.prototype.query = function (n, i, r) {
              var o = this;
              this.current(function (e) {
                var t = null != e ? e.length : 0;
                0 < o.maximumSelectionLength && t >= o.maximumSelectionLength
                  ? o.trigger("results:message", {
                      message: "maximumSelected",
                      args: { maximum: o.maximumSelectionLength },
                    })
                  : n.call(o, i, r);
              });
            }),
            e
          );
        }),
        e.define("select2/dropdown", ["jquery", "./utils"], function (t, e) {
          function n(e, t) {
            (this.$element = e),
              (this.options = t),
              n.__super__.constructor.call(this);
          }
          return (
            e.Extend(n, e.Observable),
            (n.prototype.render = function () {
              var e = t(
                '<span class="select2-dropdown"><span class="select2-results"></span></span>'
              );
              return (
                e.attr("dir", this.options.get("dir")), (this.$dropdown = e)
              );
            }),
            (n.prototype.bind = function () {}),
            (n.prototype.position = function (e, t) {}),
            (n.prototype.destroy = function () {
              this.$dropdown.remove();
            }),
            n
          );
        }),
        e.define("select2/dropdown/search", ["jquery", "../utils"], function (
          r,
          e
        ) {
          function t() {}
          return (
            (t.prototype.render = function (e) {
              var t = e.call(this),
                n = r(
                  '<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="textbox" /></span>'
                );
              return (
                (this.$searchContainer = n),
                (this.$search = n.find("input")),
                t.prepend(n),
                t
              );
            }),
            (t.prototype.bind = function (e, t, n) {
              var i = this;
              e.call(this, t, n),
                this.$search.on("keydown", function (e) {
                  i.trigger("keypress", e),
                    (i._keyUpPrevented = e.isDefaultPrevented());
                }),
                this.$search.on("input", function (e) {
                  r(this).off("keyup");
                }),
                this.$search.on("keyup input", function (e) {
                  i.handleSearch(e);
                }),
                t.on("open", function () {
                  i.$search.attr("tabindex", 0),
                    i.$search.focus(),
                    window.setTimeout(function () {
                      i.$search.focus();
                    }, 0);
                }),
                t.on("close", function () {
                  i.$search.attr("tabindex", -1),
                    i.$search.val(""),
                    i.$search.blur();
                }),
                t.on("focus", function () {
                  t.isOpen() || i.$search.focus();
                }),
                t.on("results:all", function (e) {
                  (null != e.query.term && "" !== e.query.term) ||
                    (i.showSearch(e)
                      ? i.$searchContainer.removeClass("select2-search--hide")
                      : i.$searchContainer.addClass("select2-search--hide"));
                });
            }),
            (t.prototype.handleSearch = function (e) {
              if (!this._keyUpPrevented) {
                var t = this.$search.val();
                this.trigger("query", { term: t });
              }
              this._keyUpPrevented = !1;
            }),
            (t.prototype.showSearch = function (e, t) {
              return !0;
            }),
            t
          );
        }),
        e.define("select2/dropdown/hidePlaceholder", [], function () {
          function e(e, t, n, i) {
            (this.placeholder = this.normalizePlaceholder(
              n.get("placeholder")
            )),
              e.call(this, t, n, i);
          }
          return (
            (e.prototype.append = function (e, t) {
              (t.results = this.removePlaceholder(t.results)), e.call(this, t);
            }),
            (e.prototype.normalizePlaceholder = function (e, t) {
              return "string" == typeof t && (t = { id: "", text: t }), t;
            }),
            (e.prototype.removePlaceholder = function (e, t) {
              for (var n = t.slice(0), i = t.length - 1; 0 <= i; i--) {
                var r = t[i];
                this.placeholder.id === r.id && n.splice(i, 1);
              }
              return n;
            }),
            e
          );
        }),
        e.define("select2/dropdown/infiniteScroll", ["jquery"], function (r) {
          function e(e, t, n, i) {
            (this.lastParams = {}),
              e.call(this, t, n, i),
              (this.$loadingMore = this.createLoadingMore()),
              (this.loading = !1);
          }
          return (
            (e.prototype.append = function (e, t) {
              this.$loadingMore.remove(),
                (this.loading = !1),
                e.call(this, t),
                this.showLoadingMore(t) &&
                  this.$results.append(this.$loadingMore);
            }),
            (e.prototype.bind = function (e, t, n) {
              var i = this;
              e.call(this, t, n),
                t.on("query", function (e) {
                  (i.lastParams = e), (i.loading = !0);
                }),
                t.on("query:append", function (e) {
                  (i.lastParams = e), (i.loading = !0);
                }),
                this.$results.on("scroll", function () {
                  var e = r.contains(
                    document.documentElement,
                    i.$loadingMore[0]
                  );
                  if (!i.loading && e) {
                    var t =
                      i.$results.offset().top + i.$results.outerHeight(!1);
                    i.$loadingMore.offset().top +
                      i.$loadingMore.outerHeight(!1) <=
                      t + 50 && i.loadMore();
                  }
                });
            }),
            (e.prototype.loadMore = function () {
              this.loading = !0;
              var e = r.extend({}, { page: 1 }, this.lastParams);
              e.page++, this.trigger("query:append", e);
            }),
            (e.prototype.showLoadingMore = function (e, t) {
              return t.pagination && t.pagination.more;
            }),
            (e.prototype.createLoadingMore = function () {
              var e = r(
                  '<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'
                ),
                t = this.options.get("translations").get("loadingMore");
              return e.html(t(this.lastParams)), e;
            }),
            e
          );
        }),
        e.define(
          "select2/dropdown/attachBody",
          ["jquery", "../utils"],
          function (f, a) {
            function e(e, t, n) {
              (this.$dropdownParent =
                n.get("dropdownParent") || f(document.body)),
                e.call(this, t, n);
            }
            return (
              (e.prototype.bind = function (e, t, n) {
                var i = this,
                  r = !1;
                e.call(this, t, n),
                  t.on("open", function () {
                    i._showDropdown(),
                      i._attachPositioningHandler(t),
                      r ||
                        ((r = !0),
                        t.on("results:all", function () {
                          i._positionDropdown(), i._resizeDropdown();
                        }),
                        t.on("results:append", function () {
                          i._positionDropdown(), i._resizeDropdown();
                        }));
                  }),
                  t.on("close", function () {
                    i._hideDropdown(), i._detachPositioningHandler(t);
                  }),
                  this.$dropdownContainer.on("mousedown", function (e) {
                    e.stopPropagation();
                  });
              }),
              (e.prototype.destroy = function (e) {
                e.call(this), this.$dropdownContainer.remove();
              }),
              (e.prototype.position = function (e, t, n) {
                t.attr("class", n.attr("class")),
                  t.removeClass("select2"),
                  t.addClass("select2-container--open"),
                  t.css({ position: "absolute", top: -999999 }),
                  (this.$container = n);
              }),
              (e.prototype.render = function (e) {
                var t = f("<span></span>"),
                  n = e.call(this);
                return t.append(n), (this.$dropdownContainer = t);
              }),
              (e.prototype._hideDropdown = function (e) {
                this.$dropdownContainer.detach();
              }),
              (e.prototype._attachPositioningHandler = function (e, t) {
                var n = this,
                  i = "scroll.select2." + t.id,
                  r = "resize.select2." + t.id,
                  o = "orientationchange.select2." + t.id,
                  s = this.$container.parents().filter(a.hasScroll);
                s.each(function () {
                  a.StoreData(this, "select2-scroll-position", {
                    x: f(this).scrollLeft(),
                    y: f(this).scrollTop(),
                  });
                }),
                  s.on(i, function (e) {
                    var t = a.GetData(this, "select2-scroll-position");
                    f(this).scrollTop(t.y);
                  }),
                  f(window).on(i + " " + r + " " + o, function (e) {
                    n._positionDropdown(), n._resizeDropdown();
                  });
              }),
              (e.prototype._detachPositioningHandler = function (e, t) {
                var n = "scroll.select2." + t.id,
                  i = "resize.select2." + t.id,
                  r = "orientationchange.select2." + t.id;
                this.$container.parents().filter(a.hasScroll).off(n),
                  f(window).off(n + " " + i + " " + r);
              }),
              (e.prototype._positionDropdown = function () {
                var e = f(window),
                  t = this.$dropdown.hasClass("select2-dropdown--above"),
                  n = this.$dropdown.hasClass("select2-dropdown--below"),
                  i = null,
                  r = this.$container.offset();
                r.bottom = r.top + this.$container.outerHeight(!1);
                var o = { height: this.$container.outerHeight(!1) };
                (o.top = r.top), (o.bottom = r.top + o.height);
                var s = this.$dropdown.outerHeight(!1),
                  a = e.scrollTop(),
                  l = e.scrollTop() + e.height(),
                  c = a < r.top - s,
                  u = l > r.bottom + s,
                  d = { left: r.left, top: o.bottom },
                  p = this.$dropdownParent;
                "static" === p.css("position") && (p = p.offsetParent());
                var h = p.offset();
                (d.top -= h.top),
                  (d.left -= h.left),
                  t || n || (i = "below"),
                  u || !c || t ? !c && u && t && (i = "below") : (i = "above"),
                  ("above" == i || (t && "below" !== i)) &&
                    (d.top = o.top - h.top - s),
                  null != i &&
                    (this.$dropdown
                      .removeClass(
                        "select2-dropdown--below select2-dropdown--above"
                      )
                      .addClass("select2-dropdown--" + i),
                    this.$container
                      .removeClass(
                        "select2-container--below select2-container--above"
                      )
                      .addClass("select2-container--" + i)),
                  this.$dropdownContainer.css(d);
              }),
              (e.prototype._resizeDropdown = function () {
                var e = { width: this.$container.outerWidth(!1) + "px" };
                this.options.get("dropdownAutoWidth") &&
                  ((e.minWidth = e.width),
                  (e.position = "relative"),
                  (e.width = "auto")),
                  this.$dropdown.css(e);
              }),
              (e.prototype._showDropdown = function (e) {
                this.$dropdownContainer.appendTo(this.$dropdownParent),
                  this._positionDropdown(),
                  this._resizeDropdown();
              }),
              e
            );
          }
        ),
        e.define("select2/dropdown/minimumResultsForSearch", [], function () {
          function e(e, t, n, i) {
            (this.minimumResultsForSearch = n.get("minimumResultsForSearch")),
              this.minimumResultsForSearch < 0 &&
                (this.minimumResultsForSearch = 1 / 0),
              e.call(this, t, n, i);
          }
          return (
            (e.prototype.showSearch = function (e, t) {
              return (
                !(
                  (function e(t) {
                    for (var n = 0, i = 0; i < t.length; i++) {
                      var r = t[i];
                      r.children ? (n += e(r.children)) : n++;
                    }
                    return n;
                  })(t.data.results) < this.minimumResultsForSearch
                ) && e.call(this, t)
              );
            }),
            e
          );
        }),
        e.define("select2/dropdown/selectOnClose", ["../utils"], function (o) {
          function e() {}
          return (
            (e.prototype.bind = function (e, t, n) {
              var i = this;
              e.call(this, t, n),
                t.on("close", function (e) {
                  i._handleSelectOnClose(e);
                });
            }),
            (e.prototype._handleSelectOnClose = function (e, t) {
              if (t && null != t.originalSelect2Event) {
                var n = t.originalSelect2Event;
                if ("select" === n._type || "unselect" === n._type) return;
              }
              var i = this.getHighlightedResults();
              if (!(i.length < 1)) {
                var r = o.GetData(i[0], "data");
                (null != r.element && r.element.selected) ||
                  (null == r.element && r.selected) ||
                  this.trigger("select", { data: r });
              }
            }),
            e
          );
        }),
        e.define("select2/dropdown/closeOnSelect", [], function () {
          function e() {}
          return (
            (e.prototype.bind = function (e, t, n) {
              var i = this;
              e.call(this, t, n),
                t.on("select", function (e) {
                  i._selectTriggered(e);
                }),
                t.on("unselect", function (e) {
                  i._selectTriggered(e);
                });
            }),
            (e.prototype._selectTriggered = function (e, t) {
              var n = t.originalEvent;
              (n && (n.ctrlKey || n.metaKey)) ||
                this.trigger("close", {
                  originalEvent: n,
                  originalSelect2Event: t,
                });
            }),
            e
          );
        }),
        e.define("select2/i18n/en", [], function () {
          return {
            errorLoading: function () {
              return "The results could not be loaded.";
            },
            inputTooLong: function (e) {
              var t = e.input.length - e.maximum,
                n = "Please delete " + t + " character";
              return 1 != t && (n += "s"), n;
            },
            inputTooShort: function (e) {
              return (
                "Please enter " +
                (e.minimum - e.input.length) +
                " or more characters"
              );
            },
            loadingMore: function () {
              return "Loading more results…";
            },
            maximumSelected: function (e) {
              var t = "You can only select " + e.maximum + " item";
              return 1 != e.maximum && (t += "s"), t;
            },
            noResults: function () {
              return "No results found";
            },
            searching: function () {
              return "Searching…";
            },
            removeAllItems: function () {
              return "Remove all items";
            },
          };
        }),
        e.define(
          "select2/defaults",
          [
            "jquery",
            "require",
            "./results",
            "./selection/single",
            "./selection/multiple",
            "./selection/placeholder",
            "./selection/allowClear",
            "./selection/search",
            "./selection/eventRelay",
            "./utils",
            "./translation",
            "./diacritics",
            "./data/select",
            "./data/array",
            "./data/ajax",
            "./data/tags",
            "./data/tokenizer",
            "./data/minimumInputLength",
            "./data/maximumInputLength",
            "./data/maximumSelectionLength",
            "./dropdown",
            "./dropdown/search",
            "./dropdown/hidePlaceholder",
            "./dropdown/infiniteScroll",
            "./dropdown/attachBody",
            "./dropdown/minimumResultsForSearch",
            "./dropdown/selectOnClose",
            "./dropdown/closeOnSelect",
            "./i18n/en",
          ],
          function (
            f,
            g,
            m,
            v,
            y,
            _,
            w,
            $,
            b,
            A,
            x,
            t,
            S,
            D,
            C,
            E,
            O,
            q,
            T,
            j,
            L,
            k,
            P,
            I,
            M,
            R,
            U,
            z,
            e
          ) {
            function n() {
              this.reset();
            }
            return (
              (n.prototype.apply = function (t) {
                if (
                  null == (t = f.extend(!0, {}, this.defaults, t)).dataAdapter
                ) {
                  if (
                    (null != t.ajax
                      ? (t.dataAdapter = C)
                      : null != t.data
                      ? (t.dataAdapter = D)
                      : (t.dataAdapter = S),
                    0 < t.minimumInputLength &&
                      (t.dataAdapter = A.Decorate(t.dataAdapter, q)),
                    0 < t.maximumInputLength &&
                      (t.dataAdapter = A.Decorate(t.dataAdapter, T)),
                    0 < t.maximumSelectionLength &&
                      (t.dataAdapter = A.Decorate(t.dataAdapter, j)),
                    t.tags && (t.dataAdapter = A.Decorate(t.dataAdapter, E)),
                    (null == t.tokenSeparators && null == t.tokenizer) ||
                      (t.dataAdapter = A.Decorate(t.dataAdapter, O)),
                    null != t.query)
                  ) {
                    var e = g(t.amdBase + "compat/query");
                    t.dataAdapter = A.Decorate(t.dataAdapter, e);
                  }
                  if (null != t.initSelection) {
                    var n = g(t.amdBase + "compat/initSelection");
                    t.dataAdapter = A.Decorate(t.dataAdapter, n);
                  }
                }
                if (
                  (null == t.resultsAdapter &&
                    ((t.resultsAdapter = m),
                    null != t.ajax &&
                      (t.resultsAdapter = A.Decorate(t.resultsAdapter, I)),
                    null != t.placeholder &&
                      (t.resultsAdapter = A.Decorate(t.resultsAdapter, P)),
                    t.selectOnClose &&
                      (t.resultsAdapter = A.Decorate(t.resultsAdapter, U))),
                  null == t.dropdownAdapter)
                ) {
                  if (t.multiple) t.dropdownAdapter = L;
                  else {
                    var i = A.Decorate(L, k);
                    t.dropdownAdapter = i;
                  }
                  if (
                    (0 !== t.minimumResultsForSearch &&
                      (t.dropdownAdapter = A.Decorate(t.dropdownAdapter, R)),
                    t.closeOnSelect &&
                      (t.dropdownAdapter = A.Decorate(t.dropdownAdapter, z)),
                    null != t.dropdownCssClass ||
                      null != t.dropdownCss ||
                      null != t.adaptDropdownCssClass)
                  ) {
                    var r = g(t.amdBase + "compat/dropdownCss");
                    t.dropdownAdapter = A.Decorate(t.dropdownAdapter, r);
                  }
                  t.dropdownAdapter = A.Decorate(t.dropdownAdapter, M);
                }
                if (null == t.selectionAdapter) {
                  if (
                    (t.multiple
                      ? (t.selectionAdapter = y)
                      : (t.selectionAdapter = v),
                    null != t.placeholder &&
                      (t.selectionAdapter = A.Decorate(t.selectionAdapter, _)),
                    t.allowClear &&
                      (t.selectionAdapter = A.Decorate(t.selectionAdapter, w)),
                    t.multiple &&
                      (t.selectionAdapter = A.Decorate(t.selectionAdapter, $)),
                    null != t.containerCssClass ||
                      null != t.containerCss ||
                      null != t.adaptContainerCssClass)
                  ) {
                    var o = g(t.amdBase + "compat/containerCss");
                    t.selectionAdapter = A.Decorate(t.selectionAdapter, o);
                  }
                  t.selectionAdapter = A.Decorate(t.selectionAdapter, b);
                }
                if ("string" == typeof t.language)
                  if (0 < t.language.indexOf("-")) {
                    var s = t.language.split("-")[0];
                    t.language = [t.language, s];
                  } else t.language = [t.language];
                if (f.isArray(t.language)) {
                  var a = new x();
                  t.language.push("en");
                  for (var l = t.language, c = 0; c < l.length; c++) {
                    var u = l[c],
                      d = {};
                    try {
                      d = x.loadPath(u);
                    } catch (e) {
                      try {
                        (u = this.defaults.amdLanguageBase + u),
                          (d = x.loadPath(u));
                      } catch (e) {
                        t.debug &&
                          window.console &&
                          console.warn &&
                          console.warn(
                            'Select2: The language file for "' +
                              u +
                              '" could not be automatically loaded. A fallback will be used instead.'
                          );
                        continue;
                      }
                    }
                    a.extend(d);
                  }
                  t.translations = a;
                } else {
                  var p = x.loadPath(this.defaults.amdLanguageBase + "en"),
                    h = new x(t.language);
                  h.extend(p), (t.translations = h);
                }
                return t;
              }),
              (n.prototype.reset = function () {
                function a(e) {
                  return e.replace(/[^\u0000-\u007E]/g, function (e) {
                    return t[e] || e;
                  });
                }
                this.defaults = {
                  amdBase: "./",
                  amdLanguageBase: "./i18n/",
                  closeOnSelect: !0,
                  debug: !1,
                  dropdownAutoWidth: !1,
                  escapeMarkup: A.escapeMarkup,
                  language: e,
                  matcher: function e(t, n) {
                    if ("" === f.trim(t.term)) return n;
                    if (n.children && 0 < n.children.length) {
                      for (
                        var i = f.extend(!0, {}, n), r = n.children.length - 1;
                        0 <= r;
                        r--
                      )
                        null == e(t, n.children[r]) && i.children.splice(r, 1);
                      return 0 < i.children.length ? i : e(t, i);
                    }
                    var o = a(n.text).toUpperCase(),
                      s = a(t.term).toUpperCase();
                    return -1 < o.indexOf(s) ? n : null;
                  },
                  minimumInputLength: 0,
                  maximumInputLength: 0,
                  maximumSelectionLength: 0,
                  minimumResultsForSearch: 0,
                  selectOnClose: !1,
                  scrollAfterSelect: !1,
                  sorter: function (e) {
                    return e;
                  },
                  templateResult: function (e) {
                    return e.text;
                  },
                  templateSelection: function (e) {
                    return e.text;
                  },
                  theme: "default",
                  width: "resolve",
                };
              }),
              (n.prototype.set = function (e, t) {
                var n = {};
                n[f.camelCase(e)] = t;
                var i = A._convertData(n);
                f.extend(!0, this.defaults, i);
              }),
              new n()
            );
          }
        ),
        e.define(
          "select2/options",
          ["require", "jquery", "./defaults", "./utils"],
          function (i, d, r, p) {
            function e(e, t) {
              if (
                ((this.options = e),
                null != t && this.fromElement(t),
                (this.options = r.apply(this.options)),
                t && t.is("input"))
              ) {
                var n = i(this.get("amdBase") + "compat/inputData");
                this.options.dataAdapter = p.Decorate(
                  this.options.dataAdapter,
                  n
                );
              }
            }
            return (
              (e.prototype.fromElement = function (e) {
                var t = ["select2"];
                null == this.options.multiple &&
                  (this.options.multiple = e.prop("multiple")),
                  null == this.options.disabled &&
                    (this.options.disabled = e.prop("disabled")),
                  null == this.options.language &&
                    (e.prop("lang")
                      ? (this.options.language = e.prop("lang").toLowerCase())
                      : e.closest("[lang]").prop("lang") &&
                        (this.options.language = e
                          .closest("[lang]")
                          .prop("lang"))),
                  null == this.options.dir &&
                    (e.prop("dir")
                      ? (this.options.dir = e.prop("dir"))
                      : e.closest("[dir]").prop("dir")
                      ? (this.options.dir = e.closest("[dir]").prop("dir"))
                      : (this.options.dir = "ltr")),
                  e.prop("disabled", this.options.disabled),
                  e.prop("multiple", this.options.multiple),
                  p.GetData(e[0], "select2Tags") &&
                    (this.options.debug &&
                      window.console &&
                      console.warn &&
                      console.warn(
                        'Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'
                      ),
                    p.StoreData(e[0], "data", p.GetData(e[0], "select2Tags")),
                    p.StoreData(e[0], "tags", !0)),
                  p.GetData(e[0], "ajaxUrl") &&
                    (this.options.debug &&
                      window.console &&
                      console.warn &&
                      console.warn(
                        "Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."
                      ),
                    e.attr("ajax--url", p.GetData(e[0], "ajaxUrl")),
                    p.StoreData(e[0], "ajax-Url", p.GetData(e[0], "ajaxUrl")));
                var n = {};
                function i(e, t) {
                  return t.toUpperCase();
                }
                for (var r = 0; r < e[0].attributes.length; r++) {
                  var o = e[0].attributes[r].name,
                    s = "data-";
                  if (o.substr(0, s.length) == s) {
                    var a = o.substring(s.length),
                      l = p.GetData(e[0], a);
                    n[a.replace(/-([a-z])/g, i)] = l;
                  }
                }
                d.fn.jquery &&
                  "1." == d.fn.jquery.substr(0, 2) &&
                  e[0].dataset &&
                  (n = d.extend(!0, {}, e[0].dataset, n));
                var c = d.extend(!0, {}, p.GetData(e[0]), n);
                for (var u in (c = p._convertData(c)))
                  -1 < d.inArray(u, t) ||
                    (d.isPlainObject(this.options[u])
                      ? d.extend(this.options[u], c[u])
                      : (this.options[u] = c[u]));
                return this;
              }),
              (e.prototype.get = function (e) {
                return this.options[e];
              }),
              (e.prototype.set = function (e, t) {
                this.options[e] = t;
              }),
              e
            );
          }
        ),
        e.define(
          "select2/core",
          ["jquery", "./options", "./utils", "./keys"],
          function (r, c, u, i) {
            var d = function (e, t) {
              null != u.GetData(e[0], "select2") &&
                u.GetData(e[0], "select2").destroy(),
                (this.$element = e),
                (this.id = this._generateId(e)),
                (t = t || {}),
                (this.options = new c(t, e)),
                d.__super__.constructor.call(this);
              var n = e.attr("tabindex") || 0;
              u.StoreData(e[0], "old-tabindex", n), e.attr("tabindex", "-1");
              var i = this.options.get("dataAdapter");
              this.dataAdapter = new i(e, this.options);
              var r = this.render();
              this._placeContainer(r);
              var o = this.options.get("selectionAdapter");
              (this.selection = new o(e, this.options)),
                (this.$selection = this.selection.render()),
                this.selection.position(this.$selection, r);
              var s = this.options.get("dropdownAdapter");
              (this.dropdown = new s(e, this.options)),
                (this.$dropdown = this.dropdown.render()),
                this.dropdown.position(this.$dropdown, r);
              var a = this.options.get("resultsAdapter");
              (this.results = new a(e, this.options, this.dataAdapter)),
                (this.$results = this.results.render()),
                this.results.position(this.$results, this.$dropdown);
              var l = this;
              this._bindAdapters(),
                this._registerDomEvents(),
                this._registerDataEvents(),
                this._registerSelectionEvents(),
                this._registerDropdownEvents(),
                this._registerResultsEvents(),
                this._registerEvents(),
                this.dataAdapter.current(function (e) {
                  l.trigger("selection:update", { data: e });
                }),
                e.addClass("select2-hidden-accessible"),
                e.attr("aria-hidden", "true"),
                this._syncAttributes(),
                u.StoreData(e[0], "select2", this),
                e.data("select2", this);
            };
            return (
              u.Extend(d, u.Observable),
              (d.prototype._generateId = function (e) {
                return (
                  "select2-" +
                  (null != e.attr("id")
                    ? e.attr("id")
                    : null != e.attr("name")
                    ? e.attr("name") + "-" + u.generateChars(2)
                    : u.generateChars(4)
                  ).replace(/(:|\.|\[|\]|,)/g, "")
                );
              }),
              (d.prototype._placeContainer = function (e) {
                e.insertAfter(this.$element);
                var t = this._resolveWidth(
                  this.$element,
                  this.options.get("width")
                );
                null != t && e.css("width", t);
              }),
              (d.prototype._resolveWidth = function (e, t) {
                var n = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
                if ("resolve" == t) {
                  var i = this._resolveWidth(e, "style");
                  return null != i ? i : this._resolveWidth(e, "element");
                }
                if ("element" == t) {
                  var r = e.outerWidth(!1);
                  return r <= 0 ? "auto" : r + "px";
                }
                if ("style" != t) return t;
                var o = e.attr("style");
                if ("string" != typeof o) return null;
                for (var s = o.split(";"), a = 0, l = s.length; a < l; a += 1) {
                  var c = s[a].replace(/\s/g, "").match(n);
                  if (null !== c && 1 <= c.length) return c[1];
                }
                return null;
              }),
              (d.prototype._bindAdapters = function () {
                this.dataAdapter.bind(this, this.$container),
                  this.selection.bind(this, this.$container),
                  this.dropdown.bind(this, this.$container),
                  this.results.bind(this, this.$container);
              }),
              (d.prototype._registerDomEvents = function () {
                var t = this;
                this.$element.on("change.select2", function () {
                  t.dataAdapter.current(function (e) {
                    t.trigger("selection:update", { data: e });
                  });
                }),
                  this.$element.on("focus.select2", function (e) {
                    t.trigger("focus", e);
                  }),
                  (this._syncA = u.bind(this._syncAttributes, this)),
                  (this._syncS = u.bind(this._syncSubtree, this)),
                  this.$element[0].attachEvent &&
                    this.$element[0].attachEvent(
                      "onpropertychange",
                      this._syncA
                    );
                var e =
                  window.MutationObserver ||
                  window.WebKitMutationObserver ||
                  window.MozMutationObserver;
                null != e
                  ? ((this._observer = new e(function (e) {
                      r.each(e, t._syncA), r.each(e, t._syncS);
                    })),
                    this._observer.observe(this.$element[0], {
                      attributes: !0,
                      childList: !0,
                      subtree: !1,
                    }))
                  : this.$element[0].addEventListener &&
                    (this.$element[0].addEventListener(
                      "DOMAttrModified",
                      t._syncA,
                      !1
                    ),
                    this.$element[0].addEventListener(
                      "DOMNodeInserted",
                      t._syncS,
                      !1
                    ),
                    this.$element[0].addEventListener(
                      "DOMNodeRemoved",
                      t._syncS,
                      !1
                    ));
              }),
              (d.prototype._registerDataEvents = function () {
                var n = this;
                this.dataAdapter.on("*", function (e, t) {
                  n.trigger(e, t);
                });
              }),
              (d.prototype._registerSelectionEvents = function () {
                var n = this,
                  i = ["toggle", "focus"];
                this.selection.on("toggle", function () {
                  n.toggleDropdown();
                }),
                  this.selection.on("focus", function (e) {
                    n.focus(e);
                  }),
                  this.selection.on("*", function (e, t) {
                    -1 === r.inArray(e, i) && n.trigger(e, t);
                  });
              }),
              (d.prototype._registerDropdownEvents = function () {
                var n = this;
                this.dropdown.on("*", function (e, t) {
                  n.trigger(e, t);
                });
              }),
              (d.prototype._registerResultsEvents = function () {
                var n = this;
                this.results.on("*", function (e, t) {
                  n.trigger(e, t);
                });
              }),
              (d.prototype._registerEvents = function () {
                var n = this;
                this.on("open", function () {
                  n.$container.addClass("select2-container--open");
                }),
                  this.on("close", function () {
                    n.$container.removeClass("select2-container--open");
                  }),
                  this.on("enable", function () {
                    n.$container.removeClass("select2-container--disabled");
                  }),
                  this.on("disable", function () {
                    n.$container.addClass("select2-container--disabled");
                  }),
                  this.on("blur", function () {
                    n.$container.removeClass("select2-container--focus");
                  }),
                  this.on("query", function (t) {
                    n.isOpen() || n.trigger("open", {}),
                      this.dataAdapter.query(t, function (e) {
                        n.trigger("results:all", { data: e, query: t });
                      });
                  }),
                  this.on("query:append", function (t) {
                    this.dataAdapter.query(t, function (e) {
                      n.trigger("results:append", { data: e, query: t });
                    });
                  }),
                  this.on("keypress", function (e) {
                    var t = e.which;
                    n.isOpen()
                      ? t === i.ESC || t === i.TAB || (t === i.UP && e.altKey)
                        ? (n.close(), e.preventDefault())
                        : t === i.ENTER
                        ? (n.trigger("results:select", {}), e.preventDefault())
                        : t === i.SPACE && e.ctrlKey
                        ? (n.trigger("results:toggle", {}), e.preventDefault())
                        : t === i.UP
                        ? (n.trigger("results:previous", {}),
                          e.preventDefault())
                        : t === i.DOWN &&
                          (n.trigger("results:next", {}), e.preventDefault())
                      : (t === i.ENTER ||
                          t === i.SPACE ||
                          (t === i.DOWN && e.altKey)) &&
                        (n.open(), e.preventDefault());
                  });
              }),
              (d.prototype._syncAttributes = function () {
                this.options.set("disabled", this.$element.prop("disabled")),
                  this.options.get("disabled")
                    ? (this.isOpen() && this.close(),
                      this.trigger("disable", {}))
                    : this.trigger("enable", {});
              }),
              (d.prototype._syncSubtree = function (e, t) {
                var n = !1,
                  i = this;
                if (
                  !e ||
                  !e.target ||
                  "OPTION" === e.target.nodeName ||
                  "OPTGROUP" === e.target.nodeName
                ) {
                  if (t)
                    if (t.addedNodes && 0 < t.addedNodes.length)
                      for (var r = 0; r < t.addedNodes.length; r++) {
                        t.addedNodes[r].selected && (n = !0);
                      }
                    else
                      t.removedNodes && 0 < t.removedNodes.length && (n = !0);
                  else n = !0;
                  n &&
                    this.dataAdapter.current(function (e) {
                      i.trigger("selection:update", { data: e });
                    });
                }
              }),
              (d.prototype.trigger = function (e, t) {
                var n = d.__super__.trigger,
                  i = {
                    open: "opening",
                    close: "closing",
                    select: "selecting",
                    unselect: "unselecting",
                    clear: "clearing",
                  };
                if ((void 0 === t && (t = {}), e in i)) {
                  var r = i[e],
                    o = { prevented: !1, name: e, args: t };
                  if ((n.call(this, r, o), o.prevented))
                    return void (t.prevented = !0);
                }
                n.call(this, e, t);
              }),
              (d.prototype.toggleDropdown = function () {
                this.options.get("disabled") ||
                  (this.isOpen() ? this.close() : this.open());
              }),
              (d.prototype.open = function () {
                this.isOpen() || this.trigger("query", {});
              }),
              (d.prototype.close = function () {
                this.isOpen() && this.trigger("close", {});
              }),
              (d.prototype.isOpen = function () {
                return this.$container.hasClass("select2-container--open");
              }),
              (d.prototype.hasFocus = function () {
                return this.$container.hasClass("select2-container--focus");
              }),
              (d.prototype.focus = function (e) {
                this.hasFocus() ||
                  (this.$container.addClass("select2-container--focus"),
                  this.trigger("focus", {}));
              }),
              (d.prototype.enable = function (e) {
                this.options.get("debug") &&
                  window.console &&
                  console.warn &&
                  console.warn(
                    'Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'
                  ),
                  (null != e && 0 !== e.length) || (e = [!0]);
                var t = !e[0];
                this.$element.prop("disabled", t);
              }),
              (d.prototype.data = function () {
                this.options.get("debug") &&
                  0 < arguments.length &&
                  window.console &&
                  console.warn &&
                  console.warn(
                    'Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.'
                  );
                var t = [];
                return (
                  this.dataAdapter.current(function (e) {
                    t = e;
                  }),
                  t
                );
              }),
              (d.prototype.val = function (e) {
                if (
                  (this.options.get("debug") &&
                    window.console &&
                    console.warn &&
                    console.warn(
                      'Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'
                    ),
                  null == e || 0 === e.length)
                )
                  return this.$element.val();
                var t = e[0];
                r.isArray(t) &&
                  (t = r.map(t, function (e) {
                    return e.toString();
                  })),
                  this.$element.val(t).trigger("change");
              }),
              (d.prototype.destroy = function () {
                this.$container.remove(),
                  this.$element[0].detachEvent &&
                    this.$element[0].detachEvent(
                      "onpropertychange",
                      this._syncA
                    ),
                  null != this._observer
                    ? (this._observer.disconnect(), (this._observer = null))
                    : this.$element[0].removeEventListener &&
                      (this.$element[0].removeEventListener(
                        "DOMAttrModified",
                        this._syncA,
                        !1
                      ),
                      this.$element[0].removeEventListener(
                        "DOMNodeInserted",
                        this._syncS,
                        !1
                      ),
                      this.$element[0].removeEventListener(
                        "DOMNodeRemoved",
                        this._syncS,
                        !1
                      )),
                  (this._syncA = null),
                  (this._syncS = null),
                  this.$element.off(".select2"),
                  this.$element.attr(
                    "tabindex",
                    u.GetData(this.$element[0], "old-tabindex")
                  ),
                  this.$element.removeClass("select2-hidden-accessible"),
                  this.$element.attr("aria-hidden", "false"),
                  u.RemoveData(this.$element[0]),
                  this.$element.removeData("select2"),
                  this.dataAdapter.destroy(),
                  this.selection.destroy(),
                  this.dropdown.destroy(),
                  this.results.destroy(),
                  (this.dataAdapter = null),
                  (this.selection = null),
                  (this.dropdown = null),
                  (this.results = null);
              }),
              (d.prototype.render = function () {
                var e = r(
                  '<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>'
                );
                return (
                  e.attr("dir", this.options.get("dir")),
                  (this.$container = e),
                  this.$container.addClass(
                    "select2-container--" + this.options.get("theme")
                  ),
                  u.StoreData(e[0], "element", this.$element),
                  e
                );
              }),
              d
            );
          }
        ),
        e.define("select2/compat/utils", ["jquery"], function (s) {
          return {
            syncCssClasses: function (e, t, n) {
              var i,
                r,
                o = [];
              (i = s.trim(e.attr("class"))) &&
                s((i = "" + i).split(/\s+/)).each(function () {
                  0 === this.indexOf("select2-") && o.push(this);
                }),
                (i = s.trim(t.attr("class"))) &&
                  s((i = "" + i).split(/\s+/)).each(function () {
                    0 !== this.indexOf("select2-") &&
                      null != (r = n(this)) &&
                      o.push(r);
                  }),
                e.attr("class", o.join(" "));
            },
          };
        }),
        e.define(
          "select2/compat/containerCss",
          ["jquery", "./utils"],
          function (s, a) {
            function l(e) {
              return null;
            }
            function e() {}
            return (
              (e.prototype.render = function (e) {
                var t = e.call(this),
                  n = this.options.get("containerCssClass") || "";
                s.isFunction(n) && (n = n(this.$element));
                var i = this.options.get("adaptContainerCssClass");
                if (((i = i || l), -1 !== n.indexOf(":all:"))) {
                  n = n.replace(":all:", "");
                  var r = i;
                  i = function (e) {
                    var t = r(e);
                    return null != t ? t + " " + e : e;
                  };
                }
                var o = this.options.get("containerCss") || {};
                return (
                  s.isFunction(o) && (o = o(this.$element)),
                  a.syncCssClasses(t, this.$element, i),
                  t.css(o),
                  t.addClass(n),
                  t
                );
              }),
              e
            );
          }
        ),
        e.define("select2/compat/dropdownCss", ["jquery", "./utils"], function (
          s,
          a
        ) {
          function l(e) {
            return null;
          }
          function e() {}
          return (
            (e.prototype.render = function (e) {
              var t = e.call(this),
                n = this.options.get("dropdownCssClass") || "";
              s.isFunction(n) && (n = n(this.$element));
              var i = this.options.get("adaptDropdownCssClass");
              if (((i = i || l), -1 !== n.indexOf(":all:"))) {
                n = n.replace(":all:", "");
                var r = i;
                i = function (e) {
                  var t = r(e);
                  return null != t ? t + " " + e : e;
                };
              }
              var o = this.options.get("dropdownCss") || {};
              return (
                s.isFunction(o) && (o = o(this.$element)),
                a.syncCssClasses(t, this.$element, i),
                t.css(o),
                t.addClass(n),
                t
              );
            }),
            e
          );
        }),
        e.define("select2/compat/initSelection", ["jquery"], function (i) {
          function e(e, t, n) {
            n.get("debug") &&
              window.console &&
              console.warn &&
              console.warn(
                "Select2: The `initSelection` option has been deprecated in favor of a custom data adapter that overrides the `current` method. This method is now called multiple times instead of a single time when the instance is initialized. Support will be removed for the `initSelection` option in future versions of Select2"
              ),
              (this.initSelection = n.get("initSelection")),
              (this._isInitialized = !1),
              e.call(this, t, n);
          }
          return (
            (e.prototype.current = function (e, t) {
              var n = this;
              this._isInitialized
                ? e.call(this, t)
                : this.initSelection.call(null, this.$element, function (e) {
                    (n._isInitialized = !0), i.isArray(e) || (e = [e]), t(e);
                  });
            }),
            e
          );
        }),
        e.define("select2/compat/inputData", ["jquery", "../utils"], function (
          s,
          i
        ) {
          function e(e, t, n) {
            (this._currentData = []),
              (this._valueSeparator = n.get("valueSeparator") || ","),
              "hidden" === t.prop("type") &&
                n.get("debug") &&
                console &&
                console.warn &&
                console.warn(
                  "Select2: Using a hidden input with Select2 is no longer supported and may stop working in the future. It is recommended to use a `<select>` element instead."
                ),
              e.call(this, t, n);
          }
          return (
            (e.prototype.current = function (e, t) {
              function i(e, t) {
                var n = [];
                return (
                  e.selected || -1 !== s.inArray(e.id, t)
                    ? ((e.selected = !0), n.push(e))
                    : (e.selected = !1),
                  e.children && n.push.apply(n, i(e.children, t)),
                  n
                );
              }
              for (var n = [], r = 0; r < this._currentData.length; r++) {
                var o = this._currentData[r];
                n.push.apply(
                  n,
                  i(o, this.$element.val().split(this._valueSeparator))
                );
              }
              t(n);
            }),
            (e.prototype.select = function (e, t) {
              if (this.options.get("multiple")) {
                var n = this.$element.val();
                (n += this._valueSeparator + t.id),
                  this.$element.val(n),
                  this.$element.trigger("change");
              } else
                this.current(function (e) {
                  s.map(e, function (e) {
                    e.selected = !1;
                  });
                }),
                  this.$element.val(t.id),
                  this.$element.trigger("change");
            }),
            (e.prototype.unselect = function (e, r) {
              var o = this;
              (r.selected = !1),
                this.current(function (e) {
                  for (var t = [], n = 0; n < e.length; n++) {
                    var i = e[n];
                    r.id != i.id && t.push(i.id);
                  }
                  o.$element.val(t.join(o._valueSeparator)),
                    o.$element.trigger("change");
                });
            }),
            (e.prototype.query = function (e, t, n) {
              for (var i = [], r = 0; r < this._currentData.length; r++) {
                var o = this._currentData[r],
                  s = this.matches(t, o);
                null !== s && i.push(s);
              }
              n({ results: i });
            }),
            (e.prototype.addOptions = function (e, t) {
              var n = s.map(t, function (e) {
                return i.GetData(e[0], "data");
              });
              this._currentData.push.apply(this._currentData, n);
            }),
            e
          );
        }),
        e.define("select2/compat/matcher", ["jquery"], function (s) {
          return function (o) {
            return function (e, t) {
              var n = s.extend(!0, {}, t);
              if (null == e.term || "" === s.trim(e.term)) return n;
              if (t.children) {
                for (var i = t.children.length - 1; 0 <= i; i--) {
                  var r = t.children[i];
                  o(e.term, r.text, r) || n.children.splice(i, 1);
                }
                if (0 < n.children.length) return n;
              }
              return o(e.term, t.text, t) ? n : null;
            };
          };
        }),
        e.define("select2/compat/query", [], function () {
          function e(e, t, n) {
            n.get("debug") &&
              window.console &&
              console.warn &&
              console.warn(
                "Select2: The `query` option has been deprecated in favor of a custom data adapter that overrides the `query` method. Support will be removed for the `query` option in future versions of Select2."
              ),
              e.call(this, t, n);
          }
          return (
            (e.prototype.query = function (e, t, n) {
              (t.callback = n), this.options.get("query").call(null, t);
            }),
            e
          );
        }),
        e.define("select2/dropdown/attachContainer", [], function () {
          function e(e, t, n) {
            e.call(this, t, n);
          }
          return (
            (e.prototype.position = function (e, t, n) {
              n.find(".dropdown-wrapper").append(t),
                t.addClass("select2-dropdown--below"),
                n.addClass("select2-container--below");
            }),
            e
          );
        }),
        e.define("select2/dropdown/stopPropagation", [], function () {
          function e() {}
          return (
            (e.prototype.bind = function (e, t, n) {
              e.call(this, t, n);
              this.$dropdown.on(
                [
                  "blur",
                  "change",
                  "click",
                  "dblclick",
                  "focus",
                  "focusin",
                  "focusout",
                  "input",
                  "keydown",
                  "keyup",
                  "keypress",
                  "mousedown",
                  "mouseenter",
                  "mouseleave",
                  "mousemove",
                  "mouseover",
                  "mouseup",
                  "search",
                  "touchend",
                  "touchstart",
                ].join(" "),
                function (e) {
                  e.stopPropagation();
                }
              );
            }),
            e
          );
        }),
        e.define("select2/selection/stopPropagation", [], function () {
          function e() {}
          return (
            (e.prototype.bind = function (e, t, n) {
              e.call(this, t, n);
              this.$selection.on(
                [
                  "blur",
                  "change",
                  "click",
                  "dblclick",
                  "focus",
                  "focusin",
                  "focusout",
                  "input",
                  "keydown",
                  "keyup",
                  "keypress",
                  "mousedown",
                  "mouseenter",
                  "mouseleave",
                  "mousemove",
                  "mouseover",
                  "mouseup",
                  "search",
                  "touchend",
                  "touchstart",
                ].join(" "),
                function (e) {
                  e.stopPropagation();
                }
              );
            }),
            e
          );
        }),
        (l = function (p) {
          var h,
            f,
            e = [
              "wheel",
              "mousewheel",
              "DOMMouseScroll",
              "MozMousePixelScroll",
            ],
            t =
              "onwheel" in document || 9 <= document.documentMode
                ? ["wheel"]
                : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
            g = Array.prototype.slice;
          if (p.event.fixHooks)
            for (var n = e.length; n; )
              p.event.fixHooks[e[--n]] = p.event.mouseHooks;
          var m = (p.event.special.mousewheel = {
            version: "3.1.12",
            setup: function () {
              if (this.addEventListener)
                for (var e = t.length; e; )
                  this.addEventListener(t[--e], i, !1);
              else this.onmousewheel = i;
              p.data(this, "mousewheel-line-height", m.getLineHeight(this)),
                p.data(this, "mousewheel-page-height", m.getPageHeight(this));
            },
            teardown: function () {
              if (this.removeEventListener)
                for (var e = t.length; e; )
                  this.removeEventListener(t[--e], i, !1);
              else this.onmousewheel = null;
              p.removeData(this, "mousewheel-line-height"),
                p.removeData(this, "mousewheel-page-height");
            },
            getLineHeight: function (e) {
              var t = p(e),
                n = t["offsetParent" in p.fn ? "offsetParent" : "parent"]();
              return (
                n.length || (n = p("body")),
                parseInt(n.css("fontSize"), 10) ||
                  parseInt(t.css("fontSize"), 10) ||
                  16
              );
            },
            getPageHeight: function (e) {
              return p(e).height();
            },
            settings: { adjustOldDeltas: !0, normalizeOffset: !0 },
          });
          function i(e) {
            var t,
              n = e || window.event,
              i = g.call(arguments, 1),
              r = 0,
              o = 0,
              s = 0,
              a = 0,
              l = 0;
            if (
              (((e = p.event.fix(n)).type = "mousewheel"),
              "detail" in n && (s = -1 * n.detail),
              "wheelDelta" in n && (s = n.wheelDelta),
              "wheelDeltaY" in n && (s = n.wheelDeltaY),
              "wheelDeltaX" in n && (o = -1 * n.wheelDeltaX),
              "axis" in n &&
                n.axis === n.HORIZONTAL_AXIS &&
                ((o = -1 * s), (s = 0)),
              (r = 0 === s ? o : s),
              "deltaY" in n && (r = s = -1 * n.deltaY),
              "deltaX" in n && ((o = n.deltaX), 0 === s && (r = -1 * o)),
              0 !== s || 0 !== o)
            ) {
              if (1 === n.deltaMode) {
                var c = p.data(this, "mousewheel-line-height");
                (r *= c), (s *= c), (o *= c);
              } else if (2 === n.deltaMode) {
                var u = p.data(this, "mousewheel-page-height");
                (r *= u), (s *= u), (o *= u);
              }
              if (
                ((t = Math.max(Math.abs(s), Math.abs(o))),
                (!f || t < f) && y(n, (f = t)) && (f /= 40),
                y(n, t) && ((r /= 40), (o /= 40), (s /= 40)),
                (r = Math[1 <= r ? "floor" : "ceil"](r / f)),
                (o = Math[1 <= o ? "floor" : "ceil"](o / f)),
                (s = Math[1 <= s ? "floor" : "ceil"](s / f)),
                m.settings.normalizeOffset && this.getBoundingClientRect)
              ) {
                var d = this.getBoundingClientRect();
                (a = e.clientX - d.left), (l = e.clientY - d.top);
              }
              return (
                (e.deltaX = o),
                (e.deltaY = s),
                (e.deltaFactor = f),
                (e.offsetX = a),
                (e.offsetY = l),
                (e.deltaMode = 0),
                i.unshift(e, r, o, s),
                h && clearTimeout(h),
                (h = setTimeout(v, 200)),
                (p.event.dispatch || p.event.handle).apply(this, i)
              );
            }
          }
          function v() {
            f = null;
          }
          function y(e, t) {
            return (
              m.settings.adjustOldDeltas &&
              "mousewheel" === e.type &&
              t % 120 == 0
            );
          }
          p.fn.extend({
            mousewheel: function (e) {
              return e
                ? this.bind("mousewheel", e)
                : this.trigger("mousewheel");
            },
            unmousewheel: function (e) {
              return this.unbind("mousewheel", e);
            },
          });
        }),
        "function" == typeof e.define && e.define.amd
          ? e.define("jquery-mousewheel", ["jquery"], l)
          : "object" == typeof exports
          ? (module.exports = l)
          : l(d),
        e.define(
          "jquery.select2",
          [
            "jquery",
            "jquery-mousewheel",
            "./select2/core",
            "./select2/defaults",
            "./select2/utils",
          ],
          function (r, e, o, t, s) {
            if (null == r.fn.select2) {
              var a = ["open", "close", "destroy"];
              r.fn.select2 = function (t) {
                if ("object" == typeof (t = t || {}))
                  return (
                    this.each(function () {
                      var e = r.extend(!0, {}, t);
                      new o(r(this), e);
                    }),
                    this
                  );
                if ("string" != typeof t)
                  throw new Error("Invalid arguments for Select2: " + t);
                var n,
                  i = Array.prototype.slice.call(arguments, 1);
                return (
                  this.each(function () {
                    var e = s.GetData(this, "select2");
                    null == e &&
                      window.console &&
                      console.error &&
                      console.error(
                        "The select2('" +
                          t +
                          "') method was called on an element that is not using Select2."
                      ),
                      (n = e[t].apply(e, i));
                  }),
                  -1 < r.inArray(t, a) ? this : n
                );
              };
            }
            return (
              null == r.fn.select2.defaults && (r.fn.select2.defaults = t), o
            );
          }
        ),
        { define: e.define, require: e.require }
      );
    })(),
    t = e.require("jquery.select2");
  return (d.fn.select2.amd = e), t;
});

/*! Select2 4.0.7 | https://github.com/select2/select2/blob/master/LICENSE.md */

!(function () {
  if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd)
    var n = jQuery.fn.select2.amd;
  n.define("select2/i18n/ru", [], function () {
    function n(n, e, r, u) {
      return (n % 10 < 5 && n % 10 > 0 && n % 100 < 5) || n % 100 > 20
        ? n % 10 > 1
          ? r
          : e
        : u;
    }
    return {
      errorLoading: function () {
        return "Невозможно загрузить результаты";
      },
      inputTooLong: function (e) {
        var r = e.input.length - e.maximum,
          u = "Пожалуйста, введите на " + r + " символ";
        return (u += n(r, "", "a", "ов")), (u += " меньше");
      },
      inputTooShort: function (e) {
        var r = e.minimum - e.input.length,
          u = "Пожалуйста, введите ещё хотя бы " + r + " символ";
        return (u += n(r, "", "a", "ов"));
      },
      loadingMore: function () {
        return "Загрузка данных…";
      },
      maximumSelected: function (e) {
        var r = "Вы можете выбрать не более " + e.maximum + " элемент";
        return (r += n(e.maximum, "", "a", "ов"));
      },
      noResults: function () {
        return "Совпадений не найдено";
      },
      searching: function () {
        return "Поиск…";
      },
      removeAllItems: function () {
        return "Удалить все элементы";
      },
    };
  }),
    n.define,
    n.require;
})();

//============================================================
//
// The MIT License
//
// Copyright (C) 2014 Matthew Wagerfield - @wagerfield
//
// Permission is hereby granted, free of charge, to any
// person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the
// Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute,
// sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
//
// The above copyright notice and this permission notice
// shall be included in all copies or substantial portions
// of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY
// OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
// LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
// AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
// OR OTHER DEALINGS IN THE SOFTWARE.
//
//============================================================

/**
 * jQuery || Zepto Parallax Plugin
 * @author Matthew Wagerfield - @wagerfield
 * @description Creates a parallax effect between an array of layers,
 *              driving the motion from the gyroscope output of a smartdevice.
 *              If no gyroscope is available, the cursor position is used.
 */
(function ($, window, document, undefined) {
  // Strict Mode
  "use strict";

  // Constants
  var NAME = "parallax";
  var MAGIC_NUMBER = 30;
  var DEFAULTS = {
    relativeInput: false,
    clipRelativeInput: false,
    calibrationThreshold: 100,
    calibrationDelay: 500,
    supportDelay: 500,
    calibrateX: false,
    calibrateY: true,
    invertX: true,
    invertY: true,
    limitX: false,
    limitY: false,
    scalarX: 10.0,
    scalarY: 10.0,
    frictionX: 0.1,
    frictionY: 0.1,
    originX: 0.5,
    originY: 0.5,
    pointerEvents: true,
    precision: 1,
  };

  function Plugin(element, options) {
    // DOM Context
    this.element = element;

    // Selections
    this.$context = $(element).data("api", this);
    this.$layers = this.$context.find(".layer");

    // Data Extraction
    var data = {
      calibrateX: this.$context.data("calibrate-x") || null,
      calibrateY: this.$context.data("calibrate-y") || null,
      invertX: this.$context.data("invert-x") || null,
      invertY: this.$context.data("invert-y") || null,
      limitX: parseFloat(this.$context.data("limit-x")) || null,
      limitY: parseFloat(this.$context.data("limit-y")) || null,
      scalarX: parseFloat(this.$context.data("scalar-x")) || null,
      scalarY: parseFloat(this.$context.data("scalar-y")) || null,
      frictionX: parseFloat(this.$context.data("friction-x")) || null,
      frictionY: parseFloat(this.$context.data("friction-y")) || null,
      originX: parseFloat(this.$context.data("origin-x")) || null,
      originY: parseFloat(this.$context.data("origin-y")) || null,
      pointerEvents: this.$context.data("pointer-events") || true,
      precision: parseFloat(this.$context.data("precision")) || 1,
    };

    // Delete Null Data Values
    for (var key in data) {
      if (data[key] === null) delete data[key];
    }

    // Compose Settings Object
    $.extend(this, DEFAULTS, options, data);

    // States
    this.calibrationTimer = null;
    this.calibrationFlag = true;
    this.enabled = false;
    this.depthsX = [];
    this.depthsY = [];
    this.raf = null;

    // Element Bounds
    this.bounds = null;
    this.ex = 0;
    this.ey = 0;
    this.ew = 0;
    this.eh = 0;

    // Element Center
    this.ecx = 0;
    this.ecy = 0;

    // Element Range
    this.erx = 0;
    this.ery = 0;

    // Calibration
    this.cx = 0;
    this.cy = 0;

    // Input
    this.ix = 0;
    this.iy = 0;

    // Motion
    this.mx = 0;
    this.my = 0;

    // Velocity
    this.vx = 0;
    this.vy = 0;

    // Callbacks
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
    this.onOrientationTimer = this.onOrientationTimer.bind(this);
    this.onCalibrationTimer = this.onCalibrationTimer.bind(this);
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    // Initialise
    this.initialise();
  }

  Plugin.prototype.transformSupport = function (value) {
    var element = document.createElement("div");
    var propertySupport = false;
    var propertyValue = null;
    var featureSupport = false;
    var cssProperty = null;
    var jsProperty = null;
    for (var i = 0, l = this.vendors.length; i < l; i++) {
      if (this.vendors[i] !== null) {
        cssProperty = this.vendors[i][0] + "transform";
        jsProperty = this.vendors[i][1] + "Transform";
      } else {
        cssProperty = "transform";
        jsProperty = "transform";
      }
      if (element.style[jsProperty] !== undefined) {
        propertySupport = true;
        break;
      }
    }
    switch (value) {
      case "2D":
        featureSupport = propertySupport;
        break;
      case "3D":
        if (propertySupport) {
          var body = document.body || document.createElement("body");
          var documentElement = document.documentElement;
          var documentOverflow = documentElement.style.overflow;
          var isCreatedBody = false;
          if (!document.body) {
            isCreatedBody = true;
            documentElement.style.overflow = "hidden";
            documentElement.appendChild(body);
            body.style.overflow = "hidden";
            body.style.background = "";
          }
          body.appendChild(element);
          element.style[jsProperty] = "translate3d(1px,1px,1px)";
          propertyValue = window
            .getComputedStyle(element)
            .getPropertyValue(cssProperty);
          featureSupport =
            propertyValue !== undefined &&
            propertyValue.length > 0 &&
            propertyValue !== "none";
          documentElement.style.overflow = documentOverflow;
          body.removeChild(element);
          if (isCreatedBody) {
            body.removeAttribute("style");
            body.parentNode.removeChild(body);
          }
        }
        break;
    }
    return featureSupport;
  };

  Plugin.prototype.ww = null;
  Plugin.prototype.wh = null;
  Plugin.prototype.wcx = null;
  Plugin.prototype.wcy = null;
  Plugin.prototype.wrx = null;
  Plugin.prototype.wry = null;
  Plugin.prototype.portrait = null;
  Plugin.prototype.desktop = !navigator.userAgent.match(
    /(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i
  );
  Plugin.prototype.vendors = [
    null,
    ["-webkit-", "webkit"],
    ["-moz-", "Moz"],
    ["-o-", "O"],
    ["-ms-", "ms"],
  ];
  Plugin.prototype.motionSupport = !!window.DeviceMotionEvent;
  Plugin.prototype.orientationSupport = !!window.DeviceOrientationEvent;
  Plugin.prototype.orientationStatus = 0;
  Plugin.prototype.transform2DSupport = Plugin.prototype.transformSupport("2D");
  Plugin.prototype.transform3DSupport = Plugin.prototype.transformSupport("3D");
  Plugin.prototype.propertyCache = {};

  Plugin.prototype.initialise = function () {
    // Configure Styles
    if (this.$context.css("position") === "static") {
      this.$context.css({
        position: "relative",
      });
    }

    // Pointer events
    if (!this.pointerEvents) {
      this.$context.css({
        pointerEvents: "none",
      });
    }

    // Hardware Accelerate Context
    this.accelerate(this.$context);

    // Setup
    this.updateLayers();
    this.updateDimensions();
    this.enable();
    this.queueCalibration(this.calibrationDelay);
  };

  Plugin.prototype.updateLayers = function () {
    // Cache Layer Elements
    this.$layers = this.$context.find(".layer");
    this.depthsX = [];
    this.depthsY = [];

    // Configure Layer Styles
    this.$layers.css({
      position: "absolute",
      display: "block",
      left: 0,
      top: 0,
    });
    this.$layers.first().css({
      position: "relative",
    });

    // Hardware Accelerate Layers
    this.accelerate(this.$layers);

    // Cache Depths
    this.$layers.each(
      $.proxy(function (index, element) {
        //Graceful fallback on depth if depth-x or depth-y is absent
        var depth = $(element).data("depth") || 0;
        this.depthsX.push($(element).data("depth-x") || depth);
        this.depthsY.push($(element).data("depth-y") || depth);
      }, this)
    );
  };

  Plugin.prototype.updateDimensions = function () {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;
    this.wcx = this.ww * this.originX;
    this.wcy = this.wh * this.originY;
    this.wrx = Math.max(this.wcx, this.ww - this.wcx);
    this.wry = Math.max(this.wcy, this.wh - this.wcy);
  };

  Plugin.prototype.updateBounds = function () {
    this.bounds = this.element.getBoundingClientRect();
    this.ex = this.bounds.left;
    this.ey = this.bounds.top;
    this.ew = this.bounds.width;
    this.eh = this.bounds.height;
    this.ecx = this.ew * this.originX;
    this.ecy = this.eh * this.originY;
    this.erx = Math.max(this.ecx, this.ew - this.ecx);
    this.ery = Math.max(this.ecy, this.eh - this.ecy);
  };

  Plugin.prototype.queueCalibration = function (delay) {
    clearTimeout(this.calibrationTimer);
    this.calibrationTimer = setTimeout(this.onCalibrationTimer, delay);
  };

  Plugin.prototype.enable = function () {
    if (!this.enabled) {
      this.enabled = true;
      if (this.orientationSupport) {
        this.portrait = null;
        window.addEventListener("deviceorientation", this.onDeviceOrientation);
        setTimeout(this.onOrientationTimer, this.supportDelay);
      } else {
        this.cx = 0;
        this.cy = 0;
        this.portrait = false;
        window.addEventListener("mousemove", this.onMouseMove);
      }
      window.addEventListener("resize", this.onWindowResize);
      this.raf = requestAnimationFrame(this.onAnimationFrame);
    }
  };

  Plugin.prototype.disable = function () {
    if (this.enabled) {
      this.enabled = false;
      if (this.orientationSupport) {
        window.removeEventListener(
          "deviceorientation",
          this.onDeviceOrientation
        );
      } else {
        window.removeEventListener("mousemove", this.onMouseMove);
      }
      window.removeEventListener("resize", this.onWindowResize);
      cancelAnimationFrame(this.raf);
    }
  };

  Plugin.prototype.calibrate = function (x, y) {
    this.calibrateX = x === undefined ? this.calibrateX : x;
    this.calibrateY = y === undefined ? this.calibrateY : y;
  };

  Plugin.prototype.invert = function (x, y) {
    this.invertX = x === undefined ? this.invertX : x;
    this.invertY = y === undefined ? this.invertY : y;
  };

  Plugin.prototype.friction = function (x, y) {
    this.frictionX = x === undefined ? this.frictionX : x;
    this.frictionY = y === undefined ? this.frictionY : y;
  };

  Plugin.prototype.scalar = function (x, y) {
    this.scalarX = x === undefined ? this.scalarX : x;
    this.scalarY = y === undefined ? this.scalarY : y;
  };

  Plugin.prototype.limit = function (x, y) {
    this.limitX = x === undefined ? this.limitX : x;
    this.limitY = y === undefined ? this.limitY : y;
  };

  Plugin.prototype.origin = function (x, y) {
    this.originX = x === undefined ? this.originX : x;
    this.originY = y === undefined ? this.originY : y;
  };

  Plugin.prototype.clamp = function (value, min, max) {
    value = Math.max(value, min);
    value = Math.min(value, max);
    return value;
  };

  Plugin.prototype.css = function (element, property, value) {
    var jsProperty = this.propertyCache[property];
    if (!jsProperty) {
      for (var i = 0, l = this.vendors.length; i < l; i++) {
        if (this.vendors[i] !== null) {
          jsProperty = $.camelCase(this.vendors[i][1] + "-" + property);
        } else {
          jsProperty = property;
        }
        if (element.style[jsProperty] !== undefined) {
          this.propertyCache[property] = jsProperty;
          break;
        }
      }
    }
    element.style[jsProperty] = value;
  };

  Plugin.prototype.accelerate = function ($element) {
    for (var i = 0, l = $element.length; i < l; i++) {
      var element = $element[i];
      this.css(element, "transform", "translate3d(0,0,0)");
      this.css(element, "transform-style", "preserve-3d");
      this.css(element, "backface-visibility", "hidden");
    }
  };

  Plugin.prototype.setPosition = function (element, x, y) {
    x += "px";
    y += "px";
    if (this.transform3DSupport) {
      this.css(element, "transform", "translate3d(" + x + "," + y + ",0)");
    } else if (this.transform2DSupport) {
      this.css(element, "transform", "translate(" + x + "," + y + ")");
    } else {
      element.style.left = x;
      element.style.top = y;
    }
  };

  Plugin.prototype.onOrientationTimer = function (event) {
    if (this.orientationSupport && this.orientationStatus === 0) {
      this.disable();
      this.orientationSupport = false;
      this.enable();
    }
  };

  Plugin.prototype.onCalibrationTimer = function (event) {
    this.calibrationFlag = true;
  };

  Plugin.prototype.onWindowResize = function (event) {
    this.updateDimensions();
  };

  Plugin.prototype.onAnimationFrame = function () {
    this.updateBounds();
    var dx = this.ix - this.cx;
    var dy = this.iy - this.cy;
    if (
      Math.abs(dx) > this.calibrationThreshold ||
      Math.abs(dy) > this.calibrationThreshold
    ) {
      this.queueCalibration(0);
    }
    if (this.portrait) {
      this.mx = this.calibrateX ? dy : this.iy;
      this.my = this.calibrateY ? dx : this.ix;
    } else {
      this.mx = this.calibrateX ? dx : this.ix;
      this.my = this.calibrateY ? dy : this.iy;
    }
    this.mx *= this.ew * (this.scalarX / 100);
    this.my *= this.eh * (this.scalarY / 100);
    if (!isNaN(parseFloat(this.limitX))) {
      this.mx = this.clamp(this.mx, -this.limitX, this.limitX);
    }
    if (!isNaN(parseFloat(this.limitY))) {
      this.my = this.clamp(this.my, -this.limitY, this.limitY);
    }
    this.vx += (this.mx - this.vx) * this.frictionX;
    this.vy += (this.my - this.vy) * this.frictionY;
    for (var i = 0, l = this.$layers.length; i < l; i++) {
      var depthX = this.depthsX[i];
      var depthY = this.depthsY[i];
      var layer = this.$layers[i];
      var xOffset = this.vx * (depthX * (this.invertX ? -1 : 1));
      var yOffset = this.vy * (depthY * (this.invertY ? -1 : 1));
      this.setPosition(layer, xOffset, yOffset);
    }
    this.raf = requestAnimationFrame(this.onAnimationFrame);
  };

  Plugin.prototype.onDeviceOrientation = function (event) {
    // Validate environment and event properties.
    if (!this.desktop && event.beta !== null && event.gamma !== null) {
      // Set orientation status.
      this.orientationStatus = 1;

      // Extract Rotation
      var x = (event.beta || 0) / MAGIC_NUMBER; //  -90 :: 90
      var y = (event.gamma || 0) / MAGIC_NUMBER; // -180 :: 180

      // Detect Orientation Change
      var portrait = window.innerHeight > window.innerWidth;
      if (this.portrait !== portrait) {
        this.portrait = portrait;
        this.calibrationFlag = true;
      }

      // Set Calibration
      if (this.calibrationFlag) {
        this.calibrationFlag = false;
        this.cx = x;
        this.cy = y;
      }

      // Set Input
      this.ix = x;
      this.iy = y;
    }
  };

  Plugin.prototype.onMouseMove = function (event) {
    // Cache mouse coordinates.
    var clientX = event.clientX;
    var clientY = event.clientY;

    // Calculate Mouse Input
    if (!this.orientationSupport && this.relativeInput) {
      // Clip mouse coordinates inside element bounds.
      if (this.clipRelativeInput) {
        clientX = Math.max(clientX, this.ex);
        clientX = Math.min(clientX, this.ex + this.ew);
        clientY = Math.max(clientY, this.ey);
        clientY = Math.min(clientY, this.ey + this.eh);
      }

      // Calculate input relative to the element.
      this.ix = (clientX - this.ex - this.ecx) / this.erx;
      this.iy = (clientY - this.ey - this.ecy) / this.ery;
    } else {
      // Calculate input relative to the window.
      this.ix = (clientX - this.wcx) / this.wrx;
      this.iy = (clientY - this.wcy) / this.wry;
    }
  };

  var API = {
    enable: Plugin.prototype.enable,
    disable: Plugin.prototype.disable,
    updateLayers: Plugin.prototype.updateLayers,
    calibrate: Plugin.prototype.calibrate,
    friction: Plugin.prototype.friction,
    invert: Plugin.prototype.invert,
    scalar: Plugin.prototype.scalar,
    limit: Plugin.prototype.limit,
    origin: Plugin.prototype.origin,
  };

  $.fn[NAME] = function (value) {
    var args = arguments;
    return this.each(function () {
      var $this = $(this);
      var plugin = $this.data(NAME);
      if (!plugin) {
        plugin = new Plugin(this, value);
        $this.data(NAME, plugin);
      }
      if (API[value]) {
        plugin[value].apply(plugin, Array.prototype.slice.call(args, 1));
      }
    });
  };
})(window.jQuery || window.Zepto, window, document);

/**
 * Request Animation Frame Polyfill.
 * @author Tino Zijdel
 * @author Paul Irish
 * @see https://gist.github.com/paulirish/1579671
 */
(function () {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];

  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
})();

const load_work_form = document.getElementById("load-work-form");
if (load_work_form) {
  load_work_form.addEventListener("submit", function (event) {
    $("#loadwork-submit-btn").prop("disabled", true);
    event.preventDefault();
    let formData = new FormData(this);
    let url = "/api/v1/load_work/";
    fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      body: formData,
    })
      .then((data) => {
        status = data.status;
        $("#loadwork-submit-btn").prop("disabled", false);
        return data.json();
      })
      .then((data) => {
        $("#load-work-errors").fadeOut("fast");
        if (status == 201) {
          $.when($("#load-work-form").fadeOut("fast")).then(function () {
            $("#load-work-sucess").fadeIn("fast");
            setTimeout(function () {
              // document.location.reload(true);
              document.location.replace(window.location.pathname);
            }, 3500);
          });
        } else if (status == 429) {
          $("#load-work-errors").text("Вы загрузили слишком много работ. Попробуйте завтра.");
          $("#load-work-errors").fadeIn("slow");
        } else {
          console.log("LOAD WORK ERROR", status, data);
          $("#load-work-errors").text(data["file"]);
          $("#load-work-errors").fadeIn("slow");
        }
      })
      .catch((error) => {
         console.log(error);
      });
  });
}

const pass_reset_form = document.getElementById("password-reset-form");
if (pass_reset_form) {
  pass_reset_form.addEventListener("submit", function (event) {
    $("#pwrd-reset-btn").prop("disabled", true);
    event.preventDefault();
    let formData = new FormData(this);
    let user = {
      email: formData.get("email"),
    };

    let url = "/api/v1/password_reset/";

    fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(user),
    })
      .then((data) => {
        status = data.status;
        $("#pwrd-reset-btn").prop("disabled", false);
        return data.json();
      })
      .then((data) => {
        $("#pass-reset-error").fadeOut("fast");
        if (status != 200) {
          $("#pass-reset-error").fadeIn("fast");
          if ("email" in data) {
            document.getElementById("pass-reset-error").innerHTML =
              data["email"];
          }
          if ("detail" in data) {
            document.getElementById("pass-reset-error").innerHTML =
              "Введите корректный адрес электронной почты.";
          }
        } else {
          // document.getElementById("pass-reset-error").style.display = "none";
          $.when(
            $("#password-reset-form")
              .find(".modal-body")
              .first()
              .children("div:not(#pass-reset-sucess)")
              .fadeOut("fast")
          ).then(function () {
            $("#pass-reset-sucess").fadeIn("fast");
            setTimeout(function () {
              // document.location.reload(true);
              document.location.replace(window.location.pathname);
            }, 1500);
          });
        }
      });
  });
}

const pass_change_form = document.getElementById("password-change-form");
if (pass_reset_form) {
  pass_change_form.addEventListener("submit", function (event) {
    event.preventDefault();
    let formData = new FormData(this);
    let query_p = window.location.href.split("&");
    let body = {
      new_password: formData.get("password1"),
      new_password_confirm: formData.get("password2"),
      uid: query_p[1],
      token: query_p[2],
    };

    let url = "/api/v1/password_reset_confirm/";

    fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    })
      .then((data) => {
        status = data.status;
        return data.json();
      })
      .then((data) => {
        if (status != 200) {
          if ("validate_error" in data) {
            document.location.replace(window.location.pathname);
          }

          $("#pass-change-error").fadeIn("fast");
          if ("new_password" in data) {
            document.getElementById("pass-change-error").innerHTML =
              data["new_password"][0];
          }
          if ("new_password_confirm" in data) {
            document.getElementById("pass-change-error").innerHTML =
              data["new_password_confirm"][0];
          }
        } else {
          // document.getElementById("pass-change-error").style.display = "none";
          $.when($("pass-change-error").fadeOut("fast"))
            .then(function () {
              $("#password-change-form")
                .find(".modal-body")
                .first()
                .children("div:not(#pass-change-sucess)")
                .fadeTo(0, 0);
            })
            .then(function () {
              $("#pass-change-sucess").fadeIn("slow");
            })
            .then(function () {
              setTimeout(function () {
                // document.location.reload(true);
                document.location.replace(window.location.pathname);
              }, 1500);
            });
        }
      });
  });
}

const login_form = document.getElementById("login-form");
if (login_form) {
  login_form.addEventListener("submit", function (event) {
    $("#login-submit-btn").prop("disabled", true);
    event.preventDefault();

    let formData = new FormData(this);
    let user = {
      username: formData.get("email"),
      password: formData.get("password"),
    };

    let url = this.getAttribute("data-url");
    let status = null;

    fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(user),
    })
      .then((data) => {
        status = data.status;
        $("#login-submit-btn").prop("disabled", false);
        return data.json();
      })
      .then((data) => {
        $(".modal-scroll").scrollTop(0);
        $("#user-not-found").fadeOut("fast");
        $("#password-is-not-valid").fadeOut("fast").empty();
        $("#other-login-errors").fadeOut("fast").empty();

        if (status == 200) {
          $.when($("#login-modal").fadeOut("fast")).then(function () {
            $("#login-sucess").fadeIn("fast");
          });

          setTimeout(function () {
            document.location.replace(window.location.pathname);
          }, 1000);
        } else {
          $("#login-modal").scrollTop(0);
          if ("user_not_found" in data) {
            $("#user-not-found").fadeIn("fast");
          }
          let flag = false;
          let elem = document.getElementById("other-login-errors");
          Object.keys(data).forEach((item) => {
            if (item != "username" && item != "user_not_found") {
              flag = true;
              elem.innerHTML += data[item][0] + "<br>";
            }
          });
          if (flag) {
            $(elem).fadeIn("fast");
          }
        }
      });
  });
}

const register_form = document.getElementById("register-form");
if (register_form) {
  register_form.addEventListener("submit", function (event) {
    $("#register-submit-btn").prop("disabled", true);
    event.preventDefault();
    let formData = new FormData(this);
    let user = {
      email: formData.get("email"),
      full_name: formData.get("full_name"),
      city: formData.get("city"),
      phone: formData.get("phone"),
      password1: formData.get("password1"),
      password2: formData.get("password2"),
      consent: formData.get("consent"),
      img: formData.get("img"),
      birthday: formData.get("birthday")
    };

    let url = this.getAttribute("data-url");
    let status = null;
    fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
//      headers: {
//        'Content-Type': 'application/json'
//      },

      body: formData,
    })
      .then((data) => {
        status = data.status;
        $("#register-submit-btn").prop("disabled", false);
        return data.json();
      })
      .then((data) => {
        $("#email-error").fadeOut("fast").empty();
        $("#password-error").fadeOut("fast").empty();
        $("#other-register-errors").fadeOut("fast").empty();

        if (status == 201) {
          $.when($("#registraion-modal").fadeOut("fast")).then(function () {
            $("#registration-sucess").fadeIn("fast");
            setTimeout(function () {
              // document.location.reload(true);
              document.location.replace(window.location.pathname);
            }, 4500);
          });
        } else {
          $(".modal-scroll").scrollTop(0);
          if ("email" in data) {
            let elem = document.getElementById("email-error");
            elem.textContent = data["email"][0];
            formData.delete("email");
            $(elem).fadeIn("fast");
          }

          if ("password1" in data || "password2" in data) {
            // // console.log((data['password1']);
            let elem = document.getElementById("password-error");
            elem.innerHTML = data["password1"]
              ? data["password1"] + "<br>"
              : "";
            elem.innerHTML += data["password2"] ? data["password2"] : "";
            formData.delete("password1");
            formData.delete("password2");
            $(elem).fadeIn("fast");
          }

          let flag = false;
          let elem = document.getElementById("other-register-errors");
          elem.innerHTML = "";
          Object.keys(data).forEach((item) => {
            if (item != "email" && item != "password1" && item != "password2") {
              flag = true;
              elem.innerHTML += data[item] + "<br>";
            }
          });
          if (flag) {
            $(elem).fadeIn("fast");
          }
        }
      });
  });
}

function callQuizModal(pk, question_num) {
  let url = `/api/v1/questions/${pk}`;
  fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
  })
    .then((data) => {
      status = data.status;
      return data.json();
    })
    .then((data) => {
      if (status == 403) {
        if ("has_passed" in data) {
          $("#modal-test").find("form").first().fadeTo(0, 0);
          $("#quiz-passed").fadeIn("slow");
          $("#modal-test").modal("show");
          return;
        } else {
          $("#modal-test").find("form").first().fadeTo(0, 0);
          $("#modal-test").find(".modal-noac").first().fadeIn("slow");
          $("#modal-test").modal("show");
          return;
        }
      }
      $("#modal-test").find("form").first().fadeTo(0, 1);
      $("#quiz-passed").attr("style", "display: none;");
      $("#quiz-end").attr("style", "display: none;");
      $("#modal-test")
        .find(".modal-noac")
        .first()
        .attr("style", "display: none;");

      let modal_elem = $("#modal-test");
      let modal_body = $(".modal-body").first();
      let test_item_divs = modal_body.find(
        ".testing:not(#quiz-end-correct):not(#quiz-end-wrong)"
      );
      test_item_divs
        .find(".testing__head")
        .first()
        .text(
          `Вопрос ${question_num} из ${$(".tests-items").first().data("count")}`
        );
      test_item_divs.find(".testing__question").text(data["label"]);

      let ans_div_temp = modal_body.find("#placeholder-test-item").clone();
      modal_body.find(".testing__items").first().empty();
      data["_answers"].forEach((item, ind) => {
        ans_div = ans_div_temp.clone();
        ans_div.attr("id", "");
        ans_div.attr("data-num", item["pk"]);
        ans_div.css("display", "block");
        ans_div.find("span").first().text(item["text"]);
        ans_div
          .find("input")
          .first()
          .attr("id", "an" + item["pk"]);
        ans_div.find("input").first().attr("data-num", item["pk"]);
        ans_div
          .find("label")
          .first()
          .attr("for", ans_div.find("input").first().attr("id"));
        ans_div
          .find("b")
          .first()
          .text(String.fromCharCode(65 + ind));
        modal_body.find(".testing__items").first().append(ans_div);
      });
      $("#test-confirm").data("pk", pk);
      modal_elem.attr("question-num", $(this).data("num"));
      $("#modal-test").find("form").first().fadeIn("fast");
      $("label.testing-item__label").click(function () {
        $("#test-confirm").prop("disabled", false);
      });
    })
    .catch((error) => {
      // // console.log((error);
    });
}

$("a.tests-item").bind("click", function (e) {
  let pk = event.target.getAttribute("data-pk");
  url = `/api/v1/questions/${pk}`;
  question_num = $(this).data("num");
  callQuizModal(pk, question_num);
  $("#modal-test").modal("show");
});

$("#modal-test").on("show.bs.modal", function (e) {
  $("#test-confirm").prop("disabled", true);
});

$("#test-confirm").click(function () {
  let pk = $(this).data("pk");
  let answer = {
    answer_num: $('input[name="r1"]:checked').first().data("num"),
  };

  let url = `/api/v1/questions/${pk}`;
  fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answer),
  })
    .then((data) => {
      status = data.status;
      return data.json();
    })
    .then((data) => {
      let correct_num = data["correct_ans_num"];
      if (correct_num == answer.answer_num) {
        $("input[name='r1']").prop("checked", false);
        $(".testing-item[data-num='" + correct_num + "'")
          .first()
          .addClass("testing-item--true");
        $(`.tests-item__top[data-pk='${pk}']`)
          .first()
          .find(".tests-item__topright")
          .append('<div class="tests-item__done">Правильно</div>');
        $(`.tests-item[data-pk='${pk}']`)
          .first()
          .attr("style", "pointer-events: none;");
        $("#test-confirm").prop("disabled", true);
        // $(".user-rating").text(`Ваши баллы: ${data['rating']}`)
      } else {
        let my_ans = $('input[name="r1"]:checked').first();
        my_ans.prop("checked", false);
        $(".testing-item[data-num='" + answer.answer_num + "'")
          .first()
          .addClass("testing-item--false");
        // $(".testing-item[data-num='" + correct_num + "'").first().addClass("testing-item--true");
        $(`.tests-item__top[data-pk='${pk}']`)
          .first()
          .find(".tests-item__topright")
          .append('<div class="tests-item__notdone">Неправильно</div>');
        $(`.tests-item[data-pk='${pk}']`)
          .first()
          .attr("style", "pointer-events: none;");
        $("#test-confirm").prop("disabled", true);
      }

      let _url = "/api/v1/questions/next/";
      fetch(_url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((data) => {
          status = data.status;
          return data.json();
        })
        .then((data) => {
          if (data["_answers"].length == 0) {
            setTimeout(function () {
              $.when($("#modal-test").find("form").first().fadeOut("slow"))
                .then(function () {
                  if (data["results"]) {
                    $("#quiz-end-correct").fadeIn("slow");
                    // $("#quiz-end-correct").find('.testing__head').first().append(`<img src="{% static 'promo/static/images/win.svg' %}">`);
                    $("#quiz-end-correct")
                      .find(".testing__question")
                      .first()
                      .text(
                        "Вы верно ответили на все 10 вопросов! В Ваш рейтинг начислено 10 баллов"
                      );
                    $(".user-week-rating").text(
                      `Ваш еженедельный рейтинг: ${data["rating"]}`
                    );
                  } else {
                    $("#quiz-end-wrong").fadeIn("slow");
                    // $("#quiz-end-correct").find('.testing__head').first().append(`<img src="{% static 'promo/static/images/lose.svg' %}">`);
                    $("#quiz-end-wrong")
                      .find(".testing__question")
                      .first()
                      .text(
                        "В ответах допущена ошибка, попробуйте пройти тест на следующей неделе"
                      );
                  }
                })
                .then(function () {
                  setTimeout(function () {
                    $("#modal-test").modal("hide");
                    // document.location.replace(window.location.pathname);
                  }, 7000);
                });
            }, 800);
          } else {
            setTimeout(function () {
              $.when(
                $("#modal-test").find("form").first().fadeOut("slow")
              ).then(function () {
                let num = $(`.quiz-ans-button[data-pk="${data["pk"]}"`)
                  .first()
                  .data("num");
                $(this).off("hidden.bs.modal");
                callQuizModal(data["pk"], num);
              });
            }, 1000);
          }
        });
    })
    .catch((error) => {
      // // console.log((error);
    });
});

$("a.edu-item").bind("click", function (e) {
  let id = $(this).data("num");
  let url = "/api/v1/books/" + id;
  fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
  })
    .then((data) => {
      status = data.status;
      if (data.ok) {
        return data.json();
      }
    })
    .then((data) => {
      let images = data["_images"];
      $(".book-title").first().text(data["author"]);
      $(".book-text__content").first().append(data["title"]);
      if (images.length > 0) {
        $(".book-text__content").first().append('<img id="book-top-image"/>');
        $("#book-top-image").attr("src", images[0]["preview"]);
        images.shift();
      }

      $(".book-text__content").first().append(data["description"]);

      if (images.length > 0) {
        images.forEach((item) => {
          $(".book-text__content")
            .first()
            .append('<img src="' + item["preview"] + '" />');
        });
      }
      $(".book-text__content").fadeIn("slow");
    })
    .catch((error) => {
      // // console.log((error);
    });
});

$("#modal-book").on("hidden.bs.modal", function (e) {
  $(".book-text__content").first().empty();
  $(".book-text__content").fadeOut();
});


$("#modal-user").on("hidden.bs.modal", function(){
  console.log("LOOK HERE");
  $(".user-detail-not-found").remove();
  $(".user-detail-item:not(#detail-work-placeholder)").remove();
  $("#paginator-user-modal").empty();
  $("#modal-user .mprod-name").text('');
  $("#modal-user .mprod-age").text('');
  $("#modal-user").removeAttr("user-pk")
  $("#modal-user .gallery-items").append(`<div class="loader"></div>`);

});

$("a.prods-cloud").bind("click", function (e) {
  let id = $(this).data("num");
  let url = "/api/v1/products/" + id;
  fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
  })
    .then((data) => {
      status = data.status;
      if (data.ok) {
        return data.json();
      }
    })
    .then((data) => {
      $("div.mprod-text__content").first().empty();
      let images = data["_images"];
      $(".mprod-title").first().text(data["title"]);
      $("div.mprod-text__content").first().append(data["top_description"]);
      if (images.length > 0) {
        $("div.mprod-text__content")
          .first()
          .append('<img id="product-top-image">');
        $("#product-top-image").attr("src", images[0]["file"]);
        images.shift();
      }

      $("div.mprod-text__content").first().append(data["description"]);

      if (images.length > 0) {
        images.forEach((item) => {
          $("div.mprod-text__content")
            .first()
            .append('<img src="' + item["preview"] + '" />');
        });
      }
    })
    .catch((error) => {
      // // console.log((error);
    });
});

function ageRepresent(age) {
  if (10 < age && age < 20) {
    return "лет";
  } else if (age % 10 == 1) {
    return "год";
  } else if (1 < age % 10 && age % 10 < 5) {
    return "года";
  } else {
    return "лет";
  }
}

function getWeeklyWinners(pk) {
  $("#gallery-winners").prepend(`<div style="width:100%;" class="loader-container"><div class="loader"></div></div>`);

  let url = "/api/v1/weekly_competitions/" + pk;
  fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      status = data.status;
      return data.json();
    })
    .then((data) => {
      $("a.gallery-weeks__btn").addClass("btn--border");
      $(`a.gallery-weeks__btn[data-pk=${data["pk"]}]`).removeClass(
        "btn--border"
      );
      let weekly_winners = data["weekly_winners"];
      let winner_divs = $("#gallery-winners").children();
      $.when($("#gallery-winners > div:not(.loader-container)").fadeTo("fast", 0))
        .then(function () {
          $("#gallery-winners").empty();
          weekly_winners.forEach((item, ind) => {
            let div = $("#gallery-winner-placeholder").clone();
            div.removeAttr("style");
            div.removeAttr("id");

            let content = $(div).find(".gallery-item__content").first();
            let a_item = $(div).find("a.gallery-item__imgwrap").first();
            let img = a_item.find("img").first();

            a_item.attr("href", weekly_winners[ind]["best_work"]["file"]);
            a_item.attr(
              "data-caption",
              `${weekly_winners[ind]["full_name"]} <br> ${
                weekly_winners[ind]["age"]
              } ${ageRepresent(weekly_winners[ind]["age"])}`
            );
            a_item.attr("data-fancybox", "gallery4");
            a_item
              .find(".gallery-item__img")
              .first()
              .css(
                "background-image",
                `url(${weekly_winners[ind]["best_work"]["preview"]})`
              );

            let place = null;

            // if (ind == 0) {
            //   place = 3;
            // } else if (ind > 0 && ind < 3) {
            //   place = 2;
            // } else if (ind >= 3) {
            //   place = 1;
            // }

            place = ind < 5 ? 2 : 3;

            img.attr("src", `../../static/images/sprize${place}.png`);

            content
              .find(".gallery-item__name")
              .first()
              .text(`${weekly_winners[ind]["full_name"]}`);
            content
              .find(".gallery-item__name")
              .attr("data-pk", weekly_winners[ind]["pk"]);

            content
              .find(".gallery-item__age")
              .first()
              .text(
                `Возраст: ${weekly_winners[ind]["age"]} ${ageRepresent(
                  weekly_winners[ind]["age"]
                )}`
              );
            content
              .find(".gallery-item__like")
              .first()
              .text(weekly_winners[ind]["best_work"]["calculated_likes_count"]);

            $("#gallery-winners").append(div);
          });
        })
        .then(function () {
          $("#gallery-winners > .loader-container").remove();

          $("#gallery-winners").fadeTo("fast", 1);
        });
    })
    .catch((error) => {
      // // console.log((error);
    });
}

$("a.gallery-weeks__btn:not(#grand-winners-tab)").bind("click", function () {
  let pk = $(this).data("pk");
  getWeeklyWinners(pk);
});

$("#grand-winners-tab").bind("click", function () {
  let pk = $(this).data("pk");
  let url = "/api/v1/grand_competition/";
  
  fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      status = data.status;
      return data.json();
    })
    .then((data) => {
      $("a.gallery-weeks__btn").addClass("btn--border");
      $("#grand-winners-tab").removeClass("btn--border");
      let winners = data["grand_winners"];

      $.when($("#gallery-winners > div:not(.loader-container)").fadeTo("fast", 0))
        .then(function () {
          $("#gallery-winners > div:not(.loader-container)").remove();
          $("#gallery-winners").prepend(`<div style="width:100%;" class="loader-container"><div class="loader"></div></div>`);
          

          winners.forEach((item, ind) => {
            let div = $("#gallery-winner-placeholder").clone();
            div.removeAttr("style");
            div.removeAttr("id");

            let content = $(div).find(".gallery-item__content").first();
            let a_item = $(div).find("a.gallery-item__imgwrap").first();
            let img = a_item.find("img").first();

            a_item.attr("href", winners[ind]["best_work"]["file"]);
            a_item.attr(
              "data-caption",
              `${winners[ind]["full_name"]} <br> ${
                winners[ind]["age"]
              } ${ageRepresent(winners[ind]["age"])}`
            );
            a_item
              .find(".gallery-item__img")
              .first()
              .css(
                "background-image",
                `url(${winners[ind]["best_work"]["preview"]})`
              );

            img.attr("src", `../../static/images/sprize4.png`);

            content
              .find(".gallery-item__name")
              .first()
              .text(`${winners[ind]["full_name"]}`);
            content
              .find(".gallery-item__name")
              .first()
              .attr("data-pk", winners[ind]["pk"]);
            content
              .find(".gallery-item__age")
              .first()
              .text(
                `Возраст: ${winners[ind]["age"]} ${ageRepresent(
                  winners[ind]["age"]
                )}`
              );
            content
              .find(".gallery-item__like")
              .first()
              .text(winners[ind]["best_work"]["calculated_likes_count"]);

            $("#gallery-winners").append(div);
          });
        })
        .then(function () {
          $("#gallery-winners > .loader-container").remove();
          $("#gallery-winners").fadeTo("fast", 1);
        });
    })
    .catch((error) => {
      // // console.log((error);
    });
});

Share = {
  vk: function (purl, ptitle, pimg, text) {
    let url = "http://vk.com/share.php?";
    let img = window.location.origin + pimg;
    //   console.log(img);
    let u = window.location.origin + "/promo/gallery/";
    let t = "Пройди по ссылке, проголосуй за мою творческую работу";
    url += "url=" + encodeURIComponent(u);
    url += "&title=" + encodeURIComponent(t);
    url += "&image=" + encodeURIComponent(img);
    Share.popup(url);
  },
  ok: function (purl, text, pimg) {
    let img = window.location.origin + pimg;
    let u = window.location.origin + "/promo/gallery/";
    let t = "Пройди по ссылке, проголосуй за мою творческую работу";
    url = "https://connect.ok.ru/offer";
    url += "?url=" + encodeURIComponent(u);
    url += "&title=" + encodeURIComponent(u);
    url += "&imageUrl=" + encodeURIComponent(img);

    Share.popup(url);
  },
  facebook: function (purl, ptitle, pimg, text) {
    url = "https://www.facebook.com/sharer/sharer.php?";
    let u = window.location.origin + "/promo/gallery/";
    let t = "Пройди по ссылке, проголосуй за мою творческую работу";
    url += "&p[title]=" + encodeURIComponent(t);
    url += "&p[url]=" + encodeURIComponent(u);
    Share.popup(url);
  },

  tw: function (purl, ptitle, pimg, text) {
    url = "https://twitter.com/home?";
    let u = window.location.origin + "/promo/gallery/";
    let t = "Пройди по ссылке, проголосуй за мою творческую работу";
    url += "status=" + encodeURIComponent(u);
    url += "" + encodeURIComponent(t);
    Share.popup(url);
  },

  popup: function (url) {
    window.open(url, "", "toolbar=0,status=0,width=626,height=436");
  },
};
