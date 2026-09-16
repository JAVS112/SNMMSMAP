document.querySelectorAll("#map img").forEach((img) => {
  img.addEventListener("dragstart", function (e) {
    e.preventDefault();
  });
});

function adjustMapScale() {
  const container = document.getElementById("map-container");
  const mapArea = document.getElementById("map");

  if (!container || !mapArea) return;

  const isPhone = window.innerWidth <= 600;

  // ==============================
  // MOBILE
  // ==============================
  if (isPhone) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Fit the 1200x1200 map inside the phone screen
    const scaleWidth = containerWidth / 1200;
    const scaleHeight = containerHeight / 1200;

    const initialScale = Math.min(scaleWidth, scaleHeight);

    mapScale = initialScale;
    mapX = 0;
    mapY = 0;
    mapRotation = 0;

    mapArea.style.transformOrigin = "center center";

    updateMapTransform();

    return;
  }

  // ==============================
  // DESKTOP / TABLET
  // ==============================

  mapArea.style.transformOrigin = "center center";

  const containerWidth = container.clientWidth - 20;
  const containerHeight = container.clientHeight - 20;

  const scaleWidth = containerWidth / 1200;
  const scaleHeight = containerHeight / 1200;

  const scale = Math.min(scaleWidth, scaleHeight, 1);

  mapArea.style.transform =
    `scale(${scale})`;
}


// =========================================
// MOBILE MAP CONTROLS
// =========================================

const mapContainer = document.getElementById("map-container");
const mapArea = document.getElementById("map");

let mapX = 0;
let mapY = 0;

let mapScale = 1;
let mapRotation = 0;


// Starting position for one finger
let startX = 0;
let startY = 0;

let startMapX = 0;
let startMapY = 0;


// Starting values for two fingers
let startDistance = 0;
let startAngle = 0;

let startCenterX = 0;
let startCenterY = 0;

let startScale = 1;
let startRotation = 0;


// =========================================
// UPDATE MAP
// =========================================

function updateMapTransform() {
  mapArea.style.transform =
    `translate(${mapX}px, ${mapY}px) ` +
    `scale(${mapScale}) ` +
    `rotate(${mapRotation}deg)`;
}


// =========================================
// DISTANCE BETWEEN TWO FINGERS
// =========================================

function getDistance(touch1, touch2) {
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;

  return Math.sqrt(dx * dx + dy * dy);
}


// =========================================
// ANGLE BETWEEN TWO FINGERS
// =========================================

function getAngle(touch1, touch2) {
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;

  return Math.atan2(dy, dx) * (180 / Math.PI);
}


// =========================================
// TOUCH START
// =========================================

mapContainer.addEventListener(
  "touchstart",
  function (e) {

    if (window.innerWidth > 600) return;

    // ==========================
    // ONE FINGER
    // ==========================

    if (e.touches.length === 1) {

      const touch = e.touches[0];

      startX = touch.clientX;
      startY = touch.clientY;

      startMapX = mapX;
      startMapY = mapY;
    }


    // ==========================
    // TWO FINGERS
    // ==========================

    if (e.touches.length === 2) {

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      startDistance =
        getDistance(touch1, touch2);

      startAngle =
        getAngle(touch1, touch2);


      // Save the CENTER between fingers
      startCenterX =
        (touch1.clientX + touch2.clientX) / 2;

      startCenterY =
        (touch1.clientY + touch2.clientY) / 2;


      startMapX = mapX;
      startMapY = mapY;

      startScale = mapScale;
      startRotation = mapRotation;
    }

  },
  { passive: false }
);


// =========================================
// TOUCH MOVE
// =========================================

mapContainer.addEventListener(
  "touchmove",
  function (e) {

    if (window.innerWidth > 600) return;

    e.preventDefault();


    // ==========================
    // ONE FINGER = PAN
    // ==========================

    if (e.touches.length === 1) {

      const touch = e.touches[0];

      const dx =
        touch.clientX - startX;

      const dy =
        touch.clientY - startY;


      mapX =
        startMapX + dx;

      mapY =
        startMapY + dy;


      updateMapTransform();
    }


    // ==========================
    // TWO FINGERS
    // ==========================

    if (e.touches.length === 2) {

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];


      // --------------------------
      // CURRENT DISTANCE
      // --------------------------

      const currentDistance =
        getDistance(touch1, touch2);


      // --------------------------
      // CURRENT ANGLE
      // --------------------------

      const currentAngle =
        getAngle(touch1, touch2);


      // --------------------------
      // ZOOM
      // --------------------------

      if (startDistance > 0) {

        const scaleChange =
          currentDistance / startDistance;

        mapScale =
          startScale * scaleChange;
      }


      // Limit zoom
      mapScale =
        Math.max(0.5, Math.min(mapScale, 3));


      // --------------------------
      // ROTATION
      // --------------------------

      const angleChange =
        currentAngle - startAngle;

      mapRotation =
        startRotation + angleChange;


      // --------------------------
      // MOVE USING FINGER CENTER
      // --------------------------

      const currentCenterX =
        (touch1.clientX + touch2.clientX) / 2;

      const currentCenterY =
        (touch1.clientY + touch2.clientY) / 2;


      mapX =
        startMapX +
        (currentCenterX - startCenterX);

      mapY =
        startMapY +
        (currentCenterY - startCenterY);


      updateMapTransform();
    }

  },
  { passive: false }
);


// =========================================
// TOUCH END
// =========================================

mapContainer.addEventListener(
  "touchend",
  function () {

    if (window.innerWidth > 600) return;

    startMapX = mapX;
    startMapY = mapY;

    startScale = mapScale;
    startRotation = mapRotation;

  },
  { passive: false }
);


// =========================================
// INITIALIZE MAP
// =========================================

