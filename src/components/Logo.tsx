export default function Logo({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-green-400"
    >
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" opacity="0.3" />
      <path
        d="M32 44c-6-5-10-11-10-18a10 10 0 0 1 20 0c0 7-4 13-10 18z"
        fill="currentColor"
      />
      <path
        d="M32 28c-4 0-7-3-7-7s3-7 7-7 7 3 7 7-3 7-7 7z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}
