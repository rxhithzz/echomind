export default function Button({ text, onClick, variant = "primary" }) {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-semibold transition-colors ${styles[variant]}`}
    >
      {text}
    </button>
  );
}
