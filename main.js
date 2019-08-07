$( document ).ready(function() {

  var currHdrBk = $("#currHdrBk");
  var fontSize = $("#fontSize");
  var smaller = $("#smaller");
  var bigger = $("#bigger");
  var headings = $("#headings");
  var table1 = $("#table1");
  var headingsBook = $("#table1 tr.br");
  var aRows = $("#table1 tr").not(".br");
  var headingsBookPrev = $("#br1");
  var elmAtTop = $("#br1");
  var elmAtTop2 = $("#br1").get(0);
  var panel2 = $("#panel2");
  var bkSortNormal = $("#bkSortNormal");
  var bkSortAZ = $("#bkSortAZ");
  var displayBtn = $("#displayBtn");
  // var ifr = $("#ifr");
  // var iframeDiv = $("#iframeDiv");

  var displayWin = "_self";
  var prevScrollTop = 0;
  var minFontSize = 14;
  var maxFontSize = 24;
  var id1 = "";
  var prevBook = "";
  var bibleBooks = ["","Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1+Samuel","2+Samuel","1+Kings","2+Kings","1+Chronicles","2+Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song+of+Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1+Corinthians","2+Corinthians","Galatians","Ephesians","Philippians","Colossians","1+Thessalonians","2+Thessalonians","1+Timothy","2+Timothy","Titus","Philemon","Hebrews","James","1+Peter","2+Peter","1+John","2+John","3+John","Jude","Revelation"];
  // var displayInThisWin = false;

  smaller.on("click", reduceFont);
  bigger.on("click", enlargeFont);
  $("#bkBtn").on("click", function() { panel2.css("z-index", "1" ); });
  $("#headingsBtn").on("click", function() { panel2.css("z-index", "-1" ); });
  table1.on("mouseup", function(e) { e.stopPropagation(); }); // Mouseup is for headings scroll bar, but not table1
  headings.on("mouseup", function() { window.setTimeout(setElmAtTop2, 700); });
  $(window).on("resize", function() { elmAtTop2.scrollIntoView(); }); // Experiemental function
  headings.scroll(getCurrHdrBk);
  table1.on("click", "a", getTextChoice);
  table1.on("contextmenu", "a", getText);
  $("#sortNorm").on("click", sortNorm);
  $("#sortAZ").on("click", sortAZ);
  $("#bkMenu .bk1a, #bkMenu .bk1b, #bkMenu .bk2a, #bkMenu .bk2b").on("click", "div", scrollToBook);
  $("#infoBtn").on("click", function() { $("#info1").css("display", "block"); });
  $("#closeInfo").on("click", function() { $("#info1").css("display", "none"); });
  $("#settingsBtn1").on("click", function() { $("#settingsMenu").show(); });
  $("#settingsBtn2").on("click", function() { $("#settingsMenu").show(); });
  $("#settingsMenu input").on("click", function () { displayWin = $(this).val(); });
  $("#closeSettings").on("click", function() { $("#settingsMenu").hide() });
  // displayBtn.on("click", toggleDisplayWin);
  // $("#bkBtn2").on("click", hideIframe);

  function reduceFont() {
    var size = parseInt(table1.css("font-size").replace("px",""), 10);
    if ( size <= minFontSize ) {
      return;
    }
    size--;
    resizeFont(size);
    if (size == minFontSize) {
      smaller.removeClass("activeBtn");
      smaller.addClass("inactiveBtn");
    }
    if (size == maxFontSize - 1) {
      bigger.removeClass("inactiveBtn");
      bigger.addClass("activeBtn");
    }
  }

  function enlargeFont() {
    var size = parseInt(table1.css("font-size").replace("px",""), 10);
    if (size >= maxFontSize) {
      return;
    }
    size++;
    resizeFont(size);
    if (size == maxFontSize) {
      bigger.removeClass("activeBtn");
      bigger.addClass("inactiveBtn");
    }
    if (size == minFontSize + 1) {
      smaller.removeClass("inactiveBtn");
      smaller.addClass("activeBtn");
    }
  }

  function resizeFont(size) {
    // Every time headings is moved,
    // try to determine element at the top and the scrollTop

    // This script does not detect mouse scroll.
    //
    // If headings is resized: element on top is constant, scrollTop is changed.
    // If scrollTop is reverted using mouse scroll, element on top has changed.
    // When this script sees prevScrollTop == scrollTop, it will use prev elemAtTop
    // which is not the current element on top.
    // This situation is rare, and the consequence is unimportant
    // to prevent the use of the previous elmAtTop.

    if (prevScrollTop != headings.scrollTop()) {
      setElmAtTop(size);
    }
    table1.css("font-size", size.toString() + "px");
    positionElmAtTop();
    showHideFont(size.toString());
    prevScrollTop = headings.scrollTop();
  }

  function positionElmAtTop(size) {
    // headings.scrollTop(0);
    // headings.scrollTop(elmAtTop.position().top);
    headings.scrollTop(headings.scrollTop() + elmAtTop.position().top);
  }

  function showHideFont(size) {
    fontSize.stop(true, true);
    currHdrBk.stop(true, true);

    fontSize.text("Font size: " + size);
    if (smaller.offset().left - currHdrBk.width() < 125) {
      currHdrBk.hide();
      currHdrBk.fadeIn(5000);
    }
    fontSize.css("display", "inline-block");
    fontSize.fadeOut(5000);
  }

  function setElmAtTop2() {
    // Every time headings is moved,
    // try to determine element at the top and the scrollTop

    if (prevScrollTop != headings.scrollTop()) {
      var size = parseInt(table1.css("font-size").replace("px",""), 10);
      setElmAtTop(size);
      prevScrollTop = headings.scrollTop();
    }
  }

  function setElmAtTop(size) {
    // We want to find the FIRST element with position().top > -size.
    // There are 2396 headings

    var left = 0; // First index = 0
    var right = aRows.length-1; // Last index = length-1 = 2395
    if (right <= 0) {
      alert("ERROR: 101");
      return;
    }
    binarySearch(size, left, right);
    elmAtTop2 = elmAtTop.get(0);
  }

  function binarySearch(size, left, right) {
    if (left == right) {
      elmAtTop = aRows.eq(left);
      if (aRows.eq(left).position().top < -size) {
        alert("ERROR: 102");
      }
      return;
    }
    if (aRows.eq(left).position().top >= -size) {
      elmAtTop = aRows.eq(left);
      return;
    }
    if (Math.abs(right-left) == 1) {
      elmAtTop = aRows.eq(right);
      return;
    }
    // Same as (left+right)/2.
    // https://en.wikipedia.org/wiki/Binary_search_algorithm#Implementation_issues
    var middle = Math.round(left+(right-left)/2);

    if (aRows.eq(middle).position().top >= -size) {
      binarySearch(size, left+1, middle);	// left < elmAtTop <= middle
    } else {
      binarySearch(size, middle+1, right);	// middle < elmAtTop <= right
    }
  }

  function sortNorm() {
    $("#sortAZ").removeClass("selectedOpt");
    $(this).addClass("selectedOpt");
    bkSortNormal.show();
    bkSortAZ.hide();
  }

  function sortAZ() {
    $("#sortNorm").removeClass("selectedOpt");
    $(this).addClass("selectedOpt");
    bkSortNormal.hide();
    bkSortAZ.show();
  }

  function getCurrHdrBk() {
    headingsBook.each(function() {
      if ($(this).position().top > 0) {
        if (prevBook != $(this).attr("id")) {
          currHdrBk.text($(this).attr("id").replace(/\+/g, " "));
          prevBook = $(this).attr("id");
        }
        return false;
      }
    });
  }

  function scrollToBook() {
    var bkClicked = $(this).text();
    var bkPlus = bkClicked.replace(/ /g, "+");
    headingsBook.each(function() {
      if ($(this).attr("id") == bkPlus) {
        headings.scrollTop(0);
        // .next() is the first heading for that book
        prevScrollTop = headingsBookPrev.next().position().top;
        headings.scrollTop(prevScrollTop);
        currHdrBk.text(bkClicked);
        panel2.css("z-index", "-1" );
        elmAtTop = headingsBookPrev.next()
        elmAtTop2 = elmAtTop.get(0);
        return false;
      } else {
        headingsBookPrev = $( this );
      }
    });
  }

  function getTextChoice() {
    setUrl($(this));
    $(this).attr("target", displayWin);
  }

  function getText() {
    setUrl($(this));
  }

  function setUrl(elm) {
    var parent1 = elm.parent().parent();
    var chapter = parent1.children("td:first-child");

    if (id1 != "") {
      $("#"+id1).removeClass("selectedRow");
    }
    parent1.addClass("selectedRow");
    id1 = parent1.attr("id");

    var bookId = id1.substring(0,2).replace(/^0/, "");
    var verse = id1.substring(5,8).replace(/^0+/, "");
    var url = `https://www.esv.org/${bibleBooks[bookId]}+${chapter.text()}:${verse}/`;
    //         https://www.esv.org/Song+of+Solomon+3:10/
    elm.attr("href", url);
  }

  // function toggleDisplayWin() {
  //   if (displayInThisWin == true) {
  //     displayInThisWin = false;
  //     displayBtn.removeClass("selectedOpt");
  //   } else {
  //     displayInThisWin = true;
  //     displayBtn.addClass("selectedOpt");
  //   }
  // }

  // function hideIframe() {
  //   if (iframeDiv.css("z-index") == "2") {
  //     iframeDiv.css("z-index", "-2");
  //     $(this).css("background-color", "#CCCCCC");
  //   }
  // }

  // function getText2(this1, parent1, chapter) {
  //  if (id1 != "") {
  //    $("#"+id1).removeClass("selectedRow");
  //  }
  //  parent1.addClass("selectedRow");
  //  id1 = parent1.attr("id");
  //  var id2 = id1.substring(1,3).replace(/^0/, "");
  //  var currChapter = bibleBooks[id2] + "+" + chapter.text();
  //  this1.attr("href", 'http://www.esvbible.org/' + currChapter + '/#' + id1);
  //
  //   var url = 'http://www.esvbible.org/' + currChapter + '/#' + id1;
  //   if (displayInThisWin == true && $(window).width() >= 799) {
  //     ifr.attr("src", url);
  //     iframeDiv.css("z-index", "2");
  //     bkBtn2.css("background-color", colorActive); // "#90FFC0";
  //   } else {
  //     window.open(url, "newEsvBibleWin");
  //   }
  // }
});
$(window).on("load", function() {$(document.body).show()});
