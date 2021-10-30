type Link = {
  text: string;
  href: string;
};

type Group = {
  title: string;
  links: Link[];
};

type Section = {
  groups: Group[];
};

type Style = {
  key: string;
  value: string;
};

class Model {
  name: string;
  data: string;
  styleString: string;
  sections: Section[];
  styles: Style[];
  onLinksChanged: Function;
  onStylesChanged: Function;

  constructor() {
    this.name = "simple-tab-2";
    this.data = localStorage.getItem(this.name) || "";
    this.styleString = localStorage.getItem(`${this.name}-styles`) || "";
    this.sections = this.parseLinks(this.data);
    this.styles = this.parseStyling(this.styleString);
  }

  editLinks(data: string) {
    this.data = data;
    if (this.data != "") {
      this.sections = this.parseLinks(this.data);
    }
    this._commitLinks();
  }

  editStyle(styleString: string) {
    this.styleString = styleString;
    if (this.styleString != "") {
      this.styles = this.parseStyling(this.styleString);
    }
    this._commitStyles();
  }

  parseLinks(data: string): Section[] {
    let sections: Section[] = [];
    let sectionStrings = data.split("---");

    sectionStrings.forEach((sectionString) => {
      let groups: Group[] = [];
      let groupStrings = sectionString
        .split(">")
        .filter((e) => e != "" && e != "\n");

      groupStrings.forEach((groupString) => {
        let lines = groupString.split("\n").filter((e) => e != "" && e != "\n");
        let title: string = "";
        let links: Link[] = [];

        for (let i = 0; i < lines.length; i += 1) {
          let text: string, href: string;
          [text, href] = lines[i].replace(")", "").split("(");
          if (href == undefined) {
            if (i == 0) {
              title = text;
              continue;
            } else {
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
  }

  parseStyling(prefString: string): Style[] {
    let styles: Style[] = [];
    let styleString = prefString
      .split("\n")
      .filter((e) => e != "" && e != "\n");

    styleString.forEach((style) => {
      let key: string, value: string;
      [key, value] = style.split(":");

      styles.push({ key: key.trim(), value: value.replace(";", "").trim() });
    });
    return styles;
  }

  bindLinksChanged(callback: Function) {
    this.onLinksChanged = callback;
  }

  bindStylesChanged(callback: Function) {
    this.onStylesChanged = callback;
  }

  _commitLinks() {
    this.onLinksChanged(this.sections, this.data);
    localStorage.setItem(this.name, this.data);
  }

  _commitStyles() {
    this.onStylesChanged(this.styles, this.styleString);
    localStorage.setItem(`${this.name}-styles`, this.styleString);
  }
}

class View {
  body: HTMLElement;
  main: HTMLElement;
  root: HTMLElement;
  textContainer: HTMLElement;
  styleContainer: HTMLElement;
  linkarea: HTMLElement;
  buttonContainer: HTMLElement;
  taClose: HTMLElement;
  taEdit: HTMLElement;
  taSave: HTMLElement;
  stEdit: HTMLElement;
  stSave: HTMLElement;
  stClose: HTMLElement;
  stylearea: HTMLElement;

  constructor() {
    this.body = document.body;
    this.main = this.createElement("main");
    this.main.setAttribute("id", "root");
    this.root = document.documentElement;
    this.createUI();

    this._initLocalListeners();
  }

  setStyling(styles: Style[], styleString: string) {
    styles.forEach((style) => {
      this.root.style.setProperty(style.key, style.value);
    });

    (<HTMLTextAreaElement>this.stylearea).value = styleString;
  }

  displayLinks(sections: Section[], linksString: string) {
    if (!sections) {
      return;
    }

    this.removeLinks();

    sections.forEach((section) => {
      let currentSection = this.createElement("section");
      section.groups.forEach((group) => {
        let currentGroup = this.createElement("div", "group");
        let currentTitle = this.createElement("div", "heading");
        let currentUL = this.createElement("ul", "links");
        if (group.title) {
          currentTitle.innerHTML = group.title;
          currentGroup.appendChild(currentTitle);
        }
        group.links.forEach((link) => {
          let currentList = this.createElement("li");
          let currentLink = this.createElement("a");
          currentLink.innerHTML = link.text;
          currentLink.setAttribute("href", link.href);
          currentList.appendChild(currentLink);
          currentUL.appendChild(currentList);
        });
        currentGroup.appendChild(currentUL);
        currentSection.appendChild(currentGroup);
      });
      this.main.appendChild(currentSection);
      this.body.appendChild(this.main);
    });

    (<HTMLTextAreaElement>this.linkarea).value = linksString;
  }

  createUI() {
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
  }

  clickLinkEdit() {
    this.taEdit.classList.remove("active");
    this.taClose.classList.add("active");
    this.taSave.classList.add("active");
    this.textContainer.classList.add("active");
  }

  clickLinkClose() {
    this.taEdit.classList.add("active");
    this.taClose.classList.remove("active");
    this.taSave.classList.remove("active");
    this.textContainer.classList.remove("active");
  }

  clickLinkSave() {
    this.taEdit.classList.add("active");
    this.taClose.classList.remove("active");
    this.taSave.classList.remove("active");
    this.textContainer.classList.remove("active");
  }

  clickStyleEdit() {
    this.stEdit.classList.remove("active");
    this.stSave.classList.add("active");
    this.stClose.classList.add("active");
    this.styleContainer.classList.add("active");
  }

  clickStyleSave() {
    this.stEdit.classList.add("active");
    this.stSave.classList.remove("active");
    this.stClose.classList.remove("active");
    this.styleContainer.classList.remove("active");
  }

  clickStyleClose() {
    this.stEdit.classList.add("active");
    this.stClose.classList.remove("active");
    this.stSave.classList.remove("active");
    this.styleContainer.classList.remove("active");
  }

  bindEditStyling(handler: Function) {
    this.stSave.addEventListener("click", (event) => {
      event.preventDefault();

      if (this._stylearea) {
        handler(this._stylearea);
      }
    });
  }

  bindEditLinks(handler: Function) {
    this.taSave.addEventListener("click", (event) => {
      event.preventDefault();
      if (this._linkarea) {
        handler(this._linkarea);
      }
    });
  }

  removeLinks() {
    while (this.main.firstChild) {
      this.main.removeChild(this.main.firstChild);
    }
  }

  createElement(tag: string, className?: string): HTMLElement {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  getElement(selector: string) {
    const element = document.querySelector(selector);
    return element;
  }

  get _linkarea() {
    return (<HTMLTextAreaElement>this.linkarea).value;
  }

  get _stylearea() {
    return (<HTMLTextAreaElement>this.stylearea).value;
  }

  _initLocalListeners() {
    this.taEdit.addEventListener("click", (event) => {
      event.preventDefault();
      this.clickLinkEdit();
    });

    this.taClose.addEventListener("click", (event) => {
      event.preventDefault();
      this.clickLinkClose();
    });

    this.taSave.addEventListener("click", (event) => {
      event.preventDefault();
      this.clickLinkSave();
    });

    this.stSave.addEventListener("click", (event) => {
      event.preventDefault();
      this.clickStyleSave();
    });

    this.stEdit.addEventListener("click", (event) => {
      event.preventDefault();
      this.clickStyleEdit();
    });

    this.stClose.addEventListener("click", (event) => {
      event.preventDefault();
      this.clickStyleClose();
    });
  }
}

class Controller {
  model: Model;
  view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.model.bindLinksChanged(this.onLinksChanged);
    this.view.bindEditLinks(this.handleSaveLinks);
    this.model.bindStylesChanged(this.onStylesChanged);
    this.view.bindEditStyling(this.handleSaveStyle);

    this.onLinksChanged(this.model.sections, this.model.data);
    this.onStylesChanged(this.model.styles, this.model.styleString);
  }

  handleSaveStyle = (linkstring: string) => {
    this.model.editStyle(linkstring);
  };

  onStylesChanged = (styles: Style[], styleString: string) => {
    this.view.setStyling(styles, styleString);
  };

  handleSaveLinks = (linkstring: string) => {
    this.model.editLinks(linkstring);
  };

  onLinksChanged = (links: Section[], linksString: string) => {
    this.view.displayLinks(links, linksString);
  };
}

const app = new Controller(new Model(), new View());
