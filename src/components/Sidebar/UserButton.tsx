"use client";


import { Icons } from "../Icons";

interface UserButtonProps {
  onClick: () => void;
}

const UserButton: React.FC<UserButtonProps> = ({ onClick }) => {

  return (
      <div className="relative flex group h-[48px] shrink-0">
          <div
              className="absolute top-1/2 -translate-y-1/2 font-semibold w-full flex-1 flex items-center pointer-events-none select-none ring-inset pl-14 pr-9 z-0">
            <span className="truncate overflow-hidden w-max">
              user</span>
              <Icons.CaretSort className="h-4 w-4 shrink-0"/>
          </div>
          <Icons.DoubleArrowLeft
              onClick={onClick}
              className="h-6 w-6 p-1 hover:bg-accent-foreground/20 rounded-sm absolute top-1/2 -translate-y-1/2 right-4 z-10 cursor-pointer"
          />
      </div>
  );
};

export default UserButton;
