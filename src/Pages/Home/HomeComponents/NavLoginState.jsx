import { Link } from "react-router-dom";

export const NavUserState = () => {
  return (
    <div className="flex flex-row gap-4">
      <Link>
        <img src="/assets/home/likes.svg" alt="" />
      </Link>
      <Link>
        <img src="/assets/home/cart.svg" alt="" />
      </Link>
    </div>
  );
};

export const NavGuestState = () => {
  return (
    <div className="flex flex-row gap-1 items-center">
      <Link>
        <img src="/assets/home/profile.svg" alt="" />
      </Link>
      <button>
        <img src="/assets/home/toggle.svg" alt="" />
      </button>
    </div>
  );
};
