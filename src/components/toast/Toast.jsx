const styles = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  warning: "bg-yellow-500 text-black",
};

const Toast = ({ message, type }) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm
                  animate-slide-in ${styles[type]}`}
    >
      {message}
    </div>
  );
};

export default Toast;
