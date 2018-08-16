"use strict";

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/* Main tab overflow class */
var tabOverflowIns = (function() {
  /* Constructor class to create instance of tabs container */
  function tabOverflowIns(main, params) {
    _classCallCheck(this, tabOverflowIns);

    this.main = main;
    var defaultParams = {
      header: main.querySelector(".header ul"),
      content: main.querySelector(".content-body"),
      tabcontainer: main.querySelector(".tabs"),
      headers: main.querySelectorAll(":scope > .header ul li"),
      tabs: main.querySelectorAll(":scope > .content-body > .tabs > .tab"),
      la: main.querySelector(".arrow.l"),
      ra: main.querySelector(".arrow.r"),
      line: main.querySelector(".underline"),
      num: 1,
      showArrows: false,
      step: 1
    };

    /* Object.assign to copy the values into params Object  */

    Object.assign(defaultParams, params);
    this.animations = this.animations();
    this.setWindowResizeEvent();
    this.refresh(defaultParams);
    this.setClickEvents();
    /* Add into tabOverflowIns Main */
    tabOverflowIns.addInstance(this);
  }

  _createClass(
    tabOverflowIns,
    [
      {
        key: "refresh",
        value: function refresh() {
          var params =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {};

          Object.assign(this, params);
          if (this.tabs.length < 1) return;
          debugger;
          this.width = this.showArrows
            ? (this.main.offsetWidth - 80) / this.num
            : this.main.offsetWidth;
          this.setProps();
          this.active = params.active || this.active || 0;
        }
      },
      {
        key: "next",
        value: function next() {
          if (this.hasNext()) {
            this.active = this._active + this.step;
          }
        }
      },
      {
        key: "hasNext",
        value: function hasNext() {
          if (this.active == this.tabs.length - this.num) {
            return false;
          }
          return true;
        }
      },
      {
        key: "prev",
        value: function prev() {
          if (this.hasPrev()) {
            this.active = this._active - this.step;
          }
        }
      },
      {
        key: "hasPrev",
        value: function hasPrev() {
          if (this.active == 0) {
            return false;
          }
          return true;
        }
      },
      {
        key: "getTabNumber",
        value: function getTabNumber(i) {
          var l = this.tabs.length - this.num + 1;
          return i < 0 ? i + l : i % l;
        }
      },
      {
        key: "setProps",
        value: function setProps() {
          var _this = this;

          if (this.showArrows) {
            this.tabcontainer.style.width =
              this.tabs.length * this.width + 40 + "px";
            this.content.style.padding = "0 40px";
          } else {
            /* Accomodate arrow widths */
            this.tabcontainer.style.width =
              this.tabs.length * this.width + "px";
            this.line.style.width = this.headers[0].offsetWidth + "px";
            if (this.la) this.la.style.display = "none";
            if (this.ra) this.ra.style.display = "none";
          }
          this.setheaderProps();

          this.tabcontainer.style.height = "auto";
          this.setScrollEvent();
          /* Create array from tabs and add widths */
          Array.from(this.tabs).forEach(function(e) {
            return (e.style.width = _this.width + "px");
          });
        }
      },
      {
        key: "setheaderProps",
        value: function setheaderProps() {
          var _this2 = this;

          var me = this,
            left = 0;
          this.headerProps = {};
          /* Create array from headers and add widths */
          Array.from(this.headers).forEach(function(elem, i) {
            _this2.headerProps[i] = {
              width: elem.offsetWidth,
              left: left
            };
            left += elem.offsetWidth;
            elem.addEventListener("click", function() {
              me.active = i;
            });
          });
          var last = this.headerProps[this.headers.length - 1];
          this.header.style.width = last.left + last.width + 1 + "px";
        }
      },
      {
        key: "setClickEvents",
        value: function setClickEvents() {
          var me = this;
          if (this.la) {
            this.la.addEventListener(
              "click",
              function() {
                me.prev();
              },
              {
                passive: true,
                capture: false
              }
            );
          }
          if (this.ra) {
            this.ra.addEventListener(
              "click",
              function() {
                me.next();
              },
              {
                passive: true,
                capture: false
              }
            );
          }
        }
      },
      {
        key: "setScrollEvent",
        value: function setScrollEvent() {
          var me = this,
            isScrolling = void 0;
          me.content.addEventListener("scroll", function() {
            requestAnimationFrame(onScroll);
          });

          function onScroll() {
            var per = (me.content.scrollLeft % me.width) / me.width;
            var t = Math.floor(me.content.scrollLeft / me.width);
            /* Need to add logic for scroll single slides */

            try {
              var left =
                me.headerProps[t].left * (1 - per) +
                me.headerProps[t + 1].left * per;
              var width =
                me.headerProps[t].width * (1 - per) +
                me.headerProps[t + 1].width * per;
              me.line.style.left = left + "px";
              me.line.style.width = width + "px";
              me.header.parentElement.scrollLeft =
                left - (me.width - width) / 2;
            } catch (e) {}

            clearTimeout(isScrolling);
            isScrolling = setTimeout(function() {
              if (per >= 0.5) {
                me.active = t + 1;
              } else {
                me.active = t;
              }
            }, 100);
          }
        }
      },
      {
        key: "setWindowResizeEvent",
        value: function setWindowResizeEvent() {
          var me = this;
          window.addEventListener("resize", function() {
            me.refresh();
          });
        }
      },
      {
        key: "animate",
        value: function animate(who, what, to, time) {
          var type =
            arguments.length > 4 && arguments[4] !== undefined
              ? arguments[4]
              : "linear";

          var from = who[what];
          var diff = to - from;
          var step = (1 / Math.round(time / 16)) * diff;
          var me = this;
          var pos = 0,
            raf = void 0,
            startTime = performance.now();

          function frame(currentTime) {
            if (currentTime - startTime > time) {
              who[what] = to;
              return;
            }
            var percent = (currentTime - startTime) / time;
            who[what] = Math.round(
              me.animations[type].call(this, percent) * diff + from
            );
            requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
        }
      },
      {
        key: "animations",
        value: function animations() {
          return {
            linear: function linear(i) {
              return i;
            },
            easeOut: function easeOut(i) {
              return i * (2 - i);
            }
          };
        }
      },
      {
        key: "active",
        get: function get() {
          return this._active;
        },
        set: function set(i) {
          i = this.getTabNumber(i);
          this._active = i;
          this.animate(this.content, "scrollLeft", i * this.width, 300);
          removeExceptOne(this.tabs, "active", i);
          removeExceptOne(this.tabs, "prev", this.getTabNumber(i - 1));
          removeExceptOne(this.tabs, "next", this.getTabNumber(i + 1));
          removeExceptOne(this.headers, "active", i);
          removeExceptOne(this.headers, "prev", this.getTabNumber(i - 1));
          removeExceptOne(this.headers, "next", this.getTabNumber(i + 1));
          if (this.showArrows) {
            this.la.style.display = this.hasPrev() ? "block" : "none";
            this.ra.style.display = this.hasNext() ? "block" : "none";
          }
        }
      }
    ],
    [
      {
        key: "new",
        value: function _new(main) {
          var params =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {};

          return new tabOverflowIns(main, params);
        }
      },
      {
        key: "all",
        value: function all() {
          return this.sts;
        }
      },
      {
        key: "addInstance",
        value: function addInstance(i) {
          this.sts.push(i);
        }
      },
      {
        key: "refreshAll",
        value: function refreshAll() {
          this.all().forEach(function(st) {
            return st.refresh();
          });
        }
      }
    ]
  );

  return tabOverflowIns;
})();
/* addClass & removeClass */

function removeExceptOne(elems, classN, index) {
  for (var j = 0; j < elems.length; j++) {
    if (j !== index && elems[j] !== index) {
      elems[j].classList.remove(classN);
    } else {
      elems[j].classList.add(classN);
    }
  }
}

/* Create NS array */
tabOverflowIns.sts = tabOverflowIns.sts || [];
