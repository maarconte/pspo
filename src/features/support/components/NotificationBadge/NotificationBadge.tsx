import { useSupportNotificationStore } from '../../../../stores/useSupportNotificationStore';
import './NotificationBadge.scss';

export const NotificationBadge = () => {
  const unreadCount = useSupportNotificationStore((s) => s.unreadCount);

  if (unreadCount === 0) return null;

  return (
    <span className="notif-badge" aria-label={`${unreadCount} message(s) non lu(s)`}>
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
};
