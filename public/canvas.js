class SidePanel {
  constructor() {
    this.domElement = document.getElementById("coordDiv");
    this.currentGroup = undefined;
  }

  newGroup(title) {
    this.currentGroup = document.createElement("div");
    this.currentGroup.classList.add("sidePanelItem");
    const groupTitle = document.createElement("h3");
    groupTitle.append(title);
    this.currentGroup.appendChild(groupTitle);
    this.domElement.append(this.currentGroup);
  }

  endGroup() {
    this.currentGroup = undefined;
  }

  appendCurrentGroup(data) {
    if (!this.currentGroup) {
      throw new Error("No active group to append data");
    }

    const dataDiv = document.createElement("div");
    dataDiv.append(data);
    this.currentGroup.appendChild(dataDiv);
  }

  reset() {
    this.domElement.innerText = "";
  }
}

class outputPanel {
  constructor() {
    this.domElement = document.getElementById("outputDiv");
    this.buttonElement = document.getElementById("copyBtn");

    this.buttonElement.onclick = this.onClickHandler.bind(this);
  }

  addLine(line) {
    const lineElement = document.createElement("div");
    lineElement.append(line);
    this.domElement.appendChild(lineElement);
  }

  onClickHandler(event) {
    try {
      navigator.clipboard.writeText(this.domElement.innerText);
      console.log("Text copied to clipboard");
    } catch {
      console.error("Failed to copy text: ", err);
    }
  }

  reset() {
    this.domElement.innerText = "";
  }
}

const MODE_OBJECTS = {
  "roi": Polygon,
  "lc": LineCrossing,
};

// let getModeObj = (mode) => {
//   switch (mode) {
//     case "roi":
//       return Polygon;
//     case "lc":
//       return LineCrossing;
//     default:
//       throw new Error("Invalid mode");
//   }
// };

class AppFrame {
  constructor() {
    this.canvas = document.getElementById("imgCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.img = new Image();
    this.imgInput = document.getElementById("fromFileBtn");
    this.img.src = "image.jpg";

    this.coordDiv = document.getElementById("coordDiv");
    this.sidePanel = new SidePanel();

    this.outputPanel = new outputPanel();

    this.currentMode = "roi";
    this.roiButton = document.getElementById("roiModeButton");
    this.lcButton = document.getElementById("lcModeButton");

    this.items = [];
    this.itemCounter = 0;
    this.currentItem = undefined;

    this.img.onload = this.onImageLoad.bind(this);
    this.canvas.onclick = this.onClickHandler.bind(this);
    this.canvas.oncontextmenu = this.onRightClickHandler.bind(this);
    this.imgInput.onchange = this.onFileChange.bind(this);
    this.roiButton.onclick = this.onModeChange.bind(this, "roi");
    this.lcButton.onclick = this.onModeChange.bind(this, "lc");
  }

  startItem() {
    this.itemCounter++;
    const ObjectType = MODE_OBJECTS[this.currentMode];
    if (!ObjectType) {
      throw new Error(`Invalid mode: ${this.currentMode}`);
    }
    this.currentItem = new ObjectType(this.itemCounter);
    this.sidePanel.newGroup(
      `${this.currentMode.charAt(0).toUpperCase() + this.currentMode.slice(1)
      } #${this.currentItem.id}`,
    );
  }

  endItem() {
    if (this.currentItem.points.length <= 2) {
      return;
    }

    this.outputPanel.addLine(
      this.currentItem.getConfigString(this.xScale, this.yScale),
    );

    this.currentItem.isComplete = true;
    console.log(`${this.currentItem}`);

    this.currentItem.draw(this.ctx);
    this.items.push(this.currentItem);
    this.currentItem = undefined;
    this.sidePanel.endGroup();
  }

  onClickHandler(event) {
    let rect = this.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Scale the coordinates
    const scaledX = Math.floor(x * this.xScale);
    const scaledY = Math.floor(y * this.yScale);

    if (!this.currentItem) {
      this.startItem();
    }

    const point = new Point(x, y);
    console.log(`${point}`);

    this.currentItem.addPoint(point);
    this.currentItem.draw(this.ctx);
    this.sidePanel.appendCurrentGroup(`(${scaledX}, ${scaledY})`);

    if (this.currentItem.isComplete) {
      this.endItem();
    }
  }

  onRightClickHandler(event) {
    event.preventDefault();
    this.endItem();
    return false;
  }

  onImageLoad(event) {
    const aspectRatio = this.img.naturalWidth / this.img.naturalHeight;
    console.log(`aspectRatio: ${aspectRatio}`);
    const maxWidth = this.img.naturalWidth;
    const minWidth = 600;

    this.canvas.width = Math.max(minWidth, Math.min(maxWidth, 800));
    this.canvas.height = this.canvas.width / aspectRatio;

    this.xScale = this.img.naturalWidth / this.canvas.width;
    this.yScale = this.img.naturalHeight / this.canvas.height;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
  }

  reset() {
    this.sidePanel.reset();
    this.outputPanel.reset();
    this.items = [];
    this.itemCounter = 0;
    this.currentItem = undefined;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
  }

  onFileChange(event) {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    this.reset();
  }

  onModeChange(mode) {
    if (mode === this.currentMode) {
      return;
    }
    console.log(`MODE: ${mode}`);
    this.currentMode = mode;
    this.reset();
  }
}

window.onload = function() {
  new AppFrame();
};
