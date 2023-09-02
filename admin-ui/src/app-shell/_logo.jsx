export default function Logo({ colorScheme }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <img
        src="/castle.png"
        alt="corps castle"
        height="40"
        style={{ marginRight: "1rem" }}
      /> */}
      <span
        id="logo"
        style={{
          fontSize: `2rem`,
          color: colorScheme === "light" ? "ccc" : "fff",
        }}
      >
        AIRDROP Admin
      </span>
    </div>
  );
}
