class SimpleTab {
  constructor() {
    this.name = "simple-tab";
    this.storage =
      JSON.parse(localStorage.getItem(this.name)) || this.createStorage();
    this.body = this.getElement("body");
    this.main = this.getElement("main");
    this.createContainer();
    this.createButtons();
    this.addEventListeners();
    this.updateBookmarks();
  }

  updateBookmarks() {
    if (this.storage.data != undefined && this.storage.data != " ") {
      localStorage.setItem(this.name, JSON.stringify(this.storage));
      this.removeBookmarks();
      this.parse();
      this.createBookmarks();
    }
  }

  createBookmarks() {
    this.columns = [];
    this.columnCount = 3;
    for (let i = 0; i < this.columnCount; i++) {
      this.columns[i] = this.createElement("section", `#col-${i}`);
    }

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

    this.textArea.value = this.storage.data;
  }

  removeBookmarks() {
    while (this.main.firstChild) {
      this.main.removeChild(this.main.lastChild);
    }
  }

  addEventListeners() {
    this.bmEdit.addEventListener("click", () => {
      if (this.inputContainer.classList.contains("active")) {
        this.bmEdit.innerHTML = "Add Bookmarks";
        if (this.textArea.value != "") {
          console.log(this.storage);
          this.storage["data"] = this.textArea.value;
          console.log(this.storage["data"]);
          this.updateBookmarks();
        }
        this.inputContainer.classList.remove("active");
        this.bmClose.classList.remove("active");
      } else {
        this.bmEdit.innerHTML = "Save";
        this.bmClose.classList.add("active");
        this.inputContainer.classList.add("active");
      }
    });

    this.bmClose.addEventListener("click", () => {
      this.bmEdit.innerHTML = "Add Bookmarks";
      this.inputContainer.classList.remove("active");
      this.bmClose.classList.remove("active");
    });
  }

  createButtons() {
    this.buttonsContainer = this.createElement("div");
    this.buttonsContainer.setAttribute("id", "buttons");
    // this.prefClose = this.createButton("pref-close", "Close");
    // this.prefSave = this.createButton("pref-save", this.svgConfig);
    this.bmClose = this.createButton("bm-close", "Close");
    this.bmEdit = this.createButton("bm-edit", "Add Bookmarks");
    this.bmClose.innerHTML = "Close";
    this.bmEdit.innerHTML = "Add Bookmarks";
    // this.buttonsContainer.appendChild(this.prefClose);
    // this.buttonsContainer.appendChild(this.prefSave);
    this.buttonsContainer.appendChild(this.bmClose);
    this.buttonsContainer.appendChild(this.bmEdit);
    this.body.appendChild(this.buttonsContainer);
  }

  createContainer() {
    this.inputContainer = this.createElement("div");
    this.inputContainer.setAttribute("id", "input-container");
    this.inputContainer.setAttribute("spellcheck", "false");
    // this.configContainer = this.createElement("div");
    // this.configContainer.setAttribute("id", "config-container");
    this.createTextarea();
    this.body.appendChild(this.inputContainer);
  }

  createTextarea() {
    this.textArea = this.createElement("textarea");
    this.textArea.setAttribute("title", "bookmarks-input");
    this.textArea.setAttribute("label", "bookmarks input");
    this.textArea.setAttribute("id", "bookmarks-textarea");
    this.textArea.setAttribute(
      "placeholder",
      "Add some Bookmarks to get started&#10;"
    );
    this.inputContainer.appendChild(this.textArea);
  }

