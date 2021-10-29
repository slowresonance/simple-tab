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

class Model {
  name: string;
  data: string;
  sections: Section[];
  onLinksChanged: Function;

  constructor() {
    this.name = "simple-tab-2";
    this.data = localStorage.getItem(this.name) || "";
    this.sections = this.parse(this.data);
  }

  _commit() {
    this.onLinksChanged(this.sections, this.data);
    localStorage.setItem(this.name, this.data);
  }

  editLinks(data: string) {
    this.data = data;
    if (this.data != "") {
      this.sections = this.parse(this.data);
    }
    this._commit();
  }

  bindLinksChanged(callback: Function) {
    this.onLinksChanged = callback;
  }

  parse(data: string): Section[] {
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
}

class View {
  body: HTMLElement;
  root: HTMLElement;
  textContainer: HTMLElement;
  textarea: HTMLElement;
  buttonContainer: HTMLElement;
  taClose: HTMLElement;
  taEdit: HTMLElement;
  taSave: HTMLElement;

  constructor() {
    this.body = document.body;
    this.root = this.createElement("main");
    this.root.setAttribute("id", "root");
    this.createUI();

    this._initLocalListeners();
  }

  clickEdit() {
    this.taEdit.classList.remove("active");
    this.taClose.classList.add("active");
    this.taSave.classList.add("active");
    this.textContainer.classList.add("active");
  }

  clickClose() {
    this.taEdit.classList.add("active");
    this.taClose.classList.remove("active");
    this.taSave.classList.remove("active");
    this.textContainer.classList.remove("active");
  }

  clickSave() {
    this.taEdit.classList.add("active");
    this.taClose.classList.remove("active");
    this.taSave.classList.remove("active");
    this.textContainer.classList.remove("active");
  }

  bindEditLinks(handler: Function) {
    this.taSave.addEventListener("click", (event) => {
      event.preventDefault();
      if (this._textarea) {
        handler(this._textarea);
      }
    });
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
      this.root.appendChild(currentSection);
      this.body.appendChild(this.root);
    });

    (<HTMLTextAreaElement>this.textarea).value = linksString;
  }

  createUI() {
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
  }

  removeLinks() {
    while (this.root.firstChild) {
      this.root.removeChild(this.root.firstChild);
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

  get _textarea() {
    return (<HTMLTextAreaElement>this.textarea).value;
  }

  _initLocalListeners() {
    this.taEdit.addEventListener("click", (event) => {
      event.preventDefault();
      this.clickEdit();
    });

    this.taClose.addEventListener("click", (event) => {
      event.preventDefault();
      this.clickClose();
    });

    this.taSave.addEventListener("click", (event) => {
      event.preventDefault();
      this.clickSave();
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

    this.onLinksChanged(this.model.sections, this.model.data);
  }

  handleSaveLinks = (linkstring: string) => {
    this.model.editLinks(linkstring);
  };

  onLinksChanged = (links: Section[], linksString: string) => {
    this.view.displayLinks(links, linksString);
  };
}

const app = new Controller(new Model(), new View());

// click on add links -> place the link text -> save the links
// if links are changed in the model -> update the view
// handle (view -> model)
// on (model -> view)
