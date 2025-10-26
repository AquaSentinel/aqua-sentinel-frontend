export default function Footer() {
  const team = [
    { name: "Abhinav Chandra", url: "https://github.com/msabhinavchandra" },
    { name: "K.S.N Darshin", url: "https://github.com/DarshinK" },
    { name: "P. Devi Sainath", url: "https://github.com/sainath12204" },
    { name: "Princi Jain", url: "https://github.com/j-princi3" },
    { name: "Rangaraju Viishhnu", url: "https://github.com/viishhnur" },
  ];
  return (
    <footer
      id="footer-about"
      className="mt-20 border-t bg-gradient-to-b from-transparent to-gray-50
                 border-gray-200/70
                 dark:from-transparent dark:to-[#0b0e13] dark:border-gray-800"
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <span className="text-xl md:text-3xl font-bold bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              AQUA SENTINEL
          </span>
            <p className="mt-3 max-w-xs text-sm text-gray-700 dark:text-gray-300">
              Unified ship & marine-debris detection with a clean, accessible
              interface.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-black">
              Product
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="#demo"
                  className="text-gray-700 hover:text-indigo-600 dark:text-black-300 dark:hover:text-indigo-400"
                >
                  Demo
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Resources
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-fuchsia-600 dark:text-gray-300 dark:hover:text-fuchsia-400"
                >
                  Docs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-fuchsia-600 dark:text-gray-300 dark:hover:text-fuchsia-400"
                >
                  Templates
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-fuchsia-600 dark:text-gray-300 dark:hover:text-fuchsia-400"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              About
            </h4>
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Our dedicated team behind{" "}
              <span className="font-semibold text-indigo-500 dark:text-indigo-400">
                Aqua Sentinel
              </span>{" "}
              is comprised of{" "}
              {team.map((member, idx) => (
                <span key={idx}>
                  <a
                    href={member.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-fuchsia-500 dark:text-blue-400 dark:hover:text-fuchsia-400 font-medium transition-colors"
                  >
                    {member.name}
                  </a>
                  {idx < team.length - 2
                    ? ", "
                    : idx === team.length - 2
                    ? ", and "
                    : "."}
                </span>
              ))}{" "}
              Together, we are committed to leveraging cutting-edge AI
              technology to combat marine pollution and protect our oceans.
            </p>
            <div className="mt-4 flex gap-3">
              {[
                {
                  label: "T",
                  bg: "bg-indigo-100 dark:bg-indigo-900/40",
                  txt: "text-indigo-600 dark:text-indigo-300",
                },
                {
                  label: "G",
                  bg: "bg-gray-100 dark:bg-white/10",
                  txt: "text-gray-900 dark:text-gray-100",
                },
                {
                  label: "D",
                  bg: "bg-pink-100 dark:bg-pink-900/40",
                  txt: "text-pink-600 dark:text-pink-300",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${s.bg} ${s.txt} transition hover:opacity-80`}
                >
                  <span className="text-sm font-semibold">{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200/70 pt-6 text-center text-xl text-gray-600 dark:border-gray-800 dark:text-gray-400">
          © {new Date().getFullYear()} AQUA SENTINEL. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
