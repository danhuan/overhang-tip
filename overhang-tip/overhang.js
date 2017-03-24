/**
 * overhang.js
 * Paul Krishnamurthy 2016
 * https://github.com/paulkr/overhang.js
 * demo:http://demo.htmleaf.com/1608/201608231526/index.html
 */
/*
 *使用方法:
 (1)引入文件:
 <script type="text/javascript" src="path/to/jquery/2.1.4/jquery.min.js"></script>
 <link rel="stylesheet" type="text/css" href="path/to/overhang.min.css" />
 <script type="text/javascript" src="path/to/overhang.min.js"></script>

 (2)调用方法:
 //  默认不传参数,显示"保存成功"
 $("body").overhang({});
 //    成功
 $("body").overhang({
 type: "success",
 message: "Woohoo! It works!"
 });
 //    失败
 $("body").overhang({
 type: "error",
 message: "Whoops! Something went wrong!",
 closeConfirm: true  //为true时,有手动关闭按钮,不会自动关闭
 });
 //警告
 $("body").overhang({
 type: "warn",
 message: "A user has reported you!",
 duration: 3
 });

 //    手动关闭
 $("body").overhang({
 type: "error",
 message: "Whoops! Something went wrong!",
 closeConfirm: true
 });
 //    设置时间关闭
 $("body").overhang({
 type: "info",
 message: "This message will close in 5 seconds!",
 duration: 5,
 upper: true
 });

 //输入框
 $("body").overhang({
 type: "prompt",
 message: "What's your name?"
 });

 //确认框
 $("body").overhang({
 type: "confirm",
 message: "Are you sure?"
 });


 //自定义
 $("body").overhang({
 custom: true,
 textColor: "#FCE4EC",
 primary: "#F06292",
 accent: "#FCE4EC",
 message: "This is my custom message 😜"
 });


 */

$.fn.overhang = function (arguments) {

  var $element = $(this);
  var $overhang = $("<div class='overhang'></div>");

  $(".overhang").remove();

  // FlatUI color themes
  var themes = {
    "success" : ["#2ECC71", "#27AE60"],
    "error"   : ["#E74C3C", "#C0392B"],
    "warn"    : ["#E67E22", "#D35400"],
    "info"    : ["#3498DB", "#2980B9"],
    "prompt"  : ["#9B59B6", "#8E44AD"],
    "confirm" : ["#1ABC9C", "#16A085"],
    "blank"   : ["#34495E", "#2C3E50"]
  };

  // Default attributes
  var defaults = {
    type         : "success",//消息通知框的类型:success，error，warn，info，prompt和confirm。
    message      : "操作成功!",//提示框中的内容
    textColor    : "#FFFFFF",//文本的颜色，默认为白色
    yesMessage   : "Yes",//确认按钮上的文本
    noMessage    : "No",//取消按钮上的文本
    yesColor     : "#2ECC71",//确认按钮的颜色
    noColor      : "#E74C3C",//取消按钮的颜色
    duration     : 1.5,//显示提示框的持续时间1.5s
    speed        : 500,//提示框向下弹出或向上缩回的时间
    closeConfirm : false,//是否自动关闭提示框，默认为false
    upper        : false,//是否将内容全部转换为大写字母
      //easing: "easeOutBounce",//JQuery UI的easing效果 （注：去掉，为了不引入JQuery UI插件）
    html         : false,//该参数设置message参数的内容是否为HTML
    callback     : function () {}
  };

  var attributes = $.extend(defaults, arguments);

  // Raise the overhang alert
  function raise (runCallback) {
    $overhang.slideUp(attributes.speed, function () {
      if (runCallback) {
        attributes.callback();
      }
    });
  }

  // Handle invalid type name
  var validTypes = ["success", "error", "warn", "info", "prompt", "confirm"];
  if ($.inArray(attributes.type, validTypes) === -1) {
    attributes.type = "blank";

    // Notify the user
    console.log("You have entered invalid type name for an overhang message.");
  }

  // Set attribut primary and accent colors
  if (arguments.custom) {
    attributes.primary = arguments.primary;
    attributes.accent  = arguments.accent;
  } else {
    attributes.primary = themes[attributes.type][0] || "#ECF0F1";
    attributes.accent  = themes[attributes.type][1] || "#BDC3C7";
  }

  if (attributes.type === "prompt" || attributes.type === "confirm") {
    attributes.primary      = arguments.primary || themes[attributes.type][0];
    attributes.accent       = arguments.accent  || themes[attributes.type][1];
    attributes.closeConfirm = true;
  }

  // Style colors
  $overhang.css("background-color", attributes.primary);
  $overhang.css("border-bottom", "6px solid " + attributes.accent);

  // Message
  var $message = $("<span class='message'></span>");
  $message.css("color", attributes.textColor);

  // Assign html or text
  if (attributes.html) {
    $message.html(attributes.message);
  } else {
    $message.text(attributes.upper ? attributes.message.toUpperCase() : attributes.message);
  }

  $overhang.append($message);

  // Additional overhang elements
  var $inputField = $("<input class='prompt-field' />");
  var $yesButton = $("<button class='yes-option'>" + attributes.yesMessage + "</button>");
  var $noButton = $("<button class='no-option'>" + attributes.noMessage + "</button>");

  $yesButton.css("background-color", attributes.yesColor);
  $noButton.css("background-color", attributes.noColor);

  // Close button
  if (attributes.closeConfirm) {
    var $close = $("<span class='close'></span>");
    $close.css("color", attributes.accent);

    if (attributes.type !== "confirm") {
      $overhang.append($close);
    }
  }

  if (attributes.type === "prompt") {
    $overhang.append($inputField);
    $element.data("overhangPrompt", null);

    // Submit action
    $inputField.keydown(function (e) {
      if (e.keyCode == 13) {

        // Append the data to the DOM element
        $element.data("overhangPrompt", $inputField.val());
        raise(true);
      }
    });

  } else if (attributes.type === "confirm") {

    $overhang.append($yesButton);
    $overhang.append($noButton);

    $overhang.append($close);

    $element.data("overhangConfirm", null);

    // Append selection to DOM element
    $yesButton.click(function () {
      $element.data("overhangConfirm", true);
      raise(true);
    });

    $noButton.click(function () {
      $element.data("overhangConfirm", false);
      raise(true);
    });

  }

  // Attack overhang to element
  $element.append($overhang);

  // Animate drop down and up
  if (attributes.closeConfirm) {
    $overhang.slideDown(attributes.speed/*, attributes.easing*/);

    $close.click(function () {
      if (attributes.type !== "prompt" && attributes.type !== "confirm") {
        raise(true);
      } else {
        raise();
      }

    });
  } else {
    $overhang
      .slideDown(attributes.speed/*, attributes.easing*/)
      .delay(attributes.duration * 1000)
      .slideUp(attributes.speed, function () {
        raise(true);
      });
  }

}

var MsgTip = function () {
};
MsgTip.prototype = {
    success: function(msg) {
        $("body").overhang({
            type: "success",
            message: msg||'操作成功！'
        });
    },

    error: function(msg) {
        $("body").overhang({
            type: "error",
            message: msg||'请求失败！'
        });
    },

    warn:function(msg) {
        $("body").overhang({
            type: "warn",
            message: msg||'警告'
        });
    }
};
var msgtip = new MsgTip();
$(function(){
    //引用方法
    msgtip.success();
    //msgtip.success("保存成功！");
    //msgtip.error("错误！");
    //msgtip.warn("警告！");
});
