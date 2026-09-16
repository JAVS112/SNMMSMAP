document.querySelectorAll("#map img").forEach((img) => {
  img.addEventListener("dragstart", function (e) {
    e.preventDefault();
  });
});

function adjustMapScale() {
  const container = document.getElementById("map-container");
  const mapArea = document.getElementById("map");

  if (!container || !mapArea) return;

  // Reset previous transform
  mapArea.style.transform = "none";

  const isPhonePortrait =
    window.innerWidth <= 600 && window.innerHeight > window.innerWidth;

  // Phone portrait: keep full map size and allow scrolling
  if (isPhonePortrait) {
    mapArea.style.transform = "none";
    mapArea.style.transformOrigin = "top left";
    return;
  }

  // Desktop, tablet, and landscape mode
  const containerWidth = container.clientWidth - 20;
  const containerHeight = container.clientHeight - 20;

  const scaleWidth = containerWidth / 1200;
  const scaleHeight = containerHeight / 1200;

  const scale = Math.min(scaleWidth, scaleHeight, 1);

  mapArea.style.transform = `scale(${scale})`;

  // Center when scaling
  mapArea.style.transformOrigin = "center center";
}

window.addEventListener("load", adjustMapScale);

window.addEventListener("resize", () => {
  setTimeout(adjustMapScale, 200);
});

window.addEventListener("orientationchange", () => {
  setTimeout(adjustMapScale, 500);
});
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
