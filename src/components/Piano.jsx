export default function Piano({ activeNote }) {
  const notes = [
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
    "B",
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "8px",
        marginTop: "25px",
      }}
    >
      {notes.map((note) => {
        const isActive =
          activeNote?.startsWith(note);

        return (
          <div
            key={note}
            style={{
              width: "45px",
              height: "140px",
              borderRadius: "12px",
              background: isActive
                ? "#6366f1"
                : "#f8fafc",
              color: isActive
                ? "white"
                : "black",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: "12px",
              fontWeight: "bold",
              transition: "0.15s",
              boxShadow: isActive
                ? "0 0 20px #6366f1"
                : "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            {note}
          </div>
        );
      })}
    </div>
  );
}