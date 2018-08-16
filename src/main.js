/* Main tab overflow class */
class tabOverflowIns {

    /* Constructor class to create instance of tabs container */
    constructor(main, params) {
        this.main = main;
        let defaultParams = {
            header: main.querySelector(".header ul"),
            content: main.querySelector(".content-body"),
            tabcontainer: main.querySelector(".tabs"),
            /* scoped to find only children */
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
    refresh(params = {}) {
        Object.assign(this, params);
        if (this.tabs.length < 1) return;
        this.width = this.showArrows ? (this.main.offsetWidth - 80) / this.num : this.main.offsetWidth;
        this.setProps();
        this.active = params.active || this.active || 0;
    }
    get active() {
        return this._active;
    }
    set active(i) {
        i = this.getTabNumber(i);
        this._active = i;
        this.animate(this.content, 'scrollLeft', i * this.width, 300);
        removeExceptOne(this.tabs, 'active', i);
        removeExceptOne(this.tabs, 'prev', this.getTabNumber(i - 1));
        removeExceptOne(this.tabs, 'next', this.getTabNumber(i + 1));
        removeExceptOne(this.headers, 'active', i);
        removeExceptOne(this.headers, 'prev', this.getTabNumber(i - 1));
        removeExceptOne(this.headers, 'next', this.getTabNumber(i + 1));
        if (this.showArrows) {
            this.la.style.display = this.hasPrev() ? "block" : "none";
            this.ra.style.display = this.hasNext() ? "block" : "none";
        }
    }
    next() {
        if (this.hasNext()) {
            this.active = this._active + this.step;
        }
    }
    hasNext() {
        if (this.active == this.tabs.length - this.num) {
            return false;
        }
        return true;
    }
    prev() {
        if (this.hasPrev()) {
            this.active = this._active - this.step;
        }
    }
    hasPrev() {
        if (this.active == 0) {
            return false;
        }
        return true;
    }
    getTabNumber(i) {
        let l = this.tabs.length - this.num + 1;
        return i < 0 ? i + l : i % l;
    }
    setProps() {
        if (this.showArrows) {
            this.tabcontainer.style.width = this.tabs.length * this.width + 40 + 'px';
            this.content.style.padding = `0 40px`;
        } else {
            /* Accomodate arrow widths */
            this.tabcontainer.style.width = this.tabs.length * this.width + 'px';
            this.line.style.width = this.headers[0].offsetWidth + 'px';
            if (this.la) this.la.style.display = 'none';
            if (this.ra) this.ra.style.display = 'none';
        }
        this.setheaderProps();
        
        this.tabcontainer.style.height = 'auto';
        this.setScrollEvent();
        /* Create array from tabs and add widths */
        Array.from(this.tabs).forEach(e => e.style.width = this.width + 'px');
    }
    setheaderProps() {
        let me = this,
            left = 0;
        this.headerProps = {};
        /* Create array from headers and add widths */
        Array.from(this.headers).forEach((elem, i) => {
            this.headerProps[i] = {
                width: elem.offsetWidth,
                left: left
            }
            left += elem.offsetWidth;
            elem.addEventListener("click", function() {
                me.active = i;
            });
        });
        let last = this.headerProps[this.headers.length - 1];
        this.header.style.width = last.left + last.width + 1 + 'px';
    }
    setClickEvents() {
        let me = this;
        if (this.la) {
            this.la.addEventListener('click', function() {
                me.prev();
            }, {
                passive: true,
                capture: false
            });
        }
        if (this.ra) {
            this.ra.addEventListener('click', function() {
                me.next();
            }, {
                passive: true,
                capture: false
            });
        }
    }
    setScrollEvent() {
        let me = this,
            isScrolling;
		let startX = 0, direction = "";
		
        me.content.addEventListener("scroll", function() {
			event.preventDefault();
			event.stopPropagation();
            onScroll();
        });

		me.content.addEventListener("touchmove", function() {
			var touchPos = getTouchPoint(event);
			var xDisplacement = touchPos.X - startX;
			
			if(xDisplacement < 0 && Math.abs(xDisplacement) > (me.width/3))
				direction = "right";
			else if(Math.abs(xDisplacement) > (me.width/3))
				direction = "left";
			else
				direction = "";
			event.preventDefault();
			event.stopPropagation(); 
			
        }, false);		
		
		me.content.addEventListener("touchend", function() {
			if(direction == "right"){
				requestAnimationFrame(onTouchStartRight);  
			} else if(direction == "left"){	
				requestAnimationFrame(onTouchStartLeft); 
			}
		}, false);

		me.content.addEventListener("touchstart", function() {
			if (event.touches && event.touches[0]) {
                startX = event.touches[0].clientX;               
            } /*else {
                startX = event.originalEvent.pageX;                
            } */		
        }, false);

		function onTouchStartRight(){

			var t  = me.active?(me.active+1) : 1;
			if(me.headerProps[t]){
				const left =  me.headerProps[t].left;
				const width = me.headerProps[t].width ;

				me.line.style.left = left + 'px';
				me.line.style.width = width + 'px';
				me.header.parentElement.scrollLeft = left - (me.width - width) / 2;
				

				clearTimeout(isScrolling);
				isScrolling = setTimeout(function() {
				   me.active += 1;
				}, 100);
			}
		}

		function onTouchStartLeft(){
			if(me.active >0){
				var t  = me.active?(me.active-1) : 1;
			
				const left =  me.headerProps[t].left;
				const width = me.headerProps[t].width ;

				me.line.style.left = left + 'px';
				me.line.style.width = width + 'px';
				me.header.parentElement.scrollLeft = left - (me.width - width) / 2;				

				clearTimeout(isScrolling);
				isScrolling = setTimeout(function() {
						me.active -= 1;
				}, 100);
			}
		}
		
		
        function onScroll() {
            const per = (me.content.scrollLeft % me.width) / me.width;
            const t = Math.floor(me.content.scrollLeft / me.width);
            
                try {
                    const left = me.headerProps[t].left * (1 - per) + me.headerProps[t + 1].left * per;
                    const width = me.headerProps[t].width * (1 - per) + me.headerProps[t + 1].width * per;
                    me.line.style.left = left + 'px';
                    me.line.style.width = width + 'px';
                    me.header.parentElement.scrollLeft = left - (me.width - width) / 2;
                } catch (e) {}
            
            
        }
		
    }
    setWindowResizeEvent() {
        let me = this;
        window.addEventListener("resize", function() {
            me.refresh();
        });
    }
    animate(who, what, to, time, type = 'linear') {
        who.style.display = "none";
        const from = who[what];
        const diff = to - from;
        const step = 1 / Math.round(time / 16) * diff;
        let me = this;
        let pos = 0,
            raf, startTime = performance.now();

        function frame(currentTime) {
            if (currentTime - startTime > time) {
                who[what] = to;
                return;
            }
            let percent = (currentTime - startTime) / time;
            who[what] = Math.round(me.animations[type].call(this, percent) * diff + from);
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        who.style.display = "block";
    }
    animations() {
        return {
            linear: i => i,
            easeOut: i => i * (2 - i)
        };
    }
    static new(main, params = {}) {
        return new tabOverflowIns(main, params);
    }
    static all() {
        return this.sts;
    }
    static addInstance(i) {
        this.sts.push(i);
    }
    static refreshAll() {
        this.all().forEach(st => st.refresh());
    }
}
/* addClass & removeClass */
function removeExceptOne(elems, classN, index) {
    for (let j = 0; j < elems.length; j++) {
        if (j !== index && elems[j] !== index) {
            elems[j].classList.remove(classN);
        } else {
            elems[j].classList.add(classN);
        }
    }
}

function getTouchPoint(e) {
	var xPos, yPos;
	if (e.touches && e.touches[0]){
		xPos = e.touches[0].clientX;
		yPos = e.touches[0].ckientY;
	}
	return {
		X: xPos,
		Y: yPos
	};
}
/* Create NS array */
tabOverflowIns.sts = tabOverflowIns.sts || [];
