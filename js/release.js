(function() {
    "use strict";

    function NoToChinese(n) {
        var i;
        if (!/^\d*(\.\d*)?$/.test(n)) return alert("Number is wrong!"), "Number is wrong!";
        var e = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
            u = ["", "十", "百", "千", "万", "亿", "点", ""],
            r = ("" + n).replace(/(^0*)/g, "").split("."),
            f = 0,
            t = "";
        for (i = r[0].length - 1; i >= 0; i--) {
            switch (f) {
                case 0:
                    t = u[7] + t;
                    break;
                case 4:
                    new RegExp("0{4}\\d{" + (r[0].length - i - 1) + "}$").test(r[0]) || (t = u[4] + t);
                    break;
                case 8:
                    t = u[5] + t;
                    u[7] = u[5];
                    f = 0
            }
            f % 4 == 2 && r[0].charAt(i + 2) != 0 && r[0].charAt(i + 1) == 0 && (t = e[0] + t);
            r[0].charAt(i) != 0 && (t = e[r[0].charAt(i)] + u[f % 4] + t);
            f++
        }
        if (r.length > 1)
            for (t += u[6], i = 0; i < r[1].length; i++) t += e[r[1].charAt(i)];
        return t
    }

    function ping(id, n, t) {
        var e = window.config.checkTimeOut,
            f = (new Date).getTime(),
            r = 0,
            u, i = document.createElement("img");
        i.src = "https://" + n + "/online.png?v=" + f;
        i.onerror = function() {
            clearTimeout(u);
            r = (new Date).getTime() - f;
            i.remove();
            t(id, r >= e ? 3 : 2, r)
        };
        i.onload = function() {
            clearTimeout(u);
            r = (new Date).getTime() - f;
            i.remove();
            t(id, 1, r)
        };
        u = setTimeout(function(n) {
            return function() {
                n.src = "online.png";
                n.onload = function() {
                    clearTimeout(u)
                };
                n.onerror()
            }
        }(i), e)
    }

    function createTemplate(n, t) {
        var i = n.match(/{{[\s\S]*?}}/g);
        return i.forEach(function(i) {
            var r = i.replace("{{", "").replace("}}", "").trim().split(".");
            r.length > 0 && (n = n.replace(i, t[r]))
        }), document.createRange().createContextualFragment(n)
    }

    function speedOfficial(n) {
        switch (n.speed) {
            case "fast":
                n.text = "速度够快";
                n.linkText = "推荐访问";
                break;
            case "ord":
                n.text = "延迟过高";
                n.linkText = "立即进入";
                break;
            case "fail":
                n.text = "无法访问";
                n.linkText = "无法访问";
                n.timer = "检测失败";
                break;
            case "timeout":
                n.text = "无法访问";
                n.linkText = "无法访问";
                n.timer = "链接超时"
        }
        return n
    }

    function speedStandard(n, t) {
        return n === 1 ? t <= window.config.checkFast ? "fast" : t > window.config.checkFast && t < window.config.checkNormal ? "ord" : "ord" : n === 2 ? "fail" : "timeout"
    }

    function hasClass(elements, cName) {
        return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
    }

    function addClass(elements, cName) {
        if (!hasClass(elements, cName)) {
            elements.className += " " + cName;
        }
    }

    function removeClass(elements, cName) {
        if (hasClass(elements, cName)) {
            elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
        }
    }
    let animate = {
        show: function(n, t) {
            n.style.display = t || "block";
            var i = 0,
                r = setInterval(function() {
                    if (i += .2, n.style.opacity = i, i >= 1) {
                        n.style.opacity = 1;
                        clearInterval(r);
                        return true;
                    }
                }, 50)
        },
        hide: function(n) {
            var t = 1,
                i = setInterval(function() {
                    if (t -= .2, n.style.opacity = t, t <= 0) {
                        n.style.display = "none";
                        n.style.opacity = 0;
                        clearInterval(i);
                        return true;
                    }
                }, 50)
        }
    };
    let loading = document.getElementById("loading"),
        listDom = document.getElementById("siteDataList"),
        index = 0;
    animate.show(loading);
    setTimeout(function() {
        listDom.innerHTML = "";
        window.config.checkList.forEach(function(n) {
            index++;
            let url = atob(n),
                u = speedOfficial({
                    url: url,
                    speed: 'check',
                    id: index,
                    name: NoToChinese(index)
                }),
                f = createTemplate(window.config.template, u);
            listDom.appendChild(f);
            ping(index, url, function(id, n, i) {
                let BtnDom = document.getElementById("btn-" + id),
                    speedDom = document.querySelector("#btn-" + id + " .speed-text"),
                    r = speedStandard(n, i),
                    u = speedOfficial({
                        timer: i,
                        speed: r,
                    });
                speedDom.innerHTML = '';
                removeClass(BtnDom, 'speed-check');
                addClass(BtnDom, 'speed-' + r);
                speedDom.appendChild(createTemplate(window.config.speed, u));
            })
        });
        animate.hide(loading)
    }, 1e3);
    document.getElementsByTagName('title')[0].innerText = '小七地址发布站';
    document.querySelector('meta[name="keywords"]').innerText = '发布页,永久访问网址';
    document.querySelector('meta[name="description"]').innerText = '地址发布站,永久访问网址';
})();