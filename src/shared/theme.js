export const colors = {
  bg: "#160404",
  text: "#fff0f0",
  textHeadline: "#ffb0b0",
  textFact: "#ffcccc",
  textTitle: "#ff6060",
  textMuted: "#aa7777",
  link: "#ffaaaa",
  linkBg: "rgba(255, 60, 60, 0.15)",
  donateBg: "#c01010",
  donateBorder: "rgba(255, 80, 80, 0.5)",
  border: "rgba(255, 100, 100, 0.15)",
  counterAlert: "#ff3333",
  ackBg: "#2d0808",
};

export const fontFamily = "'Segoe UI', system-ui, sans-serif";

export const linkBase = {
  color: colors.link,
  textDecoration: "none",
  background: colors.linkBg,
  borderRadius: "4px",
  cursor: "pointer",
};

export const donateBtnBase = {
  ...linkBase,
  background: colors.donateBg,
  color: "#fff",
  fontWeight: "600",
};
