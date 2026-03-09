import { Bell } from "lucide-react";

export const NotificationBell = ({ notifications }) => {

  return (
    <div className="relative">

      <Bell className="text-white cursor-pointer" />

      {notifications.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
          {notifications.length}
        </span>
      )}

    </div>
  );

};