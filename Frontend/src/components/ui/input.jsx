export default function Input({
  label,
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-gray-400">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          w-full px-3 py-2 rounded-lg
          bg-gray-900
          border border-gray-800
          text-gray-100
          placeholder:text-gray-500
          outline-none
          focus:border-blue-500
          focus:ring-1 focus:ring-blue-500
          transition
          ${className}
        `}
      />
    </div>
  );
}
