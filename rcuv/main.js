$( document ).ready(function() {
  var visibleDefs = new Map();
  var defClicked = false;
  var subDefClicked = false;
  var clickedElm = null;

  $("td + td").on("mouseenter", "span", mouseenterWord);
  $("td + td").on("mouseleave", "span", hideDef);
  $("td + td").on("click", "span", toggleDef);

  $("tr > td:first-child span").on("mouseenter", showSubDef);
  $("tr > td:first-child span").on("mouseleave", hideSubDef);

  $("#t1 div > table").on("mouseenter", removeHl);
  $("tr > td:first-child span").on("click", toggleSubDef);

  $(".fnOpen").on("click", openFootnote);
  function openFootnote() {
    $(this).next().toggle();
  }
  function mouseenterWord() {
    if (defClicked == true) { return; }
    showDef($(this));
  }
  function showDef(this1) {
    this1.addClass("hl");
    if (this1.data("altdef")) { // There are alternative definitions
      var defsdiv = this1.next("div");
      var def1 = $("#"+this1.text());
      var def2 = $("#" + this1.data("altdef"));
      def1.addClass("altdef");
      def2.addClass("altdef");
      defsdiv.append(def1, def2);
      defsdiv.show();
      def1.show();
      def2.show();

      var subWord = def1.find("td:first-child > span:first-child");
      var subDef = $("#" + subWord.text());
      subWord.addClass("hl");
      subWord.closest("table").after(subDef);
      subDef.addClass("subDef");
      subDef.show();

      //console.log(this1.parent().html());
    } else { // Only one definition
      var def = $("#"+this1.text());
      def.addClass("def");
      this1.after(def);
      def.show();
    }
  }
  function hideDef() {
    if (defClicked == true) { return; }
    $(this).removeClass("hl");
    if ($(this).data("altdef")) {
      $(this).next("div").hide();
      $(this).next("div").find("div").each(function() {
        $(this).removeClass("altdef");
        $(this).removeClass("subDef");
      });
      $(this).next("div").find("span").removeClass("hl");
    } else {
      $("#"+$(this).text()).hide();
      $("#"+$(this).text()).removeClass("def");
    }
  }
  function toggleDef() {
    // If defs are visible and belong to clicked word
    //   hide it
    // Else
    //   hide all
    //   Show def for current word

    if (clickedElm) {
      $(clickedElm).parent().children("div:visible:not(\".footnote\")")
        .each(function(){
        $(this).hide();
        $(this).removeClass("def");
        $(this).removeClass("altdef");
        $(this).find(".subDef").each(function() {
          $(this).removeClass("subDef");
          $(this).hide();
        });
        $(this).find("span").removeClass("hl");
      });
      $(clickedElm).removeClass("hl");
    }
    if ($(this).get(0) == clickedElm) {
      defClicked = false;
      clickedElm = null;
    } else {
      defClicked = true;
      clickedElm = $(this).get(0);
      showDef($(this));
    }
  }
  function showSubDef() {
    event.stopPropagation();
    if (subDefClicked == true) { return; }
    $(this).closest("table").nextAll("div").hide();
    $(this).closest("table").nextAll("div").removeClass("subDef");
    $(this).parent().children().removeClass("hl");

    $(this).addClass("hl");
    var def = $("#"+$(this).text());
    $(this).closest("table").after(def);
    def.addClass("subDef");
    def.show();
    //console.log($(this).closest("div").closest("div").parent().html());
  }
  function hideSubDef() {
    event.stopPropagation();
    if (subDefClicked == true) { return; }
    $(this).closest("table").nextAll("div").hide();
    $(this).closest("table").nextAll("div").removeClass("subDef");
    $(this).parent().children().removeClass("hl");
  }
  function removeHl() {
    event.stopPropagation();
    if (subDefClicked == true) { return; }
    $(this).find("span").removeClass("hl");
  }
  function toggleSubDef() {
    // Short version:
    // If (subDefs exist) & (is visible) & (belongs to current word) & (subdefClicked is true)
    //   Hide it
    // Else:
    //   Hide all subDefs
    //   Show current def
    //
    // Long version:
    // If no subdefs
    //   show currrent def
    // Else
    //   if subdef is visible
    //     if belongs to current word
    //       hide it
    //     else
    //       hide it
    //       show current def
    //   else
    //     show current def

    event.stopPropagation();

    var currentDefVisible = false;

    if (subDefClicked == true) {
      $(this).parent().children().removeClass("hl");

      // Hide sub defs
      var this1 = $(this);
      $(this).closest("table").nextAll("div:visible").each(function() {
        $(this).hide();
        $(this).removeClass("subDef");
        if ($(this).attr("id") == this1.text()) {
          subDefClicked = false;
          currentDefVisible = true;
        }
      });
    }
    if (currentDefVisible == true) {
      return;
    }
    // Current Def is not visible, so we show it.
    //$(this).closest("table").nextAll("div").hide();
    var def = $("#"+$(this).text());
	$(this).closest("table").after(def);
    $(this).addClass("hl");
    def.addClass("subDef");
    def.show();
    subDefClicked = true;
  }
});