  createButton(id, label) {
    const button = document.createElement("button");
    button.setAttribute("id", id);
    button.setAttribute("label", label);
    return button;
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

  variables() {
    this.svgSave = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.4444 0H1.77778C0.791111 0 0 0.8 0 1.77778V14.2222C0 15.2 0.791111 16 1.77778 16H14.2222C15.2 16 16 15.2 16 14.2222V3.55556L12.4444 0ZM8 14.2222C6.52444 14.2222 5.33333 13.0311 5.33333 11.5556C5.33333 10.08 6.52444 8.88889 8 8.88889C9.47556 8.88889 10.6667 10.08 10.6667 11.5556C10.6667 13.0311 9.47556 14.2222 8 14.2222ZM10.6667 5.33333H1.77778V1.77778H10.6667V5.33333Z" fill="white"/></svg>`;
    this.svgConfig = `<svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" > <path fill-rule="evenodd" clip-rule="evenodd" d="M6.83407 1.52471C7.02212 1.50836 7.21263 1.5 7.40527 1.5C7.59791 1.5 7.78842 1.50836 7.97647 1.52471C8.01196 1.52779 8.08459 1.56149 8.11322 1.67093L8.40229 2.77622C8.5489 3.33676 8.95144 3.74277 9.39956 3.96473C9.57307 4.05067 9.74037 4.14753 9.90047 4.25443C10.3171 4.53261 10.8705 4.67836 11.4296 4.52497L12.5325 4.22235C12.6414 4.19246 12.707 4.23831 12.7276 4.26758C12.9461 4.57848 13.1379 4.90924 13.2999 5.25654C13.3147 5.2884 13.322 5.36792 13.2415 5.44746L12.4267 6.25258C12.0152 6.65921 11.8644 7.21008 11.8961 7.70918C11.9022 7.80524 11.9053 7.9022 11.9053 8C11.9053 8.0978 11.9022 8.19476 11.8961 8.29082C11.8644 8.78992 12.0152 9.34079 12.4267 9.74742L13.2415 10.5525C13.322 10.6321 13.3147 10.7116 13.2999 10.7435C13.1379 11.0908 12.9461 11.4215 12.7276 11.7324C12.707 11.7617 12.6414 11.8075 12.5325 11.7777L11.4296 11.475C10.8705 11.3216 10.3171 11.4674 9.90047 11.7456C9.74037 11.8525 9.57307 11.9493 9.39956 12.0353C8.95144 12.2572 8.5489 12.6632 8.40229 13.2238L8.11322 14.3291C8.08459 14.4385 8.01196 14.4722 7.97647 14.4753C7.78842 14.4916 7.59791 14.5 7.40527 14.5C7.21263 14.5 7.02212 14.4916 6.83407 14.4753C6.79857 14.4722 6.72594 14.4385 6.69732 14.3291L6.40823 13.2237C6.26163 12.6632 5.8591 12.2572 5.41099 12.0353C5.23748 11.9493 5.07023 11.8525 4.91014 11.7456C4.49352 11.4674 3.94008 11.3216 3.38104 11.475L2.27805 11.7777C2.16914 11.8075 2.10353 11.7617 2.08295 11.7324C1.86448 11.4215 1.67265 11.0908 1.5107 10.7435C1.49584 10.7116 1.48855 10.6321 1.56904 10.5525L2.38392 9.74736C2.79544 9.34074 2.94627 8.78987 2.91451 8.29078C2.90841 8.19474 2.9053 8.09778 2.9053 8C2.9053 7.90222 2.90841 7.80526 2.91451 7.70922C2.94627 7.21013 2.79544 6.65926 2.38392 6.25264L1.56904 5.44746C1.48855 5.36793 1.49584 5.28841 1.5107 5.25655C1.67265 4.90924 1.86448 4.57848 2.08296 4.26758C2.10353 4.23831 2.16914 4.19247 2.27805 4.22235L3.38104 4.52498C3.94008 4.67837 4.49352 4.53262 4.91014 4.25444C5.07023 4.14755 5.23748 4.05069 5.41099 3.96475C5.85909 3.74279 6.26163 3.33678 6.40823 2.77625L6.69732 1.67093C6.72594 1.56149 6.79857 1.52779 6.83407 1.52471ZM7.40527 0C7.16921 0 6.93536 0.010245 6.70416 0.0303435C5.96138 0.0949143 5.41518 0.645042 5.24613 1.29138L4.95704 2.39671C4.93958 2.46349 4.87814 2.55476 4.7452 2.62061C4.51359 2.73533 4.29053 2.86452 4.07719 3.00697C3.95421 3.08908 3.8446 3.09674 3.77794 3.07845L2.67495 2.77581C2.03171 2.59932 1.28354 2.79629 0.855683 3.40515C0.586953 3.78757 0.350769 4.19473 0.15124 4.62262C-0.163728 5.29808 0.0400965 6.04545 0.514753 6.51446L1.32963 7.31963C1.37877 7.36819 1.42691 7.46677 1.41754 7.61399C1.40942 7.74171 1.4053 7.87043 1.4053 8C1.4053 8.12957 1.40942 8.25829 1.41754 8.38601C1.42691 8.53323 1.37877 8.63181 1.32963 8.68037L0.514753 9.48555C0.0400954 9.95455 -0.163728 10.7019 0.15124 11.3774C0.350768 11.8053 0.586953 12.2124 0.855683 12.5948C1.28354 13.2037 2.03171 13.4007 2.67495 13.2242L3.77794 12.9216C3.8446 12.9033 3.95422 12.9109 4.07719 12.993C4.29053 13.1355 4.51359 13.2647 4.7452 13.3794C4.87814 13.4452 4.93958 13.5365 4.95704 13.6033L5.24613 14.7086C5.41518 15.355 5.96138 15.9051 6.70416 15.9697C6.93536 15.9898 7.16921 16 7.40527 16C7.64133 16 7.87518 15.9898 8.10637 15.9697C8.84915 15.9051 9.39536 15.355 9.56437 14.7086L9.85347 13.6033C9.87097 13.5365 9.93237 13.4453 10.0654 13.3794C10.297 13.2647 10.5201 13.1355 10.7334 12.993C10.8564 12.9109 10.966 12.9033 11.0327 12.9216L12.1356 13.2242C12.7789 13.4007 13.527 13.2037 13.9549 12.5949C14.2236 12.2124 14.4598 11.8053 14.6593 11.3774C14.9743 10.7019 14.7705 9.95456 14.2958 9.48555L13.481 8.68042C13.4318 8.63187 13.3837 8.53328 13.3931 8.38606C13.4012 8.25832 13.4053 8.12959 13.4053 8C13.4053 7.87041 13.4012 7.74168 13.3931 7.61394C13.3837 7.46672 13.4318 7.36813 13.481 7.31958L14.2958 6.51445C14.7705 6.04544 14.9743 5.29807 14.6593 4.62261C14.4598 4.19472 14.2236 3.78756 13.9549 3.40515C13.527 2.79628 12.7789 2.59932 12.1356 2.77581L11.0327 3.07843C10.966 3.09672 10.8564 3.08907 10.7334 3.00696C10.5201 2.8645 10.297 2.7353 10.0654 2.62057C9.93237 2.55473 9.87097 2.46346 9.85347 2.39667L9.56437 1.29138C9.39536 0.64504 8.84915 0.0949126 8.10637 0.0303426C7.87518 0.0102447 7.64133 0 7.40527 0ZM8.90527 8C8.90527 8.82843 8.2337 9.5 7.40527 9.5C6.57684 9.5 5.90527 8.82843 5.90527 8C5.90527 7.17157 6.57684 6.5 7.40527 6.5C8.2337 6.5 8.90527 7.17157 8.90527 8ZM10.4053 8C10.4053 9.65685 9.06212 11 7.40527 11C5.74842 11 4.40527 9.65685 4.40527 8C4.40527 6.34315 5.74842 5 7.40527 5C9.06212 5 10.4053 6.34315 10.4053 8Z" fill="#C9D1D9" /> </svg>`;
  }

  parse() {
    this.sections = this.storage.data.split("---");
    this.groups = [];
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

  createStorage() {
    return {
      data: " ",
      config: {
        "--bm-text-color": " #c9d1d9",
        "--bm-heading-color": " #3e4248",
        "--highlight-color": " #12b5cb",
        "--input-border-color": " #000000",
        "--input-background-color": " #ffffff",
        "--button-text-color": " #c9d1d9",
        "--button-border-color": " #30363d",
        "--button-hover-border-color": " #8b949e",
        "--button-background-color": " #21262d",
        "--button-hover-background-color": " #30363d",
        "--border-color": " #30363d",
        "--background-color": " #0d1117",
        "--config-input-color": " #3d4853",
        "--config-input-border-color": " #e6e6e6",
        "--config-heading-color": " #8b949e",
        "--config-title-heading-color": " #3d4853",
      },
    };
  }
}

let p = new SimpleTab();
