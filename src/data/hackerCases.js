export function getRandomCase() {
  return {
    title: "THE METHYLAMINE BREACH",
    briefing: "At 00:00 hours, highly sensitive methylamine shipment manifests were exfiltrated from the Madrigal Electromotive logistics server. Four network aliases were active. Review the dossiers and find the mole.",
    culprit: "WALTER",
    explanation: "Walter claimed to be at the car wash, but network logs showed outgoing database transfers perfectly matching the encryption signature of his 'Heisenberg' alias.",
    suspects: [
      {
        name: "WALTER",
        role: "CHEMISTRY CONSULTANT",
        // Put your actual image URL here, e.g., "/assets/walt.png"
        image: null, 
        alibi: "Claimed to be managing the cash register at the A1A Car Wash from 11:00 PM to 1:00 AM.",
        clues: "Database logs show an authorized override code was used. Walter was seen near Gus's admin terminal earlier that day."
      },
      {
        name: "JESSE",
        role: "FIELD DISTRIBUTOR",
        image: null,
        alibi: "Was hosting a massive house party and playing video games until 4:00 AM.",
        clues: "His IP address showed network pings, but his account strictly lacks the root permissions required to access the manifest database."
      },
      {
        name: "GUS",
        role: "REGIONAL MANAGER",
        image: null,
        alibi: "Working late in the back office of the flagship Los Pollos Hermanos restaurant.",
        clues: "Security cameras and keycard logs confirm he never left his office. No remote VPN access was logged under his credentials."
      },
      {
        name: "SAUL",
        role: "LEGAL COUNSEL",
        image: null,
        alibi: "Filming a late-night 'Better Call Saul' TV commercial in his strip-mall office.",
        clues: "His terminal showed heavy network traffic, but it was strictly routing to offshore shell company banking portals, not logistics."
      }
    ]
  };
}