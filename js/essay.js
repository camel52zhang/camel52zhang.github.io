// 节流阀
var percentFlag = false;

// 防抖函数，优化滚动事件的频繁触发
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// 优化后的滚动处理函数
function essayScroll() {
    let scrollTop = document.documentElement.scrollTop || window.pageYOffset; // 当前滚动位置
    const waterfallResult = scrollTop % document.documentElement.clientHeight; // 滚动的视口高度余数

    if (
        !percentFlag &&
        waterfallResult + 100 >= document.documentElement.clientHeight &&
        document.querySelector("#waterfall")
    ) {
        waterfall("#waterfall"); // 直接调用瀑布流函数，不再使用 setTimeout
    } else {
        waterfall("#waterfall");
    }

    const scrollBottom = window.scrollY + document.documentElement.clientHeight;
    let p = document.getElementById("post-comment") || document.getElementById("footer");

    if (p && (p.offsetTop + p.offsetHeight / 2 < scrollBottom || 90 < waterfallResult)) {
        percentFlag = true;
    }
}

// 直接使用原生 replaceAll
function replaceAll(str, find, replace) {
    return str.replaceAll(find, replace);
}

// 优化后的 camelz 对象
var camelz = {
    diffDate: function (date, more = false) {
        const dateNow = new Date();
        const datePost = new Date(date);
        const dateDiff = dateNow - datePost;

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
                result = parseInt(dayCount) + " " + GLOBAL_CONFIG.date_suffix.day;
            } else if (hourCount >= 1) {
                result = parseInt(hourCount) + " " + GLOBAL_CONFIG.date_suffix.hour;
            } else if (minuteCount >= 1) {
                result = parseInt(minuteCount) + " " + GLOBAL_CONFIG.date_suffix.min;
            } else {
                result = GLOBAL_CONFIG.date_suffix.just;
            }
        } else {
            result = parseInt(dateDiff / day);
        }
        return result;
    },
    changeTimeInEssay: function () {
        document.querySelector("#bber") &&
        document.querySelectorAll("#bber time").forEach(function (timeElement) {
            const datetime = timeElement.getAttribute("datetime");
            timeElement.innerText = camelz.diffDate(datetime, true);
            timeElement.style.display = "inline";
        });
    },
    reflashEssayWaterFall: function () {
        document.querySelector("#waterfall") &&
        requestAnimationFrame(function () {
            waterfall("#waterfall");
            document.getElementById("waterfall").classList.add("show");
        });
    },
    commentText: function (txt = "好棒！") {
        const postCommentDom = document.querySelector("#post-comment");
        const domTop = postCommentDom.offsetTop;
        window.scrollTo(0, domTop - 80);

        function setText() {
            requestAnimationFrame(() => {
                const input = document.querySelector(".el-textarea__inner");
                if (!input) return setText();
                
                let evt = new Event("input", { bubbles: true });
                let inputValue = replaceAll(txt, "\n", "\n> ");
                input.value = `> ${inputValue}\n\n`;
                input.dispatchEvent(evt);
                input.focus();
                input.setSelectionRange(-1, -1);

                const commentTips = document.getElementById("comment-tips");
                if (commentTips) {
                    commentTips.classList.add("show");
                }
            });
        }
        setText();
    },
    initIndexEssay: function () {
        setTimeout(() => {
            const essayBarSwiper = new Swiper(".essay_bar_swiper_container", {
                passiveListeners: true,
                direction: "vertical",
                loop: true,
                autoplay: {
                    disableOnInteraction: true,
                    delay: 3000,
                },
                mousewheel: true,
            });

            const essayBarContainer = document.getElementById("bbtalk");
            if (essayBarContainer) {
                essayBarContainer.onmouseenter = function () {
                    essayBarSwiper.autoplay.stop();
                };
                essayBarContainer.onmouseleave = function () {
                    essayBarSwiper.autoplay.start();
                };
            }
        }, 100);
    },
};

camelz.initIndexEssay();
camelz.changeTimeInEssay();
camelz.reflashEssayWaterFall();

// 使用防抖优化的滚动事件监听器
window.addEventListener("scroll", debounce(essayScroll, 200));
