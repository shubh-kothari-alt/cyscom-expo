// Each pool has more than 5 entries so rounds can be shuffled/rotated.
// isPhish: true => correct answer is PHISH. reasons: shown in the feedback card.

export const MESSAGE_POOL = [
  {
    id: "madrigal-suspend",
    channel: "EMAIL",
    from: "it-support@madrigal-secure.com",
    subject: "URGENT: Logistics Portal Suspension",
    body:
      "Your Madrigal Electromotive logistics account will be suspended in 30 minutes due to anomalous server requests.\n\nYour account requires immediate verification.\n\nVerify now: madrigal-secure-auth.com\n\nFailure to verify will result in a permanent lockout from the supply chain network.",
    isPhish: true,
    reasons: [
      "Artificial urgency (30-minute deadline)",
      "Domain is a spoofed version of the official madrigalelectromotive.com",
      "Threatens permanent account loss to force a quick, panicked click",
    ],
  },
  {
    id: "pollos-schedule",
    channel: "EMAIL",
    from: "hr@lospolloshermanos.com",
    subject: "Update: Q3 Regional Shift Schedule",
    body:
      "To all regional staff,\n\nThe updated shift schedule for Q3 has been uploaded to the internal employee portal.\n\nPlease review your hours for the upcoming month. Contact your shift manager if you need to request any coverage.",
    isPhish: false,
    reasons: [
      "No embedded links asking for credentials",
      "Sent from the legitimate corporate domain",
      "Routine, mundane internal communication with no pressure tactics",
    ],
  },
  {
    id: "mesa-alert",
    channel: "SMS",
    from: "MESA-ALERT",
    subject: null,
    body:
      "MESA CREDIT UNION ALERT: Your account has been flagged for suspicious cash deposits.\n\nConfirm your identity immediately at mesa-secure-verification.xyz to avoid an IRS referral.",
    isPhish: true,
    reasons: [
      "Banks never ask for verification via random SMS links",
      "Highly suspicious .xyz domain instead of the bank's official site",
      "Uses extreme intimidation (IRS referral) to force compliance",
    ],
  },
  {
    id: "saul-consult",
    channel: "EMAIL",
    from: "appointments@goodmanlegal.com",
    subject: "Reminder: Retainer Consultation",
    body:
      "This is a reminder for your scheduled legal consultation with Mr. Goodman tomorrow at 2:00 PM.\n\nPlease bring all requested financial documents. If you need to reschedule, call the front desk directly.",
    isPhish: false,
    reasons: [
      "Standard business communication",
      "No request for personal information over email",
      "Offers a safe, verifiable alternate contact method (calling the desk)",
    ],
  },
  {
    id: "ice-station-audit",
    channel: "EMAIL",
    from: "compliance@ice-station-zebra.net",
    subject: "ACTION REQUIRED: Offshore Tax Audit Documents",
    body:
      "We have received a notice of discrepancy regarding your recent wire transfers.\n\nTo avoid asset freezing, download and complete the attached encrypted PDF form within 24 hours: secure-routing-docs.net/audit\n\nDo not discuss this over open channels.",
    isPhish: true,
    reasons: [
      "External, unverified domain masking as a compliance portal",
      "Tight 24-hour deadline combined with severe financial threats",
      "The 'encrypted PDF' link is a classic malware delivery tactic",
    ],
  },
  {
    id: "a1a-inventory",
    channel: "EMAIL",
    from: "management@a1acarwash.com",
    subject: "Restock: Air fresheners and filtration",
    body:
      "Team,\n\nWe are running low on the pine air fresheners again. Also, please remember to check the water filtration pressure gauges before closing tonight.\n\nLog the readings in the back office ledger.\n\n- Bogdan",
    isPhish: false,
    reasons: [
      "Sent from the legitimate business domain",
      "Instructions involve physical, on-site actions, not digital links",
      "Tone and requests match routine daily operations",
    ],
  },
  {
    id: "golden-moth-delivery",
    channel: "SMS",
    from: "LOGISTICS",
    subject: null,
    body:
      "Golden Moth Chemical: Your freight delivery (40-gallon drums) is delayed due to an incomplete routing address.\n\nUpdate your manifest and pay a $15 redelivery fee here: track-freight-nm.top",
    isPhish: true,
    reasons: [
      "Odd top-level domain (.top) mimicking a logistics tracking site",
      "Legitimate B2B chemical suppliers do not request fee payments via SMS short links",
      "Exploits the anxiety of a delayed high-value shipment",
    ],
  },
  {
    id: "wynne-chemistry",
    channel: "EMAIL",
    from: "c.molina@jpwynne.edu",
    subject: "Chemistry Department - Lab Inventory",
    body:
      "Walter,\n\nJust a reminder that the district requires a full inventory of the chemistry lab storage room by the end of this week. Please submit the physical paperwork to the main office by Friday at 3 PM.",
    isPhish: false,
    reasons: [
      "Sent from an internal school district domain",
      "Requires physical paperwork rather than clicking a suspicious portal link",
      "No artificial urgency; standard administrative deadline",
    ],
  },
  {
    id: "vamonos-access",
    channel: "EMAIL",
    from: "admin@vamonospest-verify.com",
    subject: "URGENT: Warehouse Access Code Expiring",
    body:
      "Your Vamonos Pest employee warehouse access code will expire in 15 minutes.\n\nLog in with your employee ID and master PIN here: vamonospest-verify.com/auth\n\nThis is your final notice. Failure to verify means loss of structural access.",
    isPhish: true,
    reasons: [
      "Domain is spoofed to look like the main company site",
      "Asks for a sensitive master PIN on an external login page",
      "Extremely short countdown to induce panic",
    ],
  },
  {
    id: "madrigal-meeting",
    channel: "APP NOTIFICATION",
    from: "Corporate Calendar",
    subject: "Invitation: Q3 Supply Chain Review",
    body:
      "Peter Schuler has invited you to a meeting.\n\nWhen: Thursday, 10:00 AM\nTopic: European Logistics and Supply Chain Optimization\n\nAccept or decline in your calendar app.",
    isPhish: false,
    reasons: [
      "Ordinary corporate calendar invite",
      "No demands for credentials, PINs, or urgent out-of-band actions",
      "Action is safely contained entirely within the calendar application",
    ],
  },
];

export function getRandomRounds(count = 5) {
  const shuffled = [...MESSAGE_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}