// =========================================
// SNMMS DIGITAL SCHOOL MAP - script.js
// =========================================
// IMPORTANT: In your index.html, make sure the <script> tag has "defer" on it,
// and it can stay in <head> or before <body> - defer makes it wait until
// the HTML page has finished loading before running this file. Example:
//
//   <script src="script.js" defer></script>
//
// Without "defer", this file tries to grab #map-container and #map before
// they exist yet, and everything below silently fails.


// -----------------------------------------
// 1. GRAB THE MAP ELEMENTS FROM THE PAGE
// -----------------------------------------
const mapContainer = document.getElementById("map-container");
const mapArea = document.getElementById("map");

// This is the "real" size of your map artwork (the .map-area box in your CSS
// is 1200px by 1200px). We use these numbers to figure out how much to shrink
// the map so it fits inside the visible window, no matter the screen size.
const MAP_WIDTH = 1200;
const MAP_HEIGHT = 1200;


// -----------------------------------------
// 2. STOP IMAGES FROM BEING DRAGGED
// -----------------------------------------
// This just prevents the "ghost image" drag effect when someone clicks
// and drags on a map image.
document.querySelectorAll("#map img").forEach((img) => {
  img.addEventListener("dragstart", function (e) {
    e.preventDefault();
  });
});


// -----------------------------------------
// 3. SCALE THE MAP TO FIT ITS CONTAINER
// -----------------------------------------
// This is the function that fixes the "zoomed in" problem.
// It measures how big the container is right now (which changes based on
// your CSS media query for phones vs desktop), then shrinks the map down
// so the WHOLE 1200x1200 map fits inside, instead of getting cropped.
function adjustMapScale() {
  if (!mapContainer || !mapArea) return;

  const isMobile = window.innerWidth <= 600;

  // MOBILE: show the map at its real, full size (no shrinking).
  // The container will scroll/swipe naturally instead.
  if (isMobile) {
    mapArea.style.transform = "none";
    mapArea.style.left = "0px";
    mapArea.style.top = "0px";
    return;
  }

  // DESKTOP: shrink the map down so the WHOLE thing fits in the box,
  // then center it.
  const scaleX = mapContainer.clientWidth / MAP_WIDTH;
  const scaleY = mapContainer.clientHeight / MAP_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  const scaledWidth = MAP_WIDTH * scale;
  const scaledHeight = MAP_HEIGHT * scale;

  const offsetX = (mapContainer.clientWidth - scaledWidth) / 2;
  const offsetY = (mapContainer.clientHeight - scaledHeight) / 2;

  mapArea.style.transform = `scale(${scale})`;
  mapArea.style.transformOrigin = "top left";
  mapArea.style.left = `${offsetX}px`;
  mapArea.style.top = `${offsetY}px`;
}

// Run it once as soon as everything on the page has loaded...
window.addEventListener("load", adjustMapScale);

// ...and run it again every time the window is resized (rotating a phone,
// resizing a browser window, etc.) so the map keeps fitting correctly.
window.addEventListener("resize", adjustMapScale);


// -----------------------------------------
// 4. BUILDING / FLOOR / ROOM DATA
// -----------------------------------------
// This is just a big object holding info about every clickable building.
// Buildings with "floors" show a floor picker inside the popup.
// Buildings with just "img" show a single image with no floor picker.
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

// Keeps track of which building's popup is currently open,
// so other functions (like selectFloorLevel) know which one to work with.
let activeBuildingKey = "";


// -----------------------------------------
// 5. OPEN THE BUILDING POPUP (MODAL)
// -----------------------------------------
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

  // Set the building's name at the top of the popup
  buildingName.textContent = building.name;

  // Clear any old floor buttons from the last time a popup was opened
  buttonContainer.innerHTML = "";

  // CASE 1: Building has a single image (no floor picker needed)
  if (building.img) {
    blueprint.src = building.img;
    buttonContainer.style.display = "none";
  }

  // CASE 2: Building has multiple floors (show floor picker buttons)
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

    // Automatically show the first floor when the popup opens
    if (building.floors.length > 0) {
      selectFloorLevel(0, buttonContainer.children[0]);
    }
  }

  // CASE 3 (optional): Building has extra clickable images inside its popup
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

  // Finally, actually show the popup
  modal.style.display = "flex";
}


// -----------------------------------------
// 6. SWITCH BETWEEN FLOORS INSIDE A POPUP
// -----------------------------------------
function selectFloorLevel(floorIndex, selectedButton) {
  const building = buildingData[activeBuildingKey];

  if (!building || !building.floors) {
    return;
  }

  const floor = building.floors[floorIndex];
  if (!floor) {
    return;
  }

  // Swap the blueprint image to this floor's image
  document.getElementById("floor-blueprint").src = floor.img;

  // Highlight the button for the floor that's currently selected
  const buttons = document.querySelectorAll(".floor-btn");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
  if (selectedButton) {
    selectedButton.classList.add("active");
  }

  // Rebuild the room buttons list for this specific floor
  showFloorRooms(floor);
}


// -----------------------------------------
// 7. SHOW ROOM DETAILS IN A SEPARATE POPUP
// -----------------------------------------
function showRoomInfo(room) {
  const roomInfo = document.getElementById("room-info");
  const modal = document.getElementById("roomInfoModal");

  roomInfo.innerHTML = `
    <h2>${room.name}</h2>
    <p><strong>Section:</strong> ${room.section}</p>
    <p><strong>Teacher:</strong> ${room.teacher}</p>
    <p><strong>Subject:</strong> ${room.subject}</p>
  `;

  modal.style.display = "flex";
}


// -----------------------------------------
// 8. BUILD THE LIST OF ROOM BUTTONS FOR A FLOOR
// -----------------------------------------
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


// -----------------------------------------
// 9. CLOSE POPUPS
// -----------------------------------------
function closeModal() {
  const modal = document.getElementById("floorModal");
  modal.style.display = "none";
}

function closeRoomInfo() {
  const modal = document.getElementById("roomInfoModal");
  modal.style.display = "none";
}

// Close the building popup if someone clicks the dark overlay outside it
window.addEventListener("click", function (event) {
  const modal = document.getElementById("floorModal");
  if (event.target === modal) {
    closeModal();
  }
});