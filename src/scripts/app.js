import '../styles/index.scss';
import 'bootstrap/js/dist/dropdown';
//import 'bootstrap/js/dist/tab';
import 'bootstrap/js/dist/tooltip';
import 'bootstrap/js/dist/popover';
import 'bootstrap4-datetimepicker';
import AutoComplete from 'devbridge-autocomplete';

(function($) {
  $.fn.swapSelect = function() {
    var buttonGroups = this;
    var init = () => {
      buttonGroups.each((index, group) => {
        const activeCls = $(group).data('activecls'),
          defaultCls = $(group).data('defaultcls');
        $('.btn', group).click((event) => {
          var button = $(event.target);
          button.siblings().removeClass(activeCls).addClass(defaultCls);
          button.removeClass(defaultCls).addClass(activeCls);
        }).eq(0).click(); // The default highlighted button;
      });
    };
    init();
    return this;
  };
}(jQuery));


$(document).ready(() => {

  /* declare variables here */
  const headerNav = $('header.has-nav');
  const asin = [{
      value: 'B018E65WW2',
      data: 'THERMO PURE Natural Fat Burner Caffeine Free Weight Loss Pills and Healthy Appetite Suppressant Dietary Supplement, 60 Capsule',
      imgUrl: 'images/B018E65WW2.jpg'
    },
    {
      value: 'B01BON4QAQ',
      data: 'PAIN-MD, Top Pain Relief Supplement, Fast Acting Natural Formula for Joint Pain Relief and Muscle Discomfort, More Flexibility with Anti-Inflammatory',
      imgUrl: 'images/B01BON4QAQ.jpg'
    },
    {
      value: 'B01NBHK5XX',
      data: 'Install Centric ICGM12BNGM 2005-16 Class II Complete Installation Solution for Car Stereos',
      imgUrl: 'images/B01NBHK5XX.jpg'
    },
    {
      value: 'B01EXS1NA0',
      data: 'New Domaine Shredded Latex Cooling pillow- Queen',
      imgUrl: 'images/B01EXS1NA0.jpg'
    },
  ];


  /* declare the functions here */
  const toggleSidebar = () => {
    var breakpoint = 768;
    if ($('.has-nav').length > 0) {
      breakpoint = 1200;
    }
    if ($(window).innerWidth() > breakpoint) {
      $('body').removeClass('is-collapsed');
    } else {
      $('body').addClass('is-collapsed');
    }
  };

  const setContentSpacing = () => {
    $('.content').css('padding-top', headerNav.innerHeight());
  };


  /* Plugin calls */
  $('.btn-group').swapSelect();

  $('.input-date').datetimepicker({
    format: 'MMM DD, YYYY',
    inline: false,
    useCurrent: false
  });

  $('.input-date .form-control').focus(function() {
    $(this).next().click();
  });

  $('#global-search').autocomplete({
    lookup: asin,
    formatResult: function(suggestion) {
      return '<div><img src="' + suggestion.imgUrl + '" style="width: 30px; height: 30px;"/> ' + suggestion.value + '</div>';
    },
    onSelect: function(suggestion) {
      $('#global-search').val(suggestion.data);
    }
  });


  /* register events here */
  $('.overlay').click(() => {
    toggleSidebar();
  });

  $(window).scroll(() => {
    if ($(window).scrollTop() > 50) {
      headerNav.addClass('is-scrolling');
    } else {
      headerNav.removeClass('is-scrolling');
    }
  });

  $(window).resize(() => {
    toggleSidebar();
    setContentSpacing();
  });

  $('.navbar-toggle').click(function(event) {
    event.preventDefault();
    $('body').toggleClass('is-collapsed');
  });

  $('.select-daterange').change(function() {
    var last = $('.select-daterange option:last-child');

    if (last.is(':selected')) {
      //var selected = $('.select-daterange option:selected').val().toLowerCase();
      $('#daterange').removeClass('d-none');
    } else {
      $('#daterange').addClass('d-none');
    }
  });

  $('.table-filters .badge').click(function(event) {
    event.preventDefault();
    var ele = $(event.target),
      tableFilters = ele.parent(),
      group = ele.attr('name'),
      filters = $('.badge', tableFilters),
      isAllOption = $(filters).index(ele) === 0,
      groupAll = $('[name="all"]', tableFilters),
      groupCogs = $('[name="cogs"]', tableFilters);

    if (group === 'all') {
      groupCogs.removeClass('bg-primary text-white').addClass('badge-secondary');
      if (isAllOption) {
        groupAll.addClass('bg-primary text-white');
      } else {
        groupAll.removeClass('bg-primary text-white').addClass('badge-secondary');
      }
    } else {
      groupAll.removeClass('bg-primary text-white').addClass('badge-secondary');
    }
    ele.addClass('bg-primary text-white');
  });

  $("#daterange-from").on("dp.change", function(e) {
    $('#daterange-to').data("DateTimePicker").minDate(e.date);
  });

  $("#daterange-to").on("dp.change", function(e) {
    $('#daterange-from').data("DateTimePicker").maxDate(e.date);
  });


  /* functions to be invoked on page init */
  toggleSidebar();
  setContentSpacing();



});
