const userID = "1011242519218094121"; // Change this to your Discord user ID

const elements = {
  statusBox: document.getElementById("status"),
  statusImage: document.getElementById("status-image"),
  avatarImage: document.getElementById("avatar-image"),
  avaterDecoration: document.getElementById("avatar-decoration"),
  bannerImage: document.getElementById("banner-image"),
  bannerColor: document.querySelector(".banner"),
  displayName: document.querySelector(".display-name"),
  username: document.querySelector(".username"),
  badges: document.querySelector(".badges-left"),
  customStatus: document.querySelector(".custom-status"),
  customStatusText: document.querySelector(".custom-status-text"),
  customStatusEmoji: document.getElementById("custom-status-emoji"),
};

async function fetchDiscordStatus() {
  try {
    const [AudibertData] = await Promise.all([
      fetch(`https://api.audibert.rest/user/${userID}`).then(
        (response) => response.json()
      ),
    ]);

    const data = AudibertData.data;

    const { discord_status, activities, discord_user, emoji } = lanyardData;

    elements.displayName.innerHTML = discord_user.display_name;
    elements.username.innerHTML = discord_user.username;

    let imagePath;
    switch (discord_status) {
      case "online":
        imagePath = "./res/status/online.png";
        break;
      case "idle":
        imagePath = "./res/status/idle.png";
        break;
      case "dnd":
        imagePath = "./res/status/dnd.png";
        break;
      case "offline":
        imagePath = "./res/status/offline.png";
        break;
      default:
        imagePath = "./res/status/offline.png";
        break;
    }

    if (
      activities.find(
        (activity) =>
          activity.type === 1 &&
          (activity.url.includes("twitch.tv") ||
            activity.url.includes("youtube.com"))
      )
    ) {
      imagePath = "./public/status/streaming.svg";
    }

    elements.statusImage.src = imagePath;
    elements.statusImage.alt = `Discord status: ${discord_status}`;

    elements.customStatusText.innerHTML =
      activities[0].state != null ? activities[0].state : "Not doing anything!";

    if (activities[0].emoji == null) {
      elements.customStatusEmoji.style.display = "none";
    } else {
      elements.customStatusEmoji.src = `https://cdn.discordapp.com/emojis/${activities[0].emoji.id}?format=webp&size=24&quality=lossless`;
      elements.customStatusEmoji.style.marginRight = "5px";
    }

    if (activities[0].state == null && activities[0].emoji == null) {
      elements.customStatus.style.display = "none";
      elements.customStatusEmoji.style.display = "none";
      elements.customStatusText.style.display = "none";
      elements.customStatus.removeAttribute("style");
      elements.customStatusEmoji.removeAttribute("style");
      elements.customStatusText.removeAttribute("style");
    } else {
      elements.customStatus.style.display = "flex";
    }
  } catch (error) {
    console.error("Không thể Fetch API Discord: ", error);
  }
}

// Logic for tooltips
const tooltips = document.querySelectorAll(".tooltip");
tooltips.forEach((tooltip) => {
  tooltip.addEventListener("mouseenter", () => {
    const ariaLabel = tooltip.getAttribute("aria-label");
    tooltip.setAttribute("data-tooltip-content", ariaLabel);
  });

  tooltip.addEventListener("mouseleave", () => {
    tooltip.removeAttribute("data-tooltip-content");
  });
});

// const links = document.querySelectorAll("a");

// links.forEach((link) => {
// 	const href = link.getAttribute("href");
// 	link.setAttribute("title", href);
// });

const anchors = document.getElementsByTagName("a");

for (let i = 0; i < anchors.length; i++) {
  const anchor = anchors[i];
  const href = anchor.getAttribute("href");
  if (href) {
    anchor.setAttribute("title", href);
  }
}

// Fetch Discord status on page load
fetchDiscordStatus();
// Fetch Discord status every 6 seconds
setInterval(fetchDiscordStatus, 6000);