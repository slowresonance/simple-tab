var Model = /** @class */ (function () {
    function Model() {
        this.name = "simple-tab-2";
        this.data = localStorage.getItem(this.name) || "";
        this.styleString = localStorage.getItem(this.name + "-styles") || "";
        this.sections = this.parseLinks(this.data);
        this.styles = this.parseStyling(this.styleString);
    }
    Model.prototype.editLinks = function (data) {
        this.data = data;
        if (this.data != "") {
            this.sections = this.parseLinks(this.data);
        }
        this._commitLinks();
    };
    Model.prototype.editStyle = function (styleString) {
        this.styleString = styleString;
        if (this.styleString != "") {
            this.styles = this.parseStyling(this.styleString);
        }
        this._commitStyles();
    };
    Model.prototype.parseLinks = function (data) {
        var sections = [];
        var sectionStrings = data.split("---");
        sectionStrings.forEach(function (sectionString) {
            var groups = [];
            var groupStrings = sectionString
                .split(">")
                .filter(function (e) { return e != "" && e != "\n"; });
            groupStrings.forEach(function (groupString) {
                var _a;
                var lines = groupString.split("\n").filter(function (e) { return e != "" && e != "\n"; });
                var title = "";
                var links = [];
                for (var i = 0; i < lines.length; i += 1) {
                    var text = void 0, href = void 0;
                    _a = lines[i].replace(")", "").split("("), text = _a[0], href = _a[1];
                    if (href == undefined) {
                        if (i == 0) {
                            title = text;
                            continue;
                        }
                        else {
                            href = "#";
                        }
                    }
                    links.push({ text: text, href: href });
                }
                groups.push({ title: title, links: links });
            });
            sections.push({ groups: groups });
        });
        return sections;
    };
    Model.prototype.parseStyling = function (prefString) {
        var styles = [];
        var styleString = prefString
            .split("\n")
            .filter(function (e) { return e != "" && e != "\n"; });
        styleString.forEach(function (style) {
            var _a;
            var key, value;
            _a = style.split(":"), key = _a[0], value = _a[1];
            styles.push({ key: key.trim(), value: value.replace(";", "").trim() });
        });
        return styles;
    };
    Model.prototype.bindLinksChanged = function (callback) {
        this.onLinksChanged = callback;
    };
    Model.prototype.bindStylesChanged = function (callback) {
        this.onStylesChanged = callback;
    };
    Model.prototype._commitLinks = function () {
        this.onLinksChanged(this.sections, this.data);
        localStorage.setItem(this.name, this.data);
    };
    Model.prototype._commitStyles = function () {
        this.onStylesChanged(this.styles, this.styleString);
        localStorage.setItem(this.name + "-styles", this.styleString);
    };
    return Model;
}());
var View = /** @class */ (function () {
    function View() {
        this.body = document.body;
        this.main = this.createElement("main");
        this.main.setAttribute("id", "root");
        this.root = document.documentElement;
        this.createUI();
        this._initLocalListeners();
    }
    View.prototype.setStyling = function (styles, styleString) {
        var _this = this;
        styles.forEach(function (style) {
            _this.root.style.setProperty(style.key, style.value);
        });
        this.stylearea.value = styleString;
    };
    View.prototype.displayLinks = function (sections, linksString) {
        var _this = this;
        if (!sections) {
            return;
        }
        this.removeLinks();
        sections.forEach(function (section) {
            var currentSection = _this.createElement("section");
            section.groups.forEach(function (group) {
                var currentGroup = _this.createElement("div", "group");
                var currentTitle = _this.createElement("div", "heading");
                var currentUL = _this.createElement("ul", "links");
                if (group.title) {
                    currentTitle.innerHTML = group.title;
                    currentGroup.appendChild(currentTitle);
                }
                group.links.forEach(function (link) {
                    var currentList = _this.createElement("li");
                    var currentLink = _this.createElement("a");
                    currentLink.innerHTML = link.text;
                    currentLink.setAttribute("href", link.href);
                    currentList.appendChild(currentLink);
                    currentUL.appendChild(currentList);
                });
                currentGroup.appendChild(currentUL);
                currentSection.appendChild(currentGroup);
            });
            _this.main.appendChild(currentSection);
            _this.body.appendChild(_this.main);
        });
        this.linkarea.value = linksString;
    };
    View.prototype.createUI = function () {
        this.textContainer = this.createElement("div");
        this.textContainer.setAttribute("id", "input-container");
        this.textContainer.setAttribute("spellcheck", "false");
        this.linkarea = this.createElement("textarea");
        this.linkarea.setAttribute("title", "links-input");
        this.linkarea.setAttribute("label", "links-input");
        this.linkarea.setAttribute("id", "links-textarea");
        this.linkarea.setAttribute("placeholder", "Add some links");
        this.styleContainer = this.createElement("div");
        this.styleContainer.setAttribute("id", "style-container");
        this.styleContainer.setAttribute("spellcheck", "false");
        this.stylearea = this.createElement("textarea");
        this.stylearea.setAttribute("title", "style-input");
        this.stylearea.setAttribute("label", "style-input");
        this.stylearea.setAttribute("id", "style-textarea");
        this.stylearea.setAttribute("placeholder", "Edit the styling");
        this.styleContainer.appendChild(this.stylearea);
        this.textContainer.appendChild(this.linkarea);
        this.buttonContainer = this.createElement("div");
        this.buttonContainer.setAttribute("id", "button-container");
        this.taClose = this.createElement("button");
        this.taClose.setAttribute("id", "ta-close");
        this.taClose.setAttribute("label", "Close");
        this.taClose.innerHTML = "Close";
        this.taEdit = this.createElement("button");
        this.taEdit.setAttribute("id", "ta-edit");
        this.taEdit.setAttribute("label", "Edit Links");
        this.taEdit.classList.add("active");
        this.taEdit.innerHTML = "Edit Links";
        this.taSave = this.createElement("button");
        this.taSave.setAttribute("id", "ta-save");
        this.taSave.setAttribute("label", "Save Links");
        this.taSave.innerHTML = "Save Links";
        this.stClose = this.createElement("button");
        this.stClose.setAttribute("id", "st-close");
        this.stClose.setAttribute("label", "Close Styling");
        this.stClose.innerHTML = "Close";
        this.stEdit = this.createElement("button");
        this.stEdit.setAttribute("id", "st-edit");
        this.stEdit.setAttribute("label", "Edit styling");
        this.stEdit.classList.add("active");
        this.stEdit.innerHTML = "Edit Styling";
        this.stSave = this.createElement("button");
        this.stSave.setAttribute("id", "st-save");
        this.stSave.setAttribute("label", "Save styling");
        this.stSave.innerHTML = "Save Styling";
        this.buttonContainer.appendChild(this.taEdit);
        this.buttonContainer.appendChild(this.taSave);
        this.buttonContainer.appendChild(this.taClose);
        this.buttonContainer.appendChild(this.stEdit);
        this.buttonContainer.appendChild(this.stSave);
        this.buttonContainer.appendChild(this.stClose);
        this.body.appendChild(this.styleContainer);
        this.body.appendChild(this.textContainer);
        this.body.appendChild(this.buttonContainer);
    };
    View.prototype.clickLinkEdit = function () {
        this.taEdit.classList.remove("active");
        this.taClose.classList.add("active");
        this.taSave.classList.add("active");
        this.textContainer.classList.add("active");
    };
    View.prototype.clickLinkClose = function () {
        this.taEdit.classList.add("active");
        this.taClose.classList.remove("active");
        this.taSave.classList.remove("active");
        this.textContainer.classList.remove("active");
    };
    View.prototype.clickLinkSave = function () {
        this.taEdit.classList.add("active");
        this.taClose.classList.remove("active");
        this.taSave.classList.remove("active");
        this.textContainer.classList.remove("active");
    };
    View.prototype.clickStyleEdit = function () {
        this.stEdit.classList.remove("active");
        this.stSave.classList.add("active");
        this.stClose.classList.add("active");
        this.styleContainer.classList.add("active");
    };
    View.prototype.clickStyleSave = function () {
        this.stEdit.classList.add("active");
        this.stSave.classList.remove("active");
        this.stClose.classList.remove("active");
        this.styleContainer.classList.remove("active");
    };
    View.prototype.clickStyleClose = function () {
        this.stEdit.classList.add("active");
        this.stClose.classList.remove("active");
        this.stSave.classList.remove("active");
        this.styleContainer.classList.remove("active");
    };
    View.prototype.bindEditStyling = function (handler) {
        var _this = this;
        this.stSave.addEventListener("click", function (event) {
            event.preventDefault();
            if (_this._stylearea) {
                handler(_this._stylearea);
            }
        });
    };
    View.prototype.bindEditLinks = function (handler) {
        var _this = this;
        this.taSave.addEventListener("click", function (event) {
            event.preventDefault();
            if (_this._linkarea) {
                handler(_this._linkarea);
            }
        });
    };
    View.prototype.removeLinks = function () {
        while (this.main.firstChild) {
            this.main.removeChild(this.main.firstChild);
        }
    };
    View.prototype.createElement = function (tag, className) {
        var element = document.createElement(tag);
        if (className)
            element.classList.add(className);
        return element;
    };
    View.prototype.getElement = function (selector) {
        var element = document.querySelector(selector);
        return element;
    };
    Object.defineProperty(View.prototype, "_linkarea", {
        get: function () {
            return this.linkarea.value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "_stylearea", {
        get: function () {
            return this.stylearea.value;
        },
        enumerable: false,
        configurable: true
    });
    View.prototype._initLocalListeners = function () {
        var _this = this;
        this.taEdit.addEventListener("click", function (event) {
            event.preventDefault();
            _this.clickLinkEdit();
        });
        this.taClose.addEventListener("click", function (event) {
            event.preventDefault();
            _this.clickLinkClose();
        });
        this.taSave.addEventListener("click", function (event) {
            event.preventDefault();
            _this.clickLinkSave();
        });
        this.stSave.addEventListener("click", function (event) {
            event.preventDefault();
            _this.clickStyleSave();
        });
        this.stEdit.addEventListener("click", function (event) {
            event.preventDefault();
            _this.clickStyleEdit();
        });
        this.stClose.addEventListener("click", function (event) {
            event.preventDefault();
            _this.clickStyleClose();
        });
    };
    return View;
}());
var Controller = /** @class */ (function () {
    function Controller(model, view) {
        var _this = this;
        this.handleSaveStyle = function (linkstring) {
            _this.model.editStyle(linkstring);
        };
        this.onStylesChanged = function (styles, styleString) {
            _this.view.setStyling(styles, styleString);
        };
        this.handleSaveLinks = function (linkstring) {
            _this.model.editLinks(linkstring);
        };
        this.onLinksChanged = function (links, linksString) {
            _this.view.displayLinks(links, linksString);
        };
        this.model = model;
        this.view = view;
        this.model.bindLinksChanged(this.onLinksChanged);
        this.view.bindEditLinks(this.handleSaveLinks);
        this.model.bindStylesChanged(this.onStylesChanged);
        this.view.bindEditStyling(this.handleSaveStyle);
        this.onLinksChanged(this.model.sections, this.model.data);
        this.onStylesChanged(this.model.styles, this.model.styleString);
    }
    return Controller;
}());
var app = new Controller(new Model(), new View());