window.addEventListener(
  "load",
  adjustMapScale
);


window.addEventListener(
  "resize",
  function () {

    setTimeout(
      adjustMapScale,
      200
    );

  }
);


window.addEventListener(
  "orientationchange",
  function () {

    setTimeout(
      adjustMapScale,
      500
    );

  }
);
const buildingData = {
  newBuilding: {
    name: "New Building",
    floors: [
      {
        name: "1st Floor",
        img: "FINAL/new-building-f1.png",
        rooms: [],
      },
    ],
  },

  A1: {
    name: "Building A",
    floors: [
      {
        name: "Ground Floor",
        img: "FINAL/hasd.png",
        rooms: [
          {
            name: "Room 101",
            section: "Grade 11 ICT",
            teacher: "Mr. Santos",
            subject: "Programming",
          },
        ],
      },

      {
        name: "Second Floor",
        img: "FINAL/buildingA-f2.png",
        rooms: [
          {
            name: "Room 201",
            section: "Grade 12 ICT",
            teacher: "Mr. Cruz",
            subject: "Web Development",
          },
        ],
      },
    ],
  },

  B2: {
    name: "Building B",
    floors: [
      {
        name: "1st Floor",
        img: "FINAL/buildingB-f1.png",
        rooms: [],
      },
      {
        name: "2nd Floor",
        img: "FINAL/buildingB-f2.png",
        rooms: [],
      },
    ],
  },

  C1: {
    name: "Campus Area",
    img: "FINAL/college-room-map.png",
  },

  C2: {
    name: "College Building",
    img: "FINAL/1idk22.png",
  },

  L1: {
    name: "Library",
    img: "FINAL/library-map.png",
  },

  R1: {
    name: "Room 1",
    img: "FINAL/classrooms-map.png",
  },

  R2: {
    name: "Room 2",
    img: "FINAL/classrooms-map.png",
  },

  R3: {
    name: "Room 3",
    img: "FINAL/classrooms-map.png",
  },

  A: {
    name: "Front Desk Lobby Area",
    img: "FINAL/front-desk-map.png",
  },
};

let activeBuildingKey = "";

function openFloorPlan(buildingKey) {
  const building = buildingData[buildingKey];

  if (!building) {
    console.log("Building not found:", buildingKey);
    return;
  }

  activeBuildingKey = buildingKey;

  const modal = document.getElementById("floorModal");
  const buildingName = document.getElementById("modal-building-name");
  const blueprint = document.getElementById("floor-blueprint");
  const buttonContainer = document.getElementById("floor-buttons-container");

  // Set building name
  buildingName.textContent = building.name;

  // Clear old content
  buttonContainer.innerHTML = "";

  // SINGLE IMAGE
  if (building.img) {
    blueprint.src = building.img;

    buttonContainer.style.display = "none";
  }

  // MULTIPLE FLOORS
  else if (building.floors) {
    buttonContainer.style.display = "flex";

    building.floors.forEach((floor, index) => {
      const btn = document.createElement("button");

      btn.className = "floor-btn";
      btn.textContent = floor.name;

      btn.onclick = function () {
        selectFloorLevel(index, btn);
      };

      buttonContainer.appendChild(btn);
    });

    if (building.floors.length > 0) {
      selectFloorLevel(0, buttonContainer.children[0]);
    }
  }

  // CUSTOM CLICKABLE IMAGES
  if (building.customImages) {
    building.customImages.forEach((item) => {
      const img = document.createElement("img");

      img.src = item.img;
      img.alt = item.alt;
      img.className = "custom-modal-image";

      img.onclick = function () {
        openFloorPlan(item.action);
      };

      buttonContainer.appendChild(img);
    });
  }

  // Show modal
  modal.style.display = "flex";
}

function selectFloorLevel(floorIndex, selectedButton) {
  const building = buildingData[activeBuildingKey];

  if (!building || !building.floors) {
    return;
  }

  const floor = building.floors[floorIndex];

  if (!floor) {
    return;
  }

  // Change floor image
  document.getElementById("floor-blueprint").src = floor.img;

  // Highlight selected floor
  const buttons = document.querySelectorAll(".floor-btn");

  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  if (selectedButton) {
    selectedButton.classList.add("active");
  }

  // Create room buttons for THIS floor
  showFloorRooms(floor);
}

function showRoomInfo(room) {
  const roomInfo = document.getElementById("room-info");
  const modal = document.getElementById("roomInfoModal");

  roomInfo.innerHTML = `
    <h2>${room.name}</h2>

    <p>
      <strong>Section:</strong>
      ${room.section}
    </p>

    <p>
      <strong>Teacher:</strong>
      ${room.teacher}
    </p>

    <p>
      <strong>Subject:</strong>
      ${room.subject}
    </p>
  `;

  modal.style.display = "flex";
}

function showFloorRooms(floor) {
  const roomButtons = document.querySelector(".room-buttons");

  roomButtons.innerHTML = "<h3>Room Information</h3>";

  if (!floor.rooms || floor.rooms.length === 0) {
    roomButtons.innerHTML += "<p>No rooms available.</p>";
    return;
  }

  floor.rooms.forEach((room) => {
    const button = document.createElement("button");

    button.textContent = room.name;

    button.onclick = function () {
      showRoomInfo(room);
    };

    roomButtons.appendChild(button);
  });
}

function closeModal() {
  const modal = document.getElementById("floorModal");

  modal.style.display = "none";
}

// Close when clicking outside the modal box
window.addEventListener("click", function (event) {
  const modal = document.getElementById("floorModal");

  if (event.target === modal) {
    closeModal();
  }
});

function closeRoomInfo() {
  const modal = document.getElementById("roomInfoModal");

  modal.style.display = "none";
}
