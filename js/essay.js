var percentFlag = false; // Throttling flag

function essayScroll() {
    let scrollPosition = document.documentElement.scrollTop || window.pageYOffset; // 当前滚动位置
    const waterfallResult = scrollPosition % document.documentElement.clientHeight; // 滚动位置余数

    // 在此处声明并确保 result 被正确赋值
    let result = waterfallResult;

    if (!percentFlag && result + 100 >= document.documentElement.clientHeight && document.querySelector("#waterfall")) {
        setTimeout(() => {
            waterfall("#waterfall");
        }, 500);
    } else {
        setTimeout(() => {
            if (document.querySelector("#waterfall")) waterfall("#waterfall");
        }, 500);
    }

    const r = window.scrollY + document.documentElement.clientHeight;
    let p = document.getElementById("post-comment") || document.getElementById("footer");

    // 确保 result 被使用的地方逻辑正确
    if (p.offsetTop + p.offsetHeight / 2 < r || 90 < result) {
        percentFlag = true;
    }
}

function replaceAll(e, n, t) {
    return e.split(n).join(t);
}

var camelz = {
    diffDate: function (d, more = false) {
        const dateNow = new Date();
        const datePost = new Date(d);
        const dateDiff = dateNow.getTime() - datePost.getTime();
        const minute = 1000 * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const month = day * 30;

        let result;
        if (more) {
            const monthCount = dateDiff / month;
            const dayCount = dateDiff / day;
            const hourCount = dateDiff / hour;
            const minuteCount = dateDiff / minute;

            if (monthCount >= 1) {
                result = datePost.toLocaleDateString().replace(/\//g, "-");
            } else if (dayCount >= 1) {
                result = parseInt(dayCount) + " " + GLOBAL_CONFIG.dateSuffix.day;
            } else if (hourCount >= 1) {
                result = parseInt(hourCount) + " " + GLOBAL_CONFIG.dateSuffix.hour;
            } else if (minuteCount >= 1) {
                result = parseInt(minuteCount) + " " + GLOBAL_CONFIG.dateSuffix.min;
            } else {
                result = GLOBAL_CONFIG.dateSuffix.just;
            }
        } else {
            result = parseInt(dateDiff / day);
        }
        return result;
    },
    changeTimeInEssay: function () {
        document.querySelector("#bber") &&
        document.querySelectorAll("#bber time").forEach(function (e) {
            var t = e,
                datetime = t.getAttribute("datetime");
            (t.innerText = camelz.diffDate(datetime, true)), (t.style.display = "inline");
        });
    },
    reflashEssayWaterFall: function () {
        document.querySelector("#waterfall") &&
        setTimeout(function () {
            waterfall("#waterfall");
            document.getElementById("waterfall").classList.add("show");
        }, 500);
    },
    commentText: function (txt) {
        const postCommentDom = document.querySelector("#post-comment");
        var domTop = postCommentDom.offsetTop;
        window.scrollTo(0, domTop - 80);
        if (txt == "undefined" || txt == "null") txt = "好棒！";
        function setText() {
            setTimeout(() => {
                var input = document.getElementsByClassName("el-textarea__inner")[0];
                if (!input) setText();
                let evt = document.createEvent("HTMLEvents");
                evt.initEvent("input", true, true);
                let inputValue = replaceAll(txt, "\n", "\n> ");
                input.value = "> " + inputValue + "\n\n";
                input.dispatchEvent(evt);
                input.focus();
                input.setSelectionRange(-1, -1);
                if (document.getElementById("comment-tips")) {
                    document.getElementById("comment-tips").classList.add("show");
                }
            }, 100);
        }
        setText();
    },
    initIndexEssay: function () {
        setTimeout(() => {
            let essay_bar_swiper = new Swiper(".essay_bar_swiper_container", {
                passiveListeners: true,
                direction: "vertical",
                loop: true,
                autoplay: {
                    disableOnInteraction: true,
                    delay: 3000,
                },
                mousewheel: true,
            });

            let essay_bar_comtainer = document.getElementById("bbtalk");
            if (essay_bar_comtainer !== null) {
                essay_bar_comtainer.onmouseenter = function () {
                    essay_bar_swiper.autoplay.stop();
                };
                essay_bar_comtainer.onmouseleave = function () {
                    essay_bar_swiper.autoplay.start();
                };
            }
        }, 100);
    },
};

camelz.initIndexEssay();
camelz.changeTimeInEssay();
camelz.reflashEssayWaterFall();

window.addEventListener("scroll", essayScroll);
