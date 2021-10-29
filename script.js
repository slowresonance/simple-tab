var Model = /** @class */ (function () {
    function Model() {
        this.name = "simple-tab-2";
        this.data = localStorage.getItem(this.name) || "";
        this.sections = this.parse(this.data);
    }
    Model.prototype._commit = function () {
        this.onLinksChanged(this.sections, this.data);
        localStorage.setItem(this.name, this.data);
    };
    Model.prototype.editLinks = function (data) {
        this.data = data;
        if (this.data != "") {
            this.sections = this.parse(this.data);
        }
        this._commit();
    };
    Model.prototype.bindLinksChanged = function (callback) {
        this.onLinksChanged = callback;
    };
    Model.prototype.parse = function (data) {
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
    return Model;
}());
var View = /** @class */ (function () {
    function View() {
        this.body = document.body;
        this.root = this.createElement("main");
        this.root.setAttribute("id", "root");
        this.createUI();
        this._initLocalListeners();
    }
    View.prototype.clickEdit = function () {
        this.taEdit.classList.remove("active");
        this.taClose.classList.add("active");
        this.taSave.classList.add("active");
        this.textContainer.classList.add("active");
    };
    View.prototype.clickClose = function () {
        this.taEdit.classList.add("active");
        this.taClose.classList.remove("active");
        this.taSave.classList.remove("active");
        this.textContainer.classList.remove("active");
    };
    View.prototype.clickSave = function () {
        this.taEdit.classList.add("active");
        this.taClose.classList.remove("active");
        this.taSave.classList.remove("active");
        this.textContainer.classList.remove("active");
    };
    View.prototype.bindEditLinks = function (handler) {
        var _this = this;
        this.taSave.addEventListener("click", function (event) {
            event.preventDefault();
            if (_this._textarea) {
                handler(_this._textarea);
            }
        });
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
            _this.root.appendChild(currentSection);
            _this.body.appendChild(_this.root);
        });
        this.textarea.value = linksString;
    };
    View.prototype.createUI = function () {
        this.textContainer = this.createElement("div");
        this.textContainer.setAttribute("id", "input-container");
        this.textContainer.setAttribute("spellcheck", "false");
        this.textarea = this.createElement("textarea");
        this.textarea.setAttribute("title", "links-input");
        this.textarea.setAttribute("label", "links-input");
        this.textarea.setAttribute("id", "links-textarea");
        this.textarea.setAttribute("placeholder", "Add some links");
        this.textContainer.appendChild(this.textarea);
        this.buttonContainer = this.createElement("div");
        this.buttonContainer.setAttribute("id", "button-container");
        this.taClose = this.createElement("button");
        this.taClose.setAttribute("id", "ta-close");
        this.taClose.setAttribute("label", "Close");
        this.taClose.innerHTML = "Close";
        this.taEdit = this.createElement("button");
        this.taEdit.setAttribute("id", "ta-edit");
        this.taEdit.setAttribute("label", "Add Links");
        this.taEdit.classList.add("active");
        this.taEdit.innerHTML = "Add Links";
        this.taSave = this.createElement("button");
        this.taSave.setAttribute("id", "ta-save");
        this.taSave.setAttribute("label", "Save Links");
        this.taSave.innerHTML = "Save";
        this.buttonContainer.appendChild(this.taClose);
        this.buttonContainer.appendChild(this.taEdit);
        this.buttonContainer.appendChild(this.taSave);
        this.body.appendChild(this.textContainer);
        this.body.appendChild(this.buttonContainer);
    };
    View.prototype.removeLinks = function () {
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
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
    Object.defineProperty(View.prototype, "_textarea", {
        get: function () {
            return this.textarea.value;
        },
        enumerable: false,
        configurable: true
    });
    View.prototype._initLocalListeners = function () {
        var _this = this;
        this.taEdit.addEventListener("click", function (event) {
            event.preventDefault();
            _this.clickEdit();
        });
        this.taClose.addEventListener("click", function (event) {
            event.preventDefault();
            _this.clickClose();
        });
        this.taSave.addEventListener("click", function (event) {
            event.preventDefault();
            _this.clickSave();
        });
    };
    return View;
}());
var Controller = /** @class */ (function () {
    function Controller(model, view) {
        var _this = this;
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
        this.onLinksChanged(this.model.sections, this.model.data);
    }
    return Controller;
}());
var app = new Controller(new Model(), new View());
// click on add links -> place the link text -> save the links
// if links are changed in the model -> update the view
// handle (view -> model)
// on (model -> view)
