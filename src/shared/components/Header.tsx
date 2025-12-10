import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef } from "react";
import { Input } from "@progress/kendo-react-inputs";
import map from "lodash-es/map";

import { useDispatch } from "react-redux";
import { toggleMobileSidebar } from "../../app/store/uiSlice";

export default function Header() {
  const dispatch = useDispatch();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const columns = [
    "SAV-3184",
    "SHIPS",
    "Discharge",
    "American Pride",
    "MCK - Jacksonville",
    "ULSD",
    "01-Jan-2023",
    "01-Jan-2023",
    "Working",
    "Reported",
    "Retain",
    "Issued",
  ];

  useEffect(() => {
    if (typeof window === "undefined" || !headerRef.current) {
      return;
    }

    const updateHeight = () => {
      if (!headerRef.current) {
        return;
      }
      document.documentElement.style.setProperty(
        "--app-header-height",
        `${headerRef.current.offsetHeight}px`
      );
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerRef.current);
    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const handleMobileSidebar = () => {
    dispatch(toggleMobileSidebar());
  };
  return (
    <div ref={headerRef} className="sticky top-0 z-40 w-full shadow-md">
      <div className="bg-primary w-full text-white px-4 py-2 flex items-center gap-4">
        {/* <FontAwesomeIcon
          onClick={handleMobileSidebar}
          icon={faBars}
          className="cursor-pointer lg:hidden"
        /> */}
        
        <div className="lg:hidden">
          <FontAwesomeIcon
            onClick={handleMobileSidebar}
            icon={faBars}
            className="cursor-pointer"
          />
        </div>

        <div className="font-bold text-lg tracking-wide">CAMIN</div>

        {/* SEARCH INPUT */}
        <div className="relative w-64">
          <Input placeholder="Search..." />
          {/* <span className="absolute right-3 top-2.5 text-gray-500">🔍</span> */}
        </div>

        <div className="hidden lg:flex gap-2">
          <Input placeholder="Invoice Number..." />
          <Input placeholder="File Number..." />
          <Input placeholder="Order Number..." />
        </div>

        {/* SPACER */}
        <div className="flex-1"></div>

        {/* ICONS SECTION */}
        <div className="flex items-center gap-4 xl:gap-6 lg:text-xl">
          <FontAwesomeIcon icon={faHome} className="cursor-pointer" />
          <FontAwesomeIcon icon={faStar} className="cursor-pointer" />
          <FontAwesomeIcon icon={faUser} className="cursor-pointer" />
        </div>
      </div>

      {/* SECOND NAV (TAB STYLE) */}
      <div className="flex bg-primary text-white text-sm px-4 py-2 gap-6 overflow-x-auto">
        {map(columns, (item, index) => (
          <div
            key={index}
            className="cursor-pointer hover:text-yellow-300 whitespace-nowrap"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
