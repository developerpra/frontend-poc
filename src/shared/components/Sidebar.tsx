import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faBars,
  faHome,
  faHammer,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { closeMobileSidebar } from "../../app/store/uiSlice";

export default function Sidebar() {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.ui.isMobileSidebarOpen);
  const navigate = useNavigate();
  const headerOffset = "var(--app-header-height, 0px)";

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => dispatch(closeMobileSidebar())}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed lg:sticky z-50 bg-gray-100 shadow-[3px_0_6px_rgba(0,0,0,0.15)]
          transition-transform duration-300 overflow-y-auto
          
          /* Mobile styles: slide in/out, fixed width */
          top-0 left-0 h-full w-64
          ${open ? "translate-x-0" : "-translate-x-full"}

          /* Desktop styles: always visible, sticky, specific top/height */
          lg:translate-x-0 lg:w-16 lg:top-[var(--app-header-height,0px)]
          lg:h-[calc(100vh-var(--app-header-height,0px))]
        `}
      >
        {/* MOBILE HEADER (Close Button) - Hidden on Desktop */}
        <div className="flex justify-end p-4 lg:hidden">
          <FontAwesomeIcon
            icon={faXmark}
            className="w-6 h-6 text-gray-700 cursor-pointer"
            onClick={() => dispatch(closeMobileSidebar())}
          />
        </div>

        {/* DESKTOP TOGGLE (Removed as requested: "Desktop version remains static") */}
        {/* If you want a toggle on desktop, uncomment below, but user asked for static. */}
        {/* 
        <div className="hidden lg:flex items-center justify-center py-4 cursor-pointer">
           <FontAwesomeIcon icon={faBars} ... />
        </div> 
        */}

        {/* MENU ITEMS */}
        <div className="flex flex-col items-center lg:items-center gap-6 mt-6 px-4 lg:px-0">
          <button
            className="flex items-center gap-4 text-gray-700 hover:text-blue-600 w-full lg:justify-center"
            onClick={() => {
              navigate("/");
              dispatch(closeMobileSidebar());
            }}
          >
            <FontAwesomeIcon icon={faHome} className="w-6 h-6 min-w-[24px]" />
            <span className="text-sm font-medium lg:hidden">Home</span>
          </button>

          <button
            className="flex items-center gap-4 text-gray-700 hover:text-blue-600 w-full lg:justify-center"
            onClick={() => {
              navigate("/Maintenance");
              dispatch(closeMobileSidebar());
            }}
          >
            <FontAwesomeIcon icon={faHammer} className="w-6 h-6 min-w-[24px]" />
            <span className="text-sm font-medium lg:hidden">Maintenance</span>
          </button>
        </div>
      </aside>
    </>
  );
}
