class Bookmarks {
  constructor() {
    this.edit = this.getElement("#edit");
    this.discard = this.getElement("#discard");
    this.inputContainer = this.getElement("#input-container");
    this.configContainer = this.getElement("#config-container");
    this.input = this.getElement("#input");
    this.config = this.getElement("#config");
    this.addEventListeners();
    this.name = "simple-tab";
    this.bookmarks = localStorage.getItem(this.name) || "";
    this.sections;
    this.columnCount = 3;
    this.groups;
    this.main = this.getElement("#main");
    this.columns;
    console.log(this.bookmarks);
    this.updateBookmarks();
  }

  updateBookmarks() {
    if (this.bookmarks) {
      localStorage.setItem(this.name, this.bookmarks);
      while (this.main.firstChild) {
        this.main.removeChild(this.main.lastChild);
      }
      this.sections = this.createSections();
      this.groups = [];
      this.parse();
      this.columns = [];

      for (let i = 0; i < this.columnCount; i++) {
        this.columns[i] = this.createElement("section", `#col-${i}`);
      }
      this.load();
    }
  }

  addEventListeners() {
    this.edit.addEventListener("click", () => {
      if (this.inputContainer.classList.contains("active")) {
        this.edit.innerHTML = "Add Bookmarks";
        if (this.input.value != "" && this.input.value != this.bookmarks) {
          this.bookmarks = this.input.value;
          this.updateBookmarks();
        }
        this.inputContainer.classList.remove("active");
        this.discard.classList.remove("active");
      } else {
        this.edit.innerHTML = "Save";
        this.discard.classList.add("active");
        this.inputContainer.classList.add("active");
      }
    });

    this.discard.addEventListener("click", () => {
      this.edit.innerHTML = "Add Bookmarks";
      this.inputContainer.classList.remove("active");
      this.discard.classList.remove("active");
    });

    this.config.addEventListener("click", () => {
      if (this.configContainer.classList.contains("active")) {
        this.configContainer.classList.remove("active");
      } else {
        this.configContainer.classList.add("active");
      }
    });
  }

  createSections() {
    return this.bookmarks.split("---");
  }

  load() {
    this.groups.forEach((group) => {
      let heading = this.createElement("div", "heading");
      let bookmarks = this.createElement("ul", "bookmarks");
      let groupEl = this.createElement("div", "group");
      let column;
      for (let prop in group) {
        if (prop == "__group_title__") {
          heading.innerHTML = group[prop];
        } else {
          if (prop == "__column___") {
            column = group[prop];
          } else {
            let listItem = this.createElement("li");
            let bookmark = this.createElement("a");
            bookmark.setAttribute("href", group[prop]);
            bookmark.innerHTML = prop;
            listItem.appendChild(bookmark);
            bookmarks.appendChild(listItem);
          }
        }
      }
      groupEl.appendChild(heading);
      groupEl.appendChild(bookmarks);
      this.columns[column].appendChild(groupEl);
    });

    this.columns.forEach((col) => {
      this.main.appendChild(col);
    });

    this.input.value = this.bookmarks;
  }

  getElement(selector) {
    const element = document.querySelector(selector);
    return element;
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
  }

  parse() {
    for (let i = 0; i < this.sections.length; i += 1) {
      let groupStrings = this.sections[i].split(">").filter((e) => e !== "");
      groupStrings.forEach((groupString) => {
        let group = {};
        let lines = groupString.split("\n").filter((e) => e !== "");
        for (let j = 0; j < lines.length; j += 1) {
          let text, link;
          [text, link] = lines[j].replace(")", "").split("(");

          if (link == undefined) {
            if (j == 0) {
              group.__group_title__ = text;
              group.__column___ = i;
            }
          } else {
            group[text] = link;
          }

          if (j == lines.length - 1) {
            this.groups.push(group);
          }
        }
      });
    }
  }
}

let p = new Bookmarks();
