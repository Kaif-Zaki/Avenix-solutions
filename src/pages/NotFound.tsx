import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f2e8] px-4 text-stone-950">
      <div className="w-full max-w-md rounded-lg border border-stone-900/10 bg-white p-10 text-center shadow-xl shadow-stone-900/10">
        <h1 className="text-5xl font-bold text-stone-950">404</h1>
        <p className="mt-3 text-stone-700">This page is not part of the Nexora Tech site.</p>
        <Link to="/" className="mt-6 inline-block rounded-lg bg-[#23443d] px-5 py-2.5 font-bold text-white transition hover:bg-[#17211f]">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
